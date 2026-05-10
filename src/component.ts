import { $effectScope } from "./reactivity";
import type { $ as globalSelector } from "./selector";
import { ElementWrapper } from "./wrapper";

export interface ComponentContext {
	$: typeof globalSelector;
}

export const $component = (
	name: string,
	fn: (ctx: ComponentContext) => string,
) => {
	customElements.define(
		name,
		class extends HTMLElement {
			private _stopScope: (() => void) | null = null;

			connectedCallback() {
				const shadow = this.attachShadow({ mode: "open" });

				// dry run with noop $ — just to get the template string
				const noop = () => new ElementWrapper<HTMLElement>([]);
				shadow.innerHTML = fn({ $: noop as unknown as typeof globalSelector });

				// real DOM exists, wire up all reactivity inside the scope
				const scopedSelector = <T extends HTMLElement = HTMLElement>(
					selector: string,
				): ElementWrapper<T> =>
					new ElementWrapper<T>(
						Array.from(shadow.querySelectorAll<T>(selector)),
					);

				this._stopScope = $effectScope(() => {
					fn({ $: scopedSelector as typeof globalSelector });
				});
			}

			disconnectedCallback() {
				this._stopScope?.();
				this._stopScope = null;
			}
		},
	);
};
