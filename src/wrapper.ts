import type { Ref } from "./reactivity";
import { $effect } from "./reactivity";

export class ElementWrapper<T extends HTMLElement = HTMLElement> {
	elements: T[];

	constructor(elements: T[]) {
		this.elements = elements;
	}

	get class() {
		return {
			/**
			 * Get an array of all the classes of the first element.
			 */
			get: (): string[] => {
				// ? Should this return classes of all the elements?
				return Array.from(this.elements[0]?.classList ?? []);
			},

			/**
			 * Toggle a class on all the elements.
			 */
			toggle: (name: string): this => {
				const classList = name.split(" ");
				for (const el of this.elements) {
					classList.forEach((className) => {
						el.classList.toggle(className);
					});
				}
				return this;
			},

			/**
			 * Add a class to all the elements.
			 */
			add: (name: string): this => {
				const classList = name.split(" ");
				for (const el of this.elements) {
					classList.forEach((className) => {
						el.classList.add(className);
					});
				}
				return this;
			},

			/**
			 * Remove a class on all the elements.
			 */
			remove: (name: string): this => {
				const classList = name.split(" ");
				for (const el of this.elements) {
					classList.forEach((className) => {
						el.classList.remove(className);
					});
				}
				return this;
			},

			/**
			 * Check if the first element contains a class.
			 */
			has: (name: string): boolean => {
				const el = this.elements[0];
				if (!el) {
					return false;
				}

				return el.classList.contains(name);
			},
		};
	}

	/**
	 * Get the ID of the first element.
	 */
	id(): string | undefined;
	/**
	 * Set the ID of the fist element.
	 */
	id(id: string): this;
	id(id?: string): string | undefined | this {
		if (id === undefined) {
			const el = this.elements[0];
			return el?.id ?? undefined;
		}

		if (this.elements[0]) {
			this.elements[0].id = id;
		}

		return this;
	}

	/**
	 * Apply styles to all elements.
	 */
	css(styles: Partial<CSSStyleDeclaration>): this {
		for (const el of this.elements) {
			Object.assign(el.style, styles);
		}
		return this;
	}

	/**
	 * Get the innerHTML of the first element.
	 */
	html(): string | undefined;
	/**
	 * Set the innerHTML of all elements.
	 */
	html(content: string): this;
	html(content?: string): this | string | undefined {
		if (content === undefined) {
			return this.elements[0]?.innerHTML;
		}

		for (const el of this.elements) {
			el.innerHTML = content;
		}

		return this;
	}

	/**
	 * Get the innerText of the first element.
	 */
	text(): string | undefined;
	/**
	 * Set the innerText of all elements.
	 */
	text(content: string): this;
	text(content?: string): this | string | undefined {
		if (content === undefined) {
			return this.elements[0]?.innerText;
		}

		for (const el of this.elements) {
			el.innerText = content;
		}

		return this;
	}

	/**
	 * Clear innerHTML of all elements without removing them.
	 */
	empty(): this {
		for (const el of this.elements) {
			el.innerHTML = "";
		}
		return this;
	}

	/**
	 *  Get the array of elements.
	 */
	getArray(): T[] {
		return Array.from(this.elements);
	}

	/**
	 * Get the value of the first element.
	 */
	value(): string | undefined;
	/**
	 * Set the values of all elements.
	 */
	value(newValue: string): this;
	value(newValue?: string): this | string | undefined {
		const el = this.elements[0];

		if (newValue === undefined) {
			if (!el) {
				return undefined;
			}

			if (
				el instanceof HTMLInputElement ||
				el instanceof HTMLTextAreaElement ||
				el instanceof HTMLSelectElement
			) {
				return el.value;
			}

			return undefined;
		}

		if (!el) {
			return this;
		}

		for (const el of this.elements) {
			if (
				el instanceof HTMLInputElement ||
				el instanceof HTMLTextAreaElement ||
				el instanceof HTMLSelectElement
			) {
				el.value = newValue;
			}
		}

		return this;
	}

	/**
	 * Append an HTML string to all elements.
	 */
	append(content: string): this;
	/**
	 * Append a raw HTMLElement to all elements.
	 */
	append(content: HTMLElement): this;
	/**
	 * Append all elements from another wrapper to all elements.
	 */
	append(content: ElementWrapper): this;
	append(content: string | HTMLElement | ElementWrapper): this {
		for (const el of this.elements) {
			if (typeof content === "string") {
        el.insertAdjacentHTML("beforeend", content);
			} else if (content instanceof HTMLElement) {
				el.appendChild(content.cloneNode(true));
			} else if (content instanceof ElementWrapper) {
				for (const child of content.elements) {
					el.appendChild(child.cloneNode(true));
				}
			}
		}
		return this;
	}

	/**
	 * Prepend an HTML string to all elements.
	 */
	prepend(content: string): this;
	/**
	 * Prepend a raw HTMLElement to all elements.
	 */
	prepend(content: HTMLElement): this;
	/**
	 * Prepend all elements from another wrapper to all elements.
	 */
	prepend(content: ElementWrapper): this;
	prepend(content: string | HTMLElement | ElementWrapper): this {
		for (const el of this.elements) {
			if (typeof content === "string") {
        el.insertAdjacentHTML("afterbegin", content);
			} else if (content instanceof HTMLElement) {
				el.insertBefore(content.cloneNode(true), el.firstChild);
			} else if (content instanceof ElementWrapper) {
				content.elements.forEach((childEl, index) => {
					el.insertBefore(childEl.cloneNode(true), el.children[index] || null);
				});
			}
		}
		return this;
	}

	/**
	 * Insert an HTML string immediately after each element.
	 */
	after(content: string): this;
	/**
	 * Insert a raw HTMLElement immediately after each element.
	 */
	after(content: HTMLElement): this;
	/**
	 * Insert all elements from another wrapper immediately after each element.
	 */
	after(content: ElementWrapper): this;
	after(content: string | HTMLElement | ElementWrapper): this {
		for (const el of this.elements) {
			const parent = el.parentNode;
			if (!parent) {
				continue;
			}

			if (typeof content === "string") {
				const temp = document.createElement("div");
				temp.innerHTML = content;

				while (temp.firstChild) {
					parent.insertBefore(temp.firstChild, el.nextSibling);
				}
			} else if (content instanceof HTMLElement) {
				parent.insertBefore(content.cloneNode(true), el.nextSibling);
			} else if (content instanceof ElementWrapper) {
				for (const childEl of content.elements) {
					parent.insertBefore(childEl.cloneNode(true), el.nextSibling);
				}
			}
		}
		return this;
	}

	/**
	 * Insert an HTML string immediately before each element.
	 */
	before(content: string): this;
	/**
	 * Insert a raw HTMLElement immediately before each element.
	 */
	before(content: HTMLElement): this;
	/**
	 * Insert all elements from another wrapper immediately before each element.
	 */
	before(content: ElementWrapper): this;
	before(content: string | HTMLElement | ElementWrapper): this {
		for (const el of this.elements) {
			const parent = el.parentNode;
			if (!parent) {
				continue;
			}

			if (typeof content === "string") {
				const temp = document.createElement("div");
				temp.innerHTML = content;

				while (temp.firstChild) {
					parent.insertBefore(temp.firstChild, el);
				}
			} else if (content instanceof HTMLElement) {
				parent.insertBefore(content.cloneNode(true), el);
			} else if (content instanceof ElementWrapper) {
				for (const childEl of content.elements) {
					parent.insertBefore(childEl.cloneNode(true), el);
				}
			}
		}
		return this;
	}

	/**
	 * Remove all the elements from DOM.
	 */
	remove(): this {
		for (const el of this.elements) {
			el.parentNode?.removeChild(el);
		}
		// Clear the elements array since they're no longer in the DOM
		this.elements = [];
		return this;
	}

	/**
	 * Check if the first element matches the given CSS selector.
	 */
	is(selector: string): boolean {
		const el = this.elements[0];
		if (!el) {
			return false;
		}

		return el.matches(selector);
	}

	/**
	 * Filter out elements that match the given selector, returning those that don't match.
	 */
	not(selector: string): ElementWrapper<T> {
		const filteredElements = this.elements.filter(
			(el) => !el.matches(selector),
		);
		return new ElementWrapper<T>(filteredElements);
	}

	/**
	 * Find all descendants of the wrapped elements that match the given selector.
	 */
	find(selector: string): ElementWrapper {
		const foundElements: HTMLElement[] = [];
		for (const el of this.elements) {
			const found = el.querySelectorAll(selector);
			foundElements.push(
				...Array.from(found).filter(
					(node): node is HTMLElement => node instanceof HTMLElement,
				),
			);
		}
		return new ElementWrapper([...new Set(foundElements)]);
	}

	/**
	 * Find the closest ancestor matching the selector, starting from the first element.
	 */
	closest(selector: string): ElementWrapper {
		const results: HTMLElement[] = [];

		for (const el of this.elements) {
			const found = el.closest(selector);
			if (found) results.push(found as HTMLElement);
		}

		return new ElementWrapper(results);
	}

	/**
	 * Get the parent wrapper of the first element.
	 */
	parent(): ElementWrapper {
		const el = this.elements[0];
		if (!el) {
			return new ElementWrapper([]);
		}

		const parent = el.parentElement;

		if (!parent) {
			return new ElementWrapper([]);
		}

		return new ElementWrapper([parent]);
	}

	/**
	 * Get the wrapper of the children of the selected elements.
	 * Optionally filter by CSS selector.
	 */
	children(selector?: string): ElementWrapper {
		const children: HTMLElement[] = [];
		for (const el of this.elements) {
			children.push(...(Array.from(el.children) as HTMLElement[]));
		}

		return new ElementWrapper(
			selector
				? [...children].filter((ch) => ch.matches(selector))
				: [...children],
		);
	}

	/**
	 * Get the wrapper all siblings of the selected elements.
	 * Optionally filter by CSS selector.
	 */
	siblings(selector?: string): ElementWrapper {
		const seen = new Set<HTMLElement>();
		const sibs: HTMLElement[] = [];
		for (const el of this.elements) {
			if (!el.parentElement) continue;
			// avoid duplicates
			for (const child of Array.from(el.parentElement.children)) {
				if (child !== el && child instanceof HTMLElement && !seen.has(child)) {
					seen.add(child);
					sibs.push(child);
				}
			}
		}

		return new ElementWrapper(
			selector ? sibs.filter((s) => s.matches(selector)) : sibs,
		);
	}

	/**
	 * Bind the value of a ref into the element's inner HTML.
	 */
	bindHTML<V>(ref: Ref<V>): this {
		$effect(() => {
			this.html(String(ref()));
		});

		return this;
	}

	/**
	 * Bind the value of a ref into the element's text content.
	 */
	bind<V>(ref: Ref<V>): this {
		$effect(() => {
			this.text(String(ref()));
		});

		return this;
	}

	/**
	 * Bind the value of a ref into the element's attribute.
	 */
	bindAttr<V>(attr: string, ref: Ref<V>): this {
		$effect(() => {
			this.attr(attr, String(ref()));
		});

		return this;
	}

	/**
	 * Bind the input value of the first element into a ref value.
	 */
	bindInput<V>(ref: Ref<V>): this {
		const el = this.elements[0];
		if (!el) {
			return this;
		}

		el.addEventListener("input", () => {
			ref((el as any)?.value);
		});

		$effect(() => {
			(el as any).value = String(ref());
		});

		return this;
	}

	/**
	 * Get the value of an attribute on the first element.
	 */
	attr(key: string): string | undefined;
	/**
	 * Set an attribute on all elements.
	 */
	attr(key: string, value: string): this;
	attr(key: string, value?: string): this | string | undefined {
		if (value === undefined) {
			const el = this.elements[0];
			if (!el) {
				return undefined;
			}

			const attr = el.getAttribute(key);
			return attr ?? undefined;
		}

		for (const el of this.elements) {
			el.setAttribute(key, value);
		}
		return this;
	}

	/**
	 * Get a dataset entry on the first element.
	 */
	data(key: string): string | undefined;
	/**
	 * Set a dataset entry on all elements.
	 */
	data(key: string, value: string): this;
	data(key: string, value?: string): this | string | undefined {
		if (value === undefined) {
			const el = this.elements[0];
			if (!el) {
				return undefined;
			}

			return el.dataset[key];
		}

		for (const el of this.elements) {
			el.dataset[key] = value;
		}
		return this;
	}

	/**
	 * Add an event listener to all elements.
	 */
	on<K extends keyof HTMLElementEventMap>(
		event: K,
		callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
	): this {
		for (const el of this.elements) {
			el.addEventListener(event, callback as EventListener);
		}
		return this;
	}

	/**
	 * Remove an event listener from all elements.
	 */
	off<K extends keyof HTMLElementEventMap>(event: K, callback: EventListener) {
		for (const el of this.elements) {
			el.removeEventListener(event, callback);
		}
		return this;
	}

	/**
	 * Add event listener that fires once, then removes itself.
	 */
	once<K extends keyof HTMLElementEventMap>(
		event: K,
		callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
	): this {
		for (const el of this.elements) {
			el.addEventListener(event, callback as EventListener, { once: true });
		}
		return this;
	}

	/**
	 * Get the elements at even positions (1-based indexing).
	 */
	even() {
		const elements: T[] = [];
		for (let i = 0; i < this.elements.length; i++) {
			if ((i + 1) % 2 === 0 && this.elements[i]) {
				elements.push(this.elements[i] as T);
			}
		}
		return new ElementWrapper<T>(elements);
	}

	/**
	 * Get the elements at odd positions (1-based indexing).
	 */
	odd() {
		const elements: T[] = [];
		for (let i = 0; i < this.elements.length; i++) {
			if ((i + 1) % 2 === 1 && this.elements[i]) {
				elements.push(this.elements[i] as T);
			}
		}
		return new ElementWrapper<T>(elements);
	}

	/**
	 * Hide all elements.
	 */
	hide(): this {
		for (const el of this.elements) {
			if (!el.dataset.originalDisplay) {
				const computedStyle = window.getComputedStyle(el);
				el.dataset.originalDisplay = computedStyle.display;
			}

			el.style.display = "none";
		}

		return this;
	}

	/**
	 * Show all elements.
	 */
	show(): this {
		for (const el of this.elements) {
			const originalDisplay = el.dataset.originalDisplay || "";
			el.style.display = originalDisplay === "none" ? "block" : originalDisplay;

			// Clean up the data attribute
			delete el.dataset.originalDisplay;
		}

		return this;
	}

	/**
	 * Toggle visibility of all elements.
	 */
	toggle(): this {
		for (const el of this.elements) {
			const isVisible = window.getComputedStyle(el).display !== "none";

			if (isVisible) {
				if (!el.dataset.originalDisplay) {
					el.dataset.originalDisplay = window.getComputedStyle(el).display;
				}

				el.style.display = "none";
			} else {
				const originalDisplay = el.dataset.originalDisplay || "block";
				el.style.display = originalDisplay;

				// Clean up the data attribute
				delete el.dataset.originalDisplay;
			}
		}

		return this;
	}

	/**
	 * Get the nth element (0-based indexing).
	 */
	eq(idx: number): ElementWrapper<T> {
		const el = this.elements[idx];
		return new ElementWrapper<T>(el ? [el] : []);
	}

	first() {
		return this.eq(0);
	}

	last() {
		if (this.elements.length === 0) {
			return new ElementWrapper<T>([]);
		}
		return this.eq(this.elements.length - 1);
	}

	/**
	 * Clone all elements into a new wrapper.
	 * @param deep - Whether to perform a deep clone including descendants. Defaults to `true`.
	 */
	clone(deep = true): ElementWrapper<T> {
		const clones = this.elements.map((el) => el.cloneNode(deep) as T);
		return new ElementWrapper<T>(clones);
	}

	/**
	 * Filter elements based on a predicate function or CSS selector.
	 */
	filter(
		predicate: string | ((element: T, index: number) => boolean),
	): ElementWrapper<T> {
		let filteredElements: T[];

		if (typeof predicate === "string") {
			// Filter by CSS selector
			filteredElements = this.elements.filter((el) => el.matches(predicate));
		} else {
			// Filter by predicate function
			filteredElements = this.elements.filter((el, index) =>
				predicate(el, index),
			);
		}

		return new ElementWrapper<T>(filteredElements);
	}

	/**
	 * Transform each element into a value, returning an array of results.
	 */
	map<R>(callback: (el: ElementWrapper<T>, index: number) => R): R[] {
		return this.elements.map((el, idx) =>
			callback(new ElementWrapper<T>([el]), idx),
		);
	}

	/**
	 * Accumulate a value over all elements.
	 */
	reduce<R>(
		callback: (acc: R, el: ElementWrapper<T>, index: number) => R,
		initial: R,
	): R {
		return this.elements.reduce(
			(acc, el, index) => callback(acc, new ElementWrapper<T>([el]), index),
			initial,
		);
	}

	forEach(callback: (el: ElementWrapper<T>, index: number) => void) {
		for (let i = 0; i < this.elements.length; i++) {
			const el = this.elements[i];
			if (el !== undefined) {
				callback(new ElementWrapper<T>([el]), i);
			}
		}
	}

	length(): number {
		return this.elements.length;
	}

	isEmpty() {
		return this.elements.length === 0;
	}

	/**
	 * Get the width of the first element (excluding padding, border, margin).
	 */
	width(): number | undefined;
	/**
	 * Set the width of all elements (in pixels).
	 */
	width(value: number): this;
	/**
	 * Set the width of all elements.
	 */
	width(value: string): this;
	width(value?: number | string): this | number | undefined {
		const el = this.elements[0];
		if (!el) {
			return value !== undefined ? this : undefined;
		}

		if (value === undefined) {
			const computed = window.getComputedStyle(el);
			const parsed = parseFloat(computed.width);
			return Number.isNaN(parsed) ? 0 : parsed;
		}

		for (const element of this.elements) {
			element.style.width = typeof value === "number" ? `${value}px` : value;
		}

		return this;
	}

	/**
	 * Get the height of the first element (excluding padding, border, margin).
	 */
	height(): number | undefined;
	/**
	 * Set the height of all elements (in pixels).
	 */
	height(value: number): this;
	/**
	 * Set the height of all elements).
	 */
	height(value: string): this;
	height(value?: number | string): this | number | undefined {
		const el = this.elements[0];
		if (!el) {
			return value !== undefined ? this : undefined;
		}

		if (value === undefined) {
			const computed = window.getComputedStyle(el);
			const parsed = parseFloat(computed.height);
			return Number.isNaN(parsed) ? 0 : parsed;
		}

		for (const element of this.elements) {
			element.style.height = typeof value === "number" ? `${value}px` : value;
		}

		return this;
	}

	/**
	 * Get the current coordinates of the first element relative to the document.
	 * Returns an object with `top` and `left` properties.
	 */
	offset(): { top: number; left: number } | undefined {
		const el = this.elements[0];
		if (!el) {
			return undefined;
		}

		const rect = el.getBoundingClientRect();
		return {
			top: rect.top + window.scrollY,
			left: rect.left + window.scrollX,
		};
	}

	/**
	 * Get the current coordinates of the first element relative to its offset parent.
	 * Returns an object with `top` and `left` properties.
	 */
	position(): { top: number; left: number } | undefined {
		const el = this.elements[0];
		if (!el) {
			return undefined;
		}

		return {
			top: el.offsetTop,
			left: el.offsetLeft,
		};
	}

	/**
	 * Extend the ElementWrapper prototype with a custom method.
	 * Used internally by the plugin system — prefer the {@link Plugin} API for userland extensions.
	 * @param name - The method name to add to the prototype.
	 * @param func - The function to attach.
	 */
	static extend(name: string, func: (...args: any[]) => any) {
		(ElementWrapper as any).prototype[name] = func;
	}
}
