import type { Ref } from "./reactivity";
import { $effectScope, $ref } from "./reactivity";
import type { $ as globalSelector } from "./selector";
import { ElementWrapper } from "./wrapper";

export type PropsRefs<K extends string = string> = Record<
	K,
	Ref<string | undefined>
>;

export interface ComponentContext<P extends string = string> {
	$: typeof globalSelector;
	props: PropsRefs<P>;
	onMounted: (cb: () => void) => void;
	onUnmounted: (cb: () => void) => void;
	$emit: (event: string, detail?: unknown) => void;
	$host: ElementWrapper;
}

export interface ComponentOptions {
  shadow?: false | "open" | "closed";
}

export const $component = <P extends string = string>(
	name: string,
	fn: (ctx: ComponentContext<P>) => string,
  options: ComponentOptions = { },
) => {
	if (customElements.get(name)) return;

	customElements.define(
		name,
		class extends HTMLElement {
			private _stopScope: (() => void) | null = null;
			private _unmountedCallback: (() => void) | null = null;
			private _observer: MutationObserver | null = null;
			private _propRefs: PropsRefs = {};
      private _root: this | ShadowRoot = this;

			connectedCallback() {
				this.mount();

				this._observer = new MutationObserver((mutations) => {
					for (const mutation of mutations) {
						if (mutation.type !== "attributes" || !mutation.attributeName)
							continue;
						const key = mutation.attributeName;
						const ref = this._propRefs[key];
						if (ref) {
							ref(this.getAttribute(key) ?? undefined);
						} else {
							// Create a new ref for the new attribute
							this._propRefs[key] = $ref(this.getAttribute(key) ?? undefined);
						}
					}
				});

				this._observer.observe(this, { attributes: true });
			}

			disconnectedCallback() {
				this.unmount();
				this._observer?.disconnect();
				this._observer = null;
				this._propRefs = {};
        this._root = this;
			}

			private mount() {
        this._root = options.shadow ? this.ensureShadow(options.shadow) : this;

				// Create refs for all attributes
				for (const attr of Array.from(this.attributes)) {
					this._propRefs[attr.name] = $ref<string | undefined>(attr.value);
				}

				const scopedSelector = <T extends HTMLElement = HTMLElement>(
					selector: string,
				): ElementWrapper<T> =>
					new ElementWrapper<T>(
						Array.from(this._root.querySelectorAll<T>(selector)),
					);

				const $emit = (event: string, detail?: unknown) => {
					this.dispatchEvent(
						new CustomEvent(event, { bubbles: true, composed: true, detail }),
					);
				};

				let mountedCallback: (() => void) | null = null;
				let unmountedCallback: (() => void) | null = null;

				const template = fn({
					$: scopedSelector as typeof globalSelector,
					props: this._propRefs as PropsRefs<P>,
					onMounted: (cb) => {
						mountedCallback = cb;
					},
					onUnmounted: (cb) => {
						unmountedCallback = cb;
					},
					$emit,
					$host: new ElementWrapper([this]),
				});

				this._root.innerHTML = template;
				this._unmountedCallback = unmountedCallback;

				if (mountedCallback) {
					this._stopScope = $effectScope(() => {
						mountedCallback!();
					});
				}
			}

			private unmount() {
				this._unmountedCallback?.();
				this._unmountedCallback = null;
				this._stopScope?.();
				this._stopScope = null;
			}

			private ensureShadow(mode: "open" | "closed"): ShadowRoot {
        if (this._root instanceof ShadowRoot) return this._root;
        return this.shadowRoot ?? this.attachShadow({ mode });
			}
		},
	);
};

