export type EventCallback<T extends HTMLElement, E extends Event = Event> = (
	this: T,
	ev: E,
) => void;
