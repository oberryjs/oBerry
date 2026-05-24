import { describe, expect, it, vi } from "vitest";
import { $component } from "../src/component";
import { $effect } from "../src/reactivity";

describe("Component", () => {
	it("should create a new component instance", () => {
		$component("x-component", () => {
			return ``;
		});

		expect(window.customElements.get("x-component")).toBeDefined();
	});

	it("should render the component", () => {
		$component("x-render-component", () => {
			return `<p>Hello World</p>`;
		});
		const element = document.createElement("x-render-component");
		document.body.appendChild(element);
		expect(element.innerHTML).toBe(`<p>Hello World</p>`);
	});

	it("should create a component with shadow DOM", () => {
		$component(
			"x-shadow-component",
			() => {
				return `<p>Shadow DOM</p>`;
			},
			{ shadow: "open" },
		);
		const element = document.createElement("x-shadow-component");
		document.body.appendChild(element);
		expect(element.shadowRoot?.innerHTML).toBe(`<p>Shadow DOM</p>`);
	});

	it("should update component when attribute changes", () => {
		const fn = vi.fn();

		$component<"test">("x-attribute-component", ({ props }) => {
			$effect(() => {
				fn(props.test());
			});

			return ``;
		});
		const element = document.createElement("x-attribute-component");
		element.setAttribute("test", "new value");
		document.body.appendChild(element);
		expect(fn).toHaveBeenCalledWith("new value");
	});
});
