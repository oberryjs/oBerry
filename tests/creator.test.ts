import { describe, expect, it } from "vitest";
import { $new } from "../src/creator";
import { ElementWrapper } from "../src/wrapper";

describe("Creator ($new)", () => {
	it("should create a new element wrapper", () => {
		const wrapper = $new("div");
		expect(wrapper).toBeInstanceOf(ElementWrapper);
		expect(wrapper.elements).toHaveLength(1);
		expect(wrapper.elements[0].tagName.toLowerCase()).toBe("div");
	});

	it("should create different element types", () => {
		const divWrapper = $new("div");
		const spanWrapper = $new("span");
		const pWrapper = $new("p");

		expect(divWrapper.elements[0].tagName.toLowerCase()).toBe("div");
		expect(spanWrapper.elements[0].tagName.toLowerCase()).toBe("span");
		expect(pWrapper.elements[0].tagName.toLowerCase()).toBe("p");
	});

	it("should allow chaining methods on created elements", () => {
		const wrapper = $new("div")
			.class.add("test-class")
			.text("Test content")
			.css({ color: "red" });

		expect(wrapper.elements[0].className).toBe("test-class");
		expect(wrapper.elements[0].textContent).toBe("Test content");
		expect(wrapper.elements[0].style.color).toBe("red");
	});

	it("should create elements that can be appended to DOM", () => {
		document.body.innerHTML = '<div id="container"></div>';

		const newElement = $new("p").text("New paragraph");
		const container = document.getElementById("container")!;
		container.appendChild(newElement.elements[0]);

		expect(document.querySelector("#container p")).toBeTruthy();
		expect(document.querySelector("#container p")?.textContent).toBe(
			"New paragraph",
		);
	});

	it("should create an element with a child element", () => {
		const newElement = $new("ul", $new("li"));
		document.body.appendChild(newElement.elements[0]);
		const child = document.querySelectorAll("ul > *");
		expect(child).toHaveLength(1);
		expect(child[0].tagName).toBe("LI");
	});

	it("should create an element with a multiple child elements", () => {
		const newElement = $new("ul", $new("li"), $new("li"), $new("li"));
		document.body.appendChild(newElement.elements[0]);
		const children = document.querySelectorAll("ul > *");
		expect(children).toHaveLength(3);
	});
});
