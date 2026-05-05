# oBerry

![oberry](https://img.shields.io/npm/v/oberry.svg)
![License](https://img.shields.io/github/license/radeqq007/oberry)
![downloads](https://img.shields.io/npm/dm/oberry)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/oberry)
[![Tests](https://github.com/radeqq007/oBerry/actions/workflows/test.yml/badge.svg)](https://github.com/radeqq007/oBerry/actions/workflows/test.yml)
[![Lint](https://github.com/radeqq007/oBerry/actions/workflows/lint.yml/badge.svg)](https://github.com/radeqq007/oBerry/actions/workflows/lint.yml)
[![codecov](https://codecov.io/gh/radeqq007/oBerry/graph/badge.svg?token=ZHWYE9FJLM)](https://codecov.io/gh/radeqq007/oBerry)

## Overview

oBerry is a lightweight and modern JQuery alternative designed to simplify the manipulation of HTML elements, handling user interactions and binding reactive data to HTML content.

## Features

- Lightweight (~3.5KB gzipped)
- jQuery-like API - Familiar syntax for easy migration
- Built-in signal-based reactivity system
- TypeScript-first approach

## Installation

```sh
npm install oberry
```

## Quick start

1. Using with a bundler (e.g. Vite, Webpack)

```js
import { $, $ref } from 'oberry';

// Select and manipulate elements
$('.my-button')
  .class.toggle('active')
  .on('click', () => console.log('Clicked!'));

// Reactive data binding
const message = $ref('Hello World');
$('#output').bind(message);

// Update reactive value
message('Hello!');
```

2. Using via CDN

```js
import { $, $ref } from 'https://cdn.skypack.dev/oberry';

// Select and manipulate elements
$('.my-button')
  .class.toggle('active')
  .on('click', () => console.log('Clicked!'));

// Reactive data binding
const message = $ref('Hello World');
$('#output').bind(message);

// Update reactive value
message('Hello!');
```

## API Reference

### Element selection

```js
// CSS selector
$('.class-name');
$('#element-id');
$('div');

// HTML Element
$(document.getElementById('myElement'));

// NodeList or Array of elements
$(document.querySelectorAll('.items'));

// Using a generic type definition
$<HTMLFormElement>('.my-form');
```

### DOM Manipulation

#### Class Management

```js
$('.element')
  .class.get() // Get the array of classes of the first element
  .class.remove('old-class') // Remove a class
  .class.add('new-class'); // Add a class
  .class.toggle('toggled-class') // Toggle a class
  .class.add('cool-class another-class') // Add multiple classes (seperated by space)
  .class.has('my-class') // Check if the first element has class
```


#### ID Management

```js
// Get ID of first element
const elementId = $('.element').id();

// Set ID for the first element
$('.element').id('new-id');
```

#### Element Testing and Matching

```js
// Check if element matches selector
$('.element').is('.active'); // Returns boolean

// Filter out elements that match selector
$('.elements').not('.disabled'); // Returns wrapper with non-matching elements
```

#### Styling

```js
$('.element').css({
  color: 'red',
  fontSize: '16px',
  backgroundColor: '#f0f0f0',
});
```

#### Dimensions

```js
// Get the width of the first element (excluding padding, border, margin)
const width = $('.element').width();

// Set the width of all elements (in pixels)
$('.element').width(200);

// Get the height of the first element (excluding padding, border, margin)
const height = $('.element').height();

// Set the height of all elements (in pixels)
$('.element').height(100);
```

#### Position and Offset

```js
// Get the coordinates of the first element relative to the document
// Returns an object with top and left properties
const offset = $('.element').offset();
console.log(offset.top);  // Distance from top of document
console.log(offset.left); // Distance from left of document

// Get the coordinates of the first element relative to its offset parent
// Returns an object with top and left properties
const position = $('.element').position();
console.log(position.top);  // Distance from offset parent
console.log(position.left); // Distance from offset parent
```

#### Content Manipulation

```js
$('.element')
  .html('<p>New HTML content</p>')
  .text('Plain text content')
  .html() // Returns HTML of first element
  .text(); // Returns text of first element
  .empty(); // Clear the inner HTML of the elements
```

#### Content insertion

```js
// Append content to elements
$('.element').append('<p>Appended content</p>');
$('.element').append(document.createElement('div'));
$('.element').append($('.other-element'));

// Prepend content to elements
$('.element').prepend('<p>Prepended content</p>');
$('.element').prepend(document.createElement('div'));
$('.element').prepend($('.other-element'));

// Insert content after elements
$('.element').after('<p>Content after</p>');
$('.element').after(document.createElement('div'));
$('.element').after($('.other-element'));

// Insert content before elements
$('.element').before('<p>Content before</p>');
$('.element').before(document.createElement('div'));
$('.element').before($('.other-element'));
```

#### Element Removal

```js
// Remove all elements from DOM
$('.element').remove();
```

#### Form Values

```js
// Get/set values for input, textarea, select elements
$('#input-field')
  .value('New value') // Sets the current value
  .value(); // Returns current value
```

#### Attributes and Data

```js
// Get/set attributes
$('.element')
  .attr('data-id', '123') // Set attribute
  .attr('data-id'); // Get attribute

// Get/set data attributes
$('.element')
  .data('userId', '456') // Set data attribute
  .data('userId'); // Get data attribute
```

#### Element Navigation

```js
// Get parent element (wrapped)
$('.child').parent();

// Get children of first element (wrapped)
$('.parent').children();

// Get children of first element filtered to match the css selector (wrapped)
$('.parent').children('.active');

// Get children of all elements (wrapped)
$('.parents').allChildren();

// Get children of first element filtered to match the css selector (wrapped)
$('.parent').allChildren('.active');

// Get siblings of first element (wrapped)
$('.parent').siblings();

// Get siblings of first element filtered to match the css selector (wrapped)
$('.parent').siblings('.active');

// Get siblings of all elements (wrapped)
$('.parents').allSiblings();

// Get siblings of first element filtered to match the css selector (wrapped)
$('.parent').allSiblings('.active');

// Get array of wrapped elements
$('.elements').getArray();

// Find descendants matching selector
$('.parent').find('.child-class');

// Find closest ancestor matching selector
$('.element').closest('.ancestor-class');

// Clone the elements
$('.element').clone();
```

#### Element Filtering and Selection

```js
// Get specific element by index
$('.elements').eq(2); // Get the 3rd element (zero-indexed)

// Get first element
$('.elements').first();

// Get last element
$('.elements').last();

// Get even-indexed elements (2nd, 4th, 6th, etc.)
$('.elements').even();

// Get odd-indexed elements (1st, 3rd, 5th, etc.)
$('.elements').odd();

// Filter elements by CSS selector
$('.elements').filter('.active');

// Filter elements by predicate function
$('.elements').filter((element, index) => {
  return element.classList.contains('highlight');
});
```

#### Element Iteration

```js
// Iterate over each element
$('.elements').forEach(wrappedElement => {
  wrappedElement.class.add('processed');
});

// Transform elements into an array of values
const texts = $('.items').map(el => el.text());
// ['Item 1', 'Item 2', 'Item 3']

// Accumulate a value over all elements
const combined = $('.items').reduce((acc, el) => acc + el.text() + ' ', '');
// 'Item 1 Item 2 Item 3 '
```

#### Element Information

```js
// Get number of elements
$('.elements').length();

// Check if selection is empty
$('.elements').isEmpty();
```

#### Visibility Control

```js
// Hide elements (preserves original display value)
$('.element').hide();

// Show elements (restores original display value)
$('.element').show();

// Toggle visibility
$('.element').toggle();
```

#### Element Creation

```js
import { $new } from 'oberry';

// Create new elements
const newDiv = $new('div').class.add('my-class').text('Hello World');

// Create new element with children
const list = $new('ul', $new('li').text('Hello, world!'));

// Create new element with multiple children
const list = $new(
  'ul',
  $new('li').text('first element'),
  $new('li').text('second element'),
  $new('li').text('third element'),
);
```

### Event Listeners

```js
$('.element').on('click', () => console.log('Clicked!'));
$('.element').off('click', () => console.log('Clicked!')); // Remove event listener
$('.element').once('click', () => console.log('Clicked!')); // Add a one time event listener
```

### Reactivity

oBerry's reactivity system is built on top of [alien-signals](https://github.com/stackblitz/alien-signals), providing efficient and fine-grained reactivity.

#### Reactive References

```js
// Create reactive reference
const count = $ref(0);
const message = $ref('Hello');

// Reading values
console.log(count()); // 0
console.log(message()); // 'Hello'

// Setting values
count(42);
message('Hello World');

// Bind to DOM elements
$('#counter').bind(count); // Binds as text content
$('#message').bindHTML(message); // Binds as HTML content
$('#title').bindAttr('title', message); // Binds to attribute
```

#### Computed Values

```js
const firstName = $ref('John');
const lastName = $ref('Doe');

// Create computed value that automatically updates
const fullName = $computed(() => {
  return `${firstName()} ${lastName()}`;
});

// Bind computed to DOM
$('#full-name').bind(fullName);

// Updates automatically when dependencies change
firstName('Jane'); // '#full-name' will show 'Jane Doe'
```

#### Effects

```js
const count = $ref(0);

// Run side effects when reactive values change
$effect(() => {
  console.log(`Count is now: ${count()}`);
  document.title = `Count: ${count()}`;
});

count(1); // Console: 'Count is now: 1', Title updates
count(2); // Console: 'Count is now: 2', Title updates
```

#### Effect Scope

```js
// Group multiple effects together for cleanup
const stopScope = $effectScope(() => {
  $effect(() => {
    console.log(`Count in scope: ${count()}`);
  });
});

// Stop all effects in the scope
stopScope();
```

#### Input Binding

```js
// Two-way binding with form inputs
const name = $ref('');
$('#name-input').bindInput(name);

// The input value and ref stay in sync
name('John'); // Input shows 'John'
// User types 'Jane' -> name() returns 'Jane'
```

### Plugins

```js
// Create the plugin
const myPlugin = new Plugin('myPlugin', extend => {
  // Add custom method to ElementWrapper
  extend('customMethod', function (value) {
    return this.css({ backgroundColor: value });
  });

  extend('fadeIn', function (duration = 300) {
    this.css({ opacity: 0, transition: `opacity ${duration}ms` });
    setTimeout(() => this.css({ opacity: 1 }), 10);
    return this;
  });
});

// Install the plugin
use(myPlugin);

// Use the custom methods
$('.element').customMethod('red').fadeIn(500);
```
