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
				const shadow = this.ensureShadow();
				this.renderTemplate(shadow);
				this.startScope(shadow);
			}

			disconnectedCallback() {
				this._stopScope?.();
				this._stopScope = null;
			}

			private ensureShadow(): ShadowRoot {
				return this.shadowRoot ?? this.attachShadow({ mode: "open" });
			}

			private renderTemplate(shadow: ShadowRoot) {
				shadow.innerHTML = fn({ $: () => new ElementWrapper([]) } as any);
			}

			private startScope(shadow: ShadowRoot) {
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
		},
	);
};
