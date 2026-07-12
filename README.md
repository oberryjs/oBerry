<p align="center">
  <img src=".github/assets/logo2.svg" height="140px" alt="logo" />
</p>


# oBerry

![oberry](https://img.shields.io/npm/v/oberry.svg)
![License](https://img.shields.io/github/license/oberryjs/oberry)
![downloads](https://img.shields.io/npm/dm/oberry)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/oberry)
[![Tests](https://github.com/oberryjs/oBerry/actions/workflows/test.yml/badge.svg)](https://github.com/oberryjs/oBerry/actions/workflows/test.yml)
[![Lint](https://github.com/oberryjs/oBerry/actions/workflows/lint.yml/badge.svg)](https://github.com/oberryjs/oBerry/actions/workflows/lint.yml)
[![codecov](https://codecov.io/gh/oberryjs/oBerry/graph/badge.svg?token=ZHWYE9FJLM)](https://codecov.io/gh/oberryjs/oBerry)
[![documentation](https://img.shields.io/badge/-documentation-blue)](https://oberry.pages.dev/)

## Why oBerry?

Modern frontend development often forces a tradeoff:
- **React / frameworks** → powerful, but heavy for small projects
- **jQuery** → simple, but outdated and not reactive
- **Vanilla JS** → flexible, but repetitive and tedious for DOM-heavy apps

oBerry gives you a **modern**, **reactive**, **jQuery-like** API without needing a build setup or full framework.


**With oBerry, you can:**
- manipulate the DOM with a clean, chainable API
- use built-in fine-grained **reactivity** (no external state library)
- use **components** without a framework overhead
- write TypeScript-first code right out of the box


### Full documentation: [oberry.pages.dev](https://oberry.pages.dev)

## Features

- Lightweight (~4KB gzipped)
- jQuery-like API - Familiar syntax for easy migration
- Built-in signal-based reactivity system
- TypeScript-first approach

## Quick start

You can create a new oBerry project with:

```sh
npm create oberry
```

Or add oBerry to an existing one:

```sh
npm install oberry
```

## Examples

```ts
import { $, $ref } from 'oberry';

const count = $ref(0);

$("#counter").bind(count);

$("#increment-btn").on("click", () => {
  count(prev => prev + 1);
});

$("#decrement-btn").on("click", () => {
  count(prev => prev - 1);
});

```

---

```ts
import { $ref, $component } from "oberry";

$component(
  "x-counter",
  ({ $, props, onMounted }) => {
    const count = $ref<number>(Number(props.start ?? 0));

    onMounted(() => {
      $("#counter").bind(count);

      $("button").on("click", () => {
        count(prev => prev + 1);
      });
    });

    return `
      <h1 id="counter">${props.start ?? 0}</h1>
      <button>+</button>
    `
  }
);
```

```html
<x-counter start="10"></x-counter>
```

