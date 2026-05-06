import { beforeEach, describe, expect, it, vi } from "vitest";
import { $ } from "../src/selector";

describe("ElementWrapper", () => {
	beforeEach(() => {
		document.body.innerHTML = `
      <div id="test" class="original">
        <p class="child">Child 1</p>
        <p class="child">Child 2</p>
      </div>
      <input type="text" id="input" value="initial">
      <textarea id="textarea">textarea content</textarea>
      <select id="select">
        <option value="1">Option 1</option>
        <option value="2" selected>Option 2</option>
      </select>
    `;
	});

	describe("Class manipulation", () => {
		it("should get classes of first element", () => {
			const classes = $("#test").class.get();
			expect(classes).toEqual(["original"]);
		});

		it("should add class", () => {
			const wrapper = $("#test").class.add("new-class");
			expect(wrapper.elements[0].className).toContain("new-class");
			expect(wrapper.elements[0].className).toContain("original");
		});

		it("should add multiple classes", () => {
			const wrapper = $("#test").class.add(
				"new-class another-class yet-another-class",
			);
			expect(wrapper.elements[0].className).toContain("new-class");
			expect(wrapper.elements[0].className).toContain("another-class");
			expect(wrapper.elements[0].className).toContain("yet-another-class");
		});

		it("should remove class", () => {
			const wrapper = $("#test").class.remove("original");
			expect(wrapper.elements[0].className).not.toContain("original");
		});

		it("should toggle class", () => {
			const wrapper = $("#test");
			wrapper.class.toggle("toggle-test");
			expect(wrapper.elements[0].className).toContain("toggle-test");

			wrapper.class.toggle("toggle-test");
			expect(wrapper.elements[0].className).not.toContain("toggle-test");
		});

		it("should check if element has class", () => {
			const wrapper = $("#test");
			expect(wrapper.class.has("original")).toBe(true);
			expect(wrapper.class.has("nonexistent")).toBe(false);

      const empty = $("#nonexistent")
      expect(empty.class.has("class")).toBe(false);
		});
	});

	describe("ID manipulation", () => {
		it("should get ID of first element", () => {
			const id = $("#test").id();
			expect(id).toBe("test");
		});

		it("should set ID of first element", () => {
			const wrapper = $("#test").id("new-id");
			expect(wrapper.elements[0].id).toBe("new-id");
		});
	});

	describe("CSS styling", () => {
		it("should apply CSS styles", () => {
			const wrapper = $("#test").css({
				color: "red",
				fontSize: "16px",
			});

			expect(wrapper.elements[0].style.color).toBe("red");
			expect(wrapper.elements[0].style.fontSize).toBe("16px");
		});
	});

	describe("Content manipulation", () => {
		it("should get HTML content", () => {
			const html = $("#test").html();
			expect(html).toContain('<p class="child">Child 1</p>');
		});

		it("should set HTML content", () => {
			const wrapper = $("#test").html("<span>New content</span>");
			expect(wrapper.elements[0].innerHTML).toBe("<span>New content</span>");
		});

		it("should get text content", () => {
			const text = $(".child").text();
			expect(text).toBe("Child 1");
		});

		it("should set text content", () => {
			const wrapper = $(".child").text("New text");
			expect(wrapper.elements[0].innerText).toBe("New text");
		});

    it("should empty the innerHTML", () => {
      const wrapper = $("#test");
      wrapper.empty();
      expect(wrapper.children().elements).toHaveLength(0);
    })
	});

	describe("Form values", () => {
		it("should get input value", () => {
			const value = $("#input").value();
			expect(value).toBe("initial");
		});

		it("should set input value", () => {
			const wrapper = $("#input").value("new value");
			expect((wrapper.elements[0] as HTMLInputElement).value).toBe("new value");
		});

		it("should get textarea value", () => {
			const value = $("#textarea").value();
			expect(value).toBe("textarea content");
		});

		it("should get select value", () => {
			const value = $("#select").value();
			expect(value).toBe("2");
		});
	});

	describe("Content insertion", () => {
		it("should append string content", () => {
			const wrapper = $("#test").append("<div>Appended</div>");
			expect(wrapper.elements[0].innerHTML).toContain("<div>Appended</div>");
		});

		it("should prepend string content", () => {
			const originalHtml = $("#test").html();
			const wrapper = $("#test").prepend("<div>Prepended</div>");
			expect(wrapper.elements[0].innerHTML).toBe(
				`<div>Prepended</div>${originalHtml}`,
			);
		});

		it("should insert content after element", () => {
			$("#test").after('<div id="after">After</div>');
			expect(document.getElementById("after")).toBeTruthy();
		});

		it("should insert content before element", () => {
			$("#test").before('<div id="before">Before</div>');
			expect(document.getElementById("before")).toBeTruthy();
		});
	});

	describe("Element removal", () => {
		it("should remove elements from DOM", () => {
			const wrapper = $("#test");
			wrapper.remove();
			expect(document.getElementById("test")).toBeNull();
			expect(wrapper.elements).toHaveLength(0);
		});
	});

	describe("Element testing and filtering", () => {
		it("should test if element matches selector", () => {
			const wrapper = $("#test");
			expect(wrapper.is(".original")).toBe(true);
			expect(wrapper.is(".nonexistent")).toBe(false);
		});

		it("should filter out elements that match selector", () => {
			document.body.innerHTML = `
        <div class="item active">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item active">Item 3</div>
      `;

			const filtered = $(".item").not(".active");
			expect(filtered.elements).toHaveLength(1);
			expect(filtered.elements[0].textContent).toBe("Item 2");
		});
	});

	describe("Attributes and data", () => {
		it("should get and set attributes", () => {
			const wrapper = $("#test");
			wrapper.attr("data-test", "value");
			expect(wrapper.attr("data-test")).toBe("value");
		});

		it("should get and set data attributes", () => {
			const wrapper = $("#test");
			wrapper.data("userId", "123");
			expect(wrapper.data("userId")).toBe("123");
		});
	});

	describe("Event handling", () => {
		it("should add event listeners", () => {
			const mockCallback = vi.fn();
			const wrapper = $("#test");

			wrapper.on("click", mockCallback);
			wrapper.elements[0].click();

			expect(mockCallback).toHaveBeenCalled();
		});
	});

	describe("Navigation methods", () => {
		it("should get parent element", () => {
			const parent = $(".child").parent();
			expect(parent?.elements[0].id).toBe("test");
		});

		it("should get children elements", () => {
			const children = $("#test").children();
			expect(children?.elements).toHaveLength(2);
			expect(children?.elements[0].className).toBe("child");
		});

		it("should find descendants", () => {
			const found = $("#test").find(".child");
			expect(found.elements).toHaveLength(2);
		});

		it("should find closest ancestor", () => {
			const closest = $(".child").closest("#test");
			expect(closest?.elements[0].id).toBe("test");
		});
	});

	describe("Filtering and selection", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <div class="item">Item 1</div>
        <div class="item active">Item 2</div>
        <div class="item">Item 3</div>
        <div class="item active">Item 4</div>
      `;
		});

		it("should get element by index", () => {
			const wrapper = $(".item").eq(1);
			expect(wrapper.elements).toHaveLength(1);
			expect(wrapper.elements[0].textContent).toBe("Item 2");
		});

		it("should get first element", () => {
			const first = $(".item").first();
			expect(first.elements[0].textContent).toBe("Item 1");
		});

		it("should get last element", () => {
			const last = $(".item").last();
			expect(last.elements[0].textContent).toBe("Item 4");
		});

		it("should get even positioned elements", () => {
			const even = $(".item").even();
			expect(even.elements).toHaveLength(2);
			expect(even.elements[0].textContent).toBe("Item 2");
			expect(even.elements[1].textContent).toBe("Item 4");
		});

		it("should get odd positioned elements", () => {
			const odd = $(".item").odd();
			expect(odd.elements).toHaveLength(2);
			expect(odd.elements[0].textContent).toBe("Item 1");
			expect(odd.elements[1].textContent).toBe("Item 3");
		});

		it("should filter by CSS selector", () => {
			const filtered = $(".item").filter(".active");
			expect(filtered.elements).toHaveLength(2);
		});

		it("should filter by predicate function", () => {
			const filtered = $(".item").filter((_, index) => index % 2 === 0);
			expect(filtered.elements).toHaveLength(2);
		});
	});

	describe("Visibility control", () => {
		it("should hide elements", () => {
			const wrapper = $("#test").hide();
			expect(wrapper.elements[0].style.display).toBe("none");
		});

		it("should show elements", () => {
			const wrapper = $("#test");
			wrapper.hide();
			wrapper.show();
			expect(wrapper.elements[0].style.display).not.toBe("none");
		});

		it("should toggle visibility", () => {
			const wrapper = $("#test");
			wrapper.toggle();
			expect(wrapper.elements[0].style.display).toBe("none");

			wrapper.toggle();
			expect(wrapper.elements[0].style.display).not.toBe("none");
		});
	});

	describe("Utility methods", () => {
		it("should return array of elements", () => {
			const array = $(".child").getArray();
			expect(Array.isArray(array)).toBe(true);
			expect(array).toHaveLength(2);
		});

		it("should return length of elements", () => {
			expect($(".child").length()).toBe(2);
		});

		it("should check if selection is empty", () => {
			expect($(".nonexistent").isEmpty()).toBe(true);
			expect($(".child").isEmpty()).toBe(false);
		});

		it("should iterate over elements", () => {
			const mockCallback = vi.fn();
			$(".child").forEach(mockCallback);
			expect(mockCallback).toHaveBeenCalledTimes(2);
		});
	});

	describe("Dimensions", () => {
		beforeEach(() => {
			document.body.innerHTML = `
        <div id="box" style="width: 200px; height: 100px; padding: 10px; margin: 5px; border: 2px solid black; position: absolute; top: 50px; left: 30px; display: block;">
          Content
        </div>
        <div id="parent" style="position: relative; width: 300px; height: 200px;">
          <div class="multi-box" style="width: 50px; height: 30px;">Box 1</div>
          <div class="multi-box" style="width: 50px; height: 30px;">Box 2</div>
          <div id="child" style="position: absolute; top: 20px; left: 10px; width: 50px; height: 30px;">
            Child
          </div>
        </div>
      `;
		});

		describe("width", () => {
			it("should get the width style of the first element", () => {
				const width = $("#box").width();
				expect(width).toBe(200);
			});

			it("should return undefined for empty selection", () => {
				const width = $("#nonexistent").width();
				expect(width).toBeUndefined();
			});

			it("should set the width of all elements", () => {
				const wrapper = $("#box").width(300);
				expect(wrapper.elements[0].style.width).toBe("300px");
			});

			it("should set width on multiple elements", () => {
				const wrapper = $(".multi-box").width(100);
				expect(wrapper.elements[0].style.width).toBe("100px");
				expect(wrapper.elements[1].style.width).toBe("100px");
			});

			it("should return this when setting width", () => {
				const wrapper = $("#box").width(250);
				expect(wrapper).toBe(wrapper);
			});
		});

		describe("height", () => {
			it("should get the height style of the first element", () => {
				const height = $("#box").height();
				expect(height).toBe(100);
			});

			it("should return undefined for empty selection", () => {
				const height = $("#nonexistent").height();
				expect(height).toBeUndefined();
			});

			it("should set the height of all elements", () => {
				const wrapper = $("#box").height(150);
				expect(wrapper.elements[0].style.height).toBe("150px");
			});

			it("should set height on multiple elements", () => {
				const wrapper = $(".multi-box").height(80);
				expect(wrapper.elements[0].style.height).toBe("80px");
				expect(wrapper.elements[1].style.height).toBe("80px");
			});

			it("should return this when setting height", () => {
				const wrapper = $("#box").height(200);
				expect(wrapper).toBe(wrapper);
			});
		});

		describe("offset", () => {
			it("should get the offset coordinates of the first element", () => {
				const offset = $("#box").offset();
				expect(offset).toBeDefined();
				expect(typeof offset?.top).toBe("number");
				expect(typeof offset?.left).toBe("number");
			});

			it("should return undefined for empty selection", () => {
				const offset = $("#nonexistent").offset();
				expect(offset).toBeUndefined();
			});

			it("should return object with top and left properties", () => {
				const offset = $("#box").offset();
				expect(offset).toHaveProperty("top");
				expect(offset).toHaveProperty("left");
			});
		});

		describe("position", () => {
			it("should get the position relative to offset parent", () => {
				const position = $("#child").position();
				expect(position).toBeDefined();
				expect(position).toHaveProperty("top");
				expect(position).toHaveProperty("left");
				expect(typeof position?.top).toBe("number");
				expect(typeof position?.left).toBe("number");
			});

			it("should return undefined for empty selection", () => {
				const position = $("#nonexistent").position();
				expect(position).toBeUndefined();
			});

			it("should return object with top and left properties", () => {
				const position = $("#child").position();
				expect(position).toHaveProperty("top");
				expect(position).toHaveProperty("left");
			});
		});
	});
});
