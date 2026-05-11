import { $effectScope } from "./reactivity";
import type { $ as globalSelector } from "./selector";
import { ElementWrapper } from "./wrapper";

export interface ComponentContext {
	$: typeof globalSelector;
	props: Record<string, string>;
}

export const $component = (
	name: string,
	fn: (ctx: ComponentContext) => string,
) => {
	customElements.define(
		name,
		class extends HTMLElement {
			private _stopScope: (() => void) | null = null;
			private _observer: MutationObserver | null = null;

			connectedCallback() {
				this.mount();
				this._observer = new MutationObserver(() => {
					this.unmount();
					this.mount();
				});
				this._observer.observe(this, { attributes: true });
			}

			disconnectedCallback() {
				this.unmount();
				this._observer?.disconnect();
				this._observer = null;
			}

			private mount() {
				const shadow = this.ensureShadow();
				const props = this.getProps();
				this.render(shadow, props);
				this.startScope(shadow, props);
			}

			private unmount() {
				this._stopScope?.();
				this._stopScope = null;
			}

			private getProps(): Record<string, string> {
				return Object.fromEntries(
					Array.from(this.attributes).map((attr) => [attr.name, attr.value]),
				);
			}

			private ensureShadow(): ShadowRoot {
				return this.shadowRoot ?? this.attachShadow({ mode: "open" });
			}

			private render(shadow: ShadowRoot, props: Record<string, string>) {
				shadow.innerHTML = fn({ $: () => new ElementWrapper([]), props });
			}

			private startScope(shadow: ShadowRoot, props: Record<string, string>) {
				const scopedSelector = <T extends HTMLElement = HTMLElement>(
					selector: string,
				): ElementWrapper<T> =>
					new ElementWrapper<T>(
						Array.from(shadow.querySelectorAll<T>(selector)),
					);

				this._stopScope = $effectScope(() => {
					fn({ $: scopedSelector as typeof globalSelector, props });
				});
			}
		},
	);
};
