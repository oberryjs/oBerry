import { ElementWrapper } from "./wrapper";

export function $<K extends keyof HTMLElementTagNameMap>(
	selector: K,
): ElementWrapper<HTMLElementTagNameMap[K]>;
export function $<T extends HTMLElement = HTMLElement>(
	selector: string,
): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(
	selector: NodeListOf<T>,
): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(
	selector: T,
): ElementWrapper<T>;
export function $<T extends HTMLElement = HTMLElement>(
	selector: T[],
): ElementWrapper<T>;
export function $(
	selector: string | HTMLElement | NodeList | HTMLElement[],
): ElementWrapper<any> {
	let elements: HTMLElement[] = [];

	if (typeof selector === "string") {
		elements = Array.from(document.querySelectorAll(selector));
	} else if (selector instanceof HTMLElement) {
		elements = [selector];
	} else if (selector instanceof NodeList) {
		elements = Array.from(selector) as HTMLElement[];
	} else if (Array.isArray(selector)) {
		elements = selector;
	} else {
		throw new TypeError(
			`$(): Invalid selector type. Expected string | HTMLElement | NodeList | HTMLElement[]`,
		);
	}

	return new ElementWrapper(elements);
}
