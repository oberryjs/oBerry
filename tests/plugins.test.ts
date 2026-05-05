import { beforeEach, describe, expect, it, vi } from "vitest";
import { Plugin, use } from "../src/plugins";
import { $ } from "../src/selector";

describe("Plugins", () => {
	beforeEach(() => {
		document.body.innerHTML = '<div id="test">test</div>';

		// Clear console warnings for clean tests
		vi.spyOn(console, "warn").mockImplementation(() => {
			/* */
		});

		vi.spyOn(console, "error").mockImplementation(() => {
			/* */
		});
	});

	describe("Plugin class", () => {
		it("should create a plugin with name and installer", () => {
			const installer = vi.fn();
			const plugin = new Plugin("test-plugin", installer);

			expect(plugin.name).toBe("test-plugin");
			expect(plugin.getInstaller()).toBe(installer);
		});
	});

	describe("use function", () => {
		it("should install a plugin and extend ElementWrapper", () => {
			const plugin = new Plugin("test-plugin", (extend) => {
				extend("customMethod", function (this: any, value: string) {
					return this.text(value);
				});
			});

			use(plugin);

			const wrapper = $("#test");

			// TypeScript will complain about this, but it should work at runtime
			(wrapper as any).customMethod("Custom text");

			expect(document.getElementById("test")?.textContent).toBe("Custom text");
		});

		it("should warn when installing the same plugin twice", () => {
			const plugin = new Plugin("duplicate-plugin", (extend) => {
				extend("duplicateMethod", function (this: any) {
					return this;
				});
			});

			use(plugin);
			use(plugin); // Second installation

			expect(console.warn).toHaveBeenCalledWith(
				'Plugin "duplicate-plugin" is already installed',
			);
		});

		it("should handle plugin installation errors", () => {
			const faultyPlugin = new Plugin("faulty-plugin", () => {
				throw new Error("Installation failed");
			});

			use(faultyPlugin);

			expect(console.error).toHaveBeenCalledWith(
				'Failed to install plugin "faulty-plugin":',
				expect.any(Error),
			);
		});

		it("should allow multiple different plugins", () => {
			const plugin1 = new Plugin("plugin-1", (extend) => {
				extend("method1", function (this: any) {
					return this.class.add("from-plugin-1");
				});
			});

			const plugin2 = new Plugin("plugin-2", (extend) => {
				extend("method2", function (this: any) {
					return this.class.add("from-plugin-2");
				});
			});

			use(plugin1);
			use(plugin2);

			const wrapper = $("#test");

			(wrapper as any).method1();
			(wrapper as any).method2();

			expect(wrapper.class.has("from-plugin-1")).toBe(true);
			expect(wrapper.class.has("from-plugin-2")).toBe(true);

			expect(typeof (wrapper as any).method1).toBe("function");
			expect(typeof (wrapper as any).method2).toBe("function");
		});
	});
});
