import { beforeEach, describe, expect, it, vi } from "vitest";
import { $computed, $effect, $effectScope, $ref } from "../src/reactivity";
import { $ } from "../src/selector";

describe("Reactivity", () => {
	describe("$ref", () => {
		it("should create reactive reference", () => {
			const count = $ref(0);
			expect(count()).toBe(0);

			count(5);
			expect(count()).toBe(5);
		});

		it("should update the reference with an updater function", () => {
			const count = $ref(0);
			$effect(() => {
			});
			
			count(prev => prev + 1);
			expect(count()).toBe(1);

			count(prev => prev + 1);
			expect(count()).toBe(2);
		});

		it("should work with different types", () => {
			const stringRef = $ref("hello");
			const numberRef = $ref(42);
			const booleanRef = $ref(true);
			const objectRef = $ref({ key: "value" });

			expect(stringRef()).toBe("hello");
			expect(numberRef()).toBe(42);
			expect(booleanRef()).toBe(true);
			expect(objectRef()).toEqual({ key: "value" });
		});
	});

	describe("$computed", () => {
		it("should create computed values", () => {
			const firstName = $ref("John");
			const lastName = $ref("Doe");
			const fullName = $computed(() => `${firstName()} ${lastName()}`);

			expect(fullName()).toBe("John Doe");
		});

		it("should update when dependencies change", () => {
			const a = $ref(1);
			const b = $ref(2);
			const sum = $computed(() => a() + b());

			expect(sum()).toBe(3);

			a(5);
			expect(sum()).toBe(7);

			b(10);
			expect(sum()).toBe(15);
		});
	});

	describe("$effect", () => {
		it("should run effects", () => {
			const mockFn = vi.fn();
			const count = $ref(0);

			$effect(() => {
				mockFn(count());
			});

			expect(mockFn).toHaveBeenCalledWith(0);
		});
	});

	describe("$effectScope", () => {
		it("should create effect scopes", () => {
			const mockFn = vi.fn();

			$effectScope(() => {
				mockFn();
			});

			expect(mockFn).toHaveBeenCalled();
		});
	});

	describe("DOM binding", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <div id="output"></div>
        <div id="html-output"></div>
        <div id="attr-output"></div>
        <input id="input" type="text">
      `;
		});

		it("should bind text content", () => {
			const message = $ref("Hello World");
			$("#output").bind(message);

			expect(document.getElementById("output")?.textContent).toBe(
				"Hello World",
			);
		});

		it("should bind HTML content", () => {
			const html = $ref("<strong>Bold text</strong>");
			$("#html-output").bindHTML(html);

			expect(document.getElementById("html-output")?.innerHTML).toBe(
				"<strong>Bold text</strong>",
			);
		});

		it("should bind to attributes", () => {
			const title = $ref("Test title");
			$("#attr-output").bindAttr("title", title);

			expect(
				document.getElementById("attr-output")?.getAttribute("title"),
			).toBe("Test title");
		});

		it("should bind input values", () => {
			const value = $ref("initial");
			const input = $("#input");
			input.bindInput(value);

			// Simulate user input
			const inputElement = document.getElementById("input") as HTMLInputElement;
			inputElement.value = "new value";
			inputElement.dispatchEvent(new Event("input"));

			expect(value()).toBe("new value");
		});
	});
});
