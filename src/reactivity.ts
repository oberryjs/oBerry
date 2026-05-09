import { computed, effect, effectScope, signal } from "alien-signals";

export type Ref<T> = {
	(): T;
	(value: T): void;
	(updater: (prev: T) => T): void;
};

export function $ref<T>(initial: T): Ref<T> {
	const s = signal(initial);
	function ref(): T;
	function ref(value: T): undefined;
	function ref(updater: (prev: T) => T): undefined;
	function ref(arg?: T | ((prev: T) => T)): T | undefined {
		if (arg === undefined) {
			return s();
		}

		const next: T =
			typeof arg === "function" ? (arg as (prev: T) => T)(s()) : arg;

		s(next);
		return undefined;
	}

	return ref;
}

export const $computed = computed;

export const $effect = effect;

export const $effectScope = effectScope;
