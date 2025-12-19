# Fabricator UI Toolkit - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Handlebars Templating](#handlebars-templating)
5. [SCSS Architecture](#scss-architecture)
6. [JavaScript Modules](#javascript-modules)
7. [Icon Font System](#icon-font-system)
8. [Build Process](#build-process)
9. [Development Workflow](#development-workflow)
10. [Naming Conventions](#naming-conventions)
11. [Creating New Components](#creating-new-components)
12. [Examples](#examples)

---

## Overview

This project uses **Fabricator** - a tool for building UI component libraries and pattern libraries. It allows you to:

- Create reusable UI components
- Document components with notes
- Preview components in a browser
- Generate production-ready CSS/JS

**Key Concept**: Write components once, reuse everywhere!

---

## Project Structure

```
basic-setup/
├── src/                          # Source files
│   ├── data/                     # JSON data for templates
│   ├── docs/                     # Documentation pages
│   ├── materials/                # UI Components (Handlebars)
│   │   ├── 01-elements/          # Basic elements (buttons, icons, inputs)
│   │   └── 02-components/        # Complex components
│   │       ├── 01-layout/        # Layout components (header, footer)
│   │       ├── 02-navigation/    # Navigation components
│   │       └── 03-landing/       # Landing page components
│   ├── views/                    # Page templates
│   │   ├── layouts/              # Base layouts (default.html)
│   │   └── pages/                # Individual pages
│   └── assets/
│       └── toolkit/
│           ├── styles/           # SCSS stylesheets
│           │   ├── components/   # Component styles
│           │   ├── elements/     # Element styles
│           │   ├── objects/      # Object styles
│           │   ├── _font-icons.scss
│           │   └── toolkit.scss  # Main entry point
│           ├── scripts/          # JavaScript files
│           │   ├── components/   # Component JS
│           │   └── toolkit.js    # Main entry point
│           ├── fonts/            # Generated icon fonts
│           └── images/           # Image assets
├── dist/                         # Compiled output (generated)
├── gulp.config.js                # Gulp configuration
├── gulpfile.js                   # Gulp tasks
├── package.json                  # NPM dependencies
└── DOCUMENTATION.md              # This file
```

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| **Handlebars** | HTML templating engine |
| **SCSS/Sass** | CSS preprocessor |
| **Gulp** | Build automation |
| **Webpack** | JavaScript bundling |
| **BrowserSync** | Live reload dev server |
| **gulp-iconfont** | Icon font generation |

---

## Handlebars Templating

Handlebars is a templating language that extends HTML with dynamic features.

### Basic Syntax

#### 1. Variables `{{variable}}`

Output a variable value:

```handlebars
<h1>{{title}}</h1>
<button>{{btn-text}}</button>
```

#### 2. Partials `{{> partial-name}}`

Include another component:

```handlebars
<!-- Include a button component -->
{{> buttons.primary-button btn-text="Click Me" btn-Class="-large"}}

<!-- Include with nested folder -->
{{> landing.filter-panel filterClass="-show"}}
```

**How partials are resolved:**
- `buttons.primary-button` → `src/materials/01-elements/01-buttons/00-primary-button.html`
- `landing.filter-panel` → `src/materials/02-components/03-landing/09-filter-panel.html`

#### 3. Conditionals `{{#if}} ... {{/if}}`

```handlebars
<!-- Simple if -->
{{#if disabled}}
    disabled
{{/if}}

<!-- If-else -->
{{#if isActive}}
    <span class="active">Active</span>
{{else}}
    <span class="inactive">Inactive</span>
{{/if}}
```

#### 4. Whitespace Control `{{~ }}`

The `~` character removes whitespace:

```handlebars
<!-- Without ~ (has extra whitespace) -->
{{#if icon}}
    <i class="{{icon}}"></i>
{{/if}}

<!-- With ~ (no extra whitespace) -->
{{~#if icon~}}
    <i class="{{icon}}"></i>
{{~/if~}}
```

#### 5. Loops `{{#each}} ... {{/each}}`

```handlebars
<ul>
{{#each items}}
    <li>{{this.name}}</li>
{{/each}}
</ul>
```

#### 6. Partial Blocks `{{#> partial}} ... {{/partial}}`

Pass content to a partial:

```handlebars
{{#> layout.card}}
    <p>This content goes inside the card</p>
{{/layout.card}}
```

#### 7. Component Notes (YAML Front Matter)

Every component file starts with YAML notes:

```handlebars
---
notes: |
    Button Component
    - Primary action button
    - Supports disabled state
    - Can include icons
---
<button class="o-button">{{btn-text}}</button>
```

---

## SCSS Architecture

### File Organization

```
styles/
├── toolkit.scss              # Main entry - imports everything
├── _font-icons.scss          # Generated icon font classes
├── _variables.scss           # Global variables
├── _mixins.scss              # Reusable mixins
├── elements/                 # Basic element styles
│   ├── _e-buttons.scss
│   └── _e-inputs.scss
├── objects/                  # Reusable object patterns
│   ├── _o-primary-button.scss
│   └── _o-searchfield.scss
└── components/               # Complex component styles
    └── landing/
        ├── _c-myappid-header.scss
        ├── _c-landing-hero.scss
        ├── _c-requests-section.scss
        ├── _c-action-toolbar.scss
        └── _c-filter-panel.scss
```

### Naming Convention (BEM/BEVM)

| Prefix | Meaning | Example |
|--------|---------|---------|
| `c-` | Component | `.c-filter-panel` |
| `o-` | Object | `.o-primary-button` |
| `e-` | Element | `.e-input` |
| `__` | Child element | `.c-filter-panel__header` |
| `-` | Modifier/Variant | `.-show`, `.-dark`, `.-accent` |

### Theme Mixins

```scss
// Define theme variables
@mixin component-theme-light {
    --color-bg: #fff;
    --color-text: #333;
}

@mixin component-theme-dark {
    --color-bg: #1a1a1a;
    --color-text: #eaeaea;
}

// Apply themes
.c-component {
    @include component-theme-light();
}

html[data-theme="dark"] {
    .c-component {
        @include component-theme-dark();
    }
}
```

### Using CSS Variables

```scss
.c-button {
    background: var(--color-btn-bg);
    color: var(--color-btn-text);
    padding: var(--spacing-sm, 0.5rem);
}
```

---

## JavaScript Modules

### File Organization

```
scripts/
├── toolkit.js                # Main entry point
└── components/
    └── landing/
        ├── myappid-header.js
        └── filter-panel.js
```

### Module Pattern

```javascript
// filter-panel.js
export function filterPanelINIT() {
    const buttons = document.querySelectorAll('.c-filter-panel__btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Handle click
        });
    });
}

export default filterPanelINIT;
```

### Main Entry Point

```javascript
// toolkit.js
import { filterPanelINIT } from './components/landing/filter-panel.js';
import { myappidHeaderINIT } from './components/landing/myappid-header.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    filterPanelINIT();
    myappidHeaderINIT();
});
```

---

## Icon Font System

### How It Works

1. **Source SVGs** → `src/assets/toolkit/font-icons/*.svg`
2. **Gulp task** → Converts SVGs to font files
3. **Generated output**:
   - Font files → `src/assets/toolkit/fonts/icon-font.*`
   - SCSS classes → `src/assets/toolkit/styles/_font-icons.scss`

### Adding New Icons

1. Add SVG file to `src/assets/toolkit/font-icons/`:
   ```
   my-icon.svg
   ```

2. Run the icon font task:
   ```bash
   npx gulp iconfont
   ```

3. Use in HTML:
   ```html
   <i class="icon-my-icon"></i>
   ```

### Generated SCSS

```scss
// _font-icons.scss (auto-generated)
.icon-add {
    @include icon(add);
}
.icon-close {
    @include icon(close);
}
// ... more icons
```

---

## Build Process

### Gulp Tasks

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server with live reload |
| `npm run build` | Build for production |
| `npx gulp iconfont` | Regenerate icon fonts |
| `npx gulp styles` | Compile SCSS only |
| `npx gulp scripts` | Bundle JavaScript only |

### Build Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      SOURCE FILES                            │
├─────────────────────────────────────────────────────────────┤
│  Handlebars (.html)    SCSS (.scss)    JavaScript (.js)     │
│  src/materials/        src/assets/      src/assets/         │
│  src/views/            toolkit/styles/  toolkit/scripts/    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      GULP BUILD                              │
├─────────────────────────────────────────────────────────────┤
│  1. Compile Handlebars → HTML                               │
│  2. Compile SCSS → CSS (with autoprefixer)                  │
│  3. Bundle JS (with Webpack)                                │
│  4. Optimize images                                         │
│  5. Copy fonts                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      OUTPUT (dist/)                          │
├─────────────────────────────────────────────────────────────┤
│  index.html            toolkit.css       toolkit.js         │
│  pages/*.html          (minified)        (bundled)          │
│  assets/fonts/         assets/images/                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Development Workflow

### Starting Development

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm start
```

This will:
1. Compile all source files
2. Start a local server (usually http://localhost:3000)
3. Watch for file changes
4. Auto-reload browser on changes

### Making Changes

1. **Edit a component** → `src/materials/02-components/03-landing/09-filter-panel.html`
2. **Edit styles** → `src/assets/toolkit/styles/components/landing/_c-filter-panel.scss`
3. **Edit JavaScript** → `src/assets/toolkit/scripts/components/landing/filter-panel.js`
4. **Save** → Browser auto-reloads

### Adding a New SCSS File

1. Create the file:
   ```
   src/assets/toolkit/styles/components/landing/_c-new-component.scss
   ```

2. Import in `toolkit.scss`:
   ```scss
   @import "components/landing/c-new-component";
   ```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Component HTML | `XX-component-name.html` | `09-filter-panel.html` |
| Component SCSS | `_c-component-name.scss` | `_c-filter-panel.scss` |
| Element SCSS | `_e-element-name.scss` | `_e-buttons.scss` |
| Object SCSS | `_o-object-name.scss` | `_o-primary-button.scss` |

### CSS Classes

```
.c-filter-panel              # Component
.c-filter-panel__header      # Element (child)
.c-filter-panel__btn         # Element (child)
.c-filter-panel.-show        # Modifier (state)
.c-filter-panel.-minimized   # Modifier (state)
```

### JavaScript

```javascript
// Function naming
filterPanelINIT()           // Initialize function
myappidHeaderINIT()         // Initialize function

// Selectors
'.c-filter-panel'           // Component selector
'.c-filter-panel__btn'      // Element selector
'.-show'                    // State class
```

---

## Creating New Components

### Step 1: Create HTML Template

```handlebars
<!-- src/materials/02-components/03-landing/11-new-component.html -->
---
notes: |
    New Component
    - Description of what it does
    - Usage notes
---
<div class="c-new-component{{#if componentClass}} {{componentClass}}{{/if}}">
    <div class="c-new-component__header">
        <h3>{{title}}</h3>
    </div>
    <div class="c-new-component__body">
        {{#if content}}
            {{{content}}}
        {{else}}
            <p>Default content</p>
        {{/if}}
    </div>
</div>
```

### Step 2: Create SCSS Styles

```scss
/* src/assets/toolkit/styles/components/landing/_c-new-component.scss */

/*==============================================================================
New Component
==============================================================================*/

/* Theme */
@mixin new-component-theme-light {
    --color-new-bg: #fff;
    --color-new-text: #333;
}

@mixin new-component-theme-dark {
    --color-new-bg: #1a1a1a;
    --color-new-text: #eaeaea;
}

.c-new-component {
    @include new-component-theme-light();
}

html[data-theme="dark"] {
    .c-new-component {
        @include new-component-theme-dark();
    }
}

/* Base */
.c-new-component {
    background: var(--color-new-bg);
    color: var(--color-new-text);
    padding: 1rem;
    border-radius: 0.5rem;
}

/* Elements */
.c-new-component__header {
    margin-bottom: 1rem;
}

.c-new-component__body {
    font-size: 0.875rem;
}

/* Modifiers */
.c-new-component.-compact {
    padding: 0.5rem;
}
```

### Step 3: Import SCSS

```scss
/* src/assets/toolkit/styles/toolkit.scss */
@import "components/landing/c-new-component";
```

### Step 4: Create JavaScript (if needed)

```javascript
// src/assets/toolkit/scripts/components/landing/new-component.js
export function newComponentINIT() {
    const components = document.querySelectorAll('.c-new-component');
    
    components.forEach(component => {
        // Add interactivity
    });
}

export default newComponentINIT;
```

### Step 5: Import JavaScript

```javascript
// src/assets/toolkit/scripts/toolkit.js
import { newComponentINIT } from './components/landing/new-component.js';

document.addEventListener('DOMContentLoaded', () => {
    newComponentINIT();
});
```

### Step 6: Use the Component

```handlebars
<!-- In any page or component -->
{{> landing.new-component title="My Title" componentClass="-compact"}}
```

---

## Examples

### Example 1: Button with Icon

```handlebars
<!-- HTML Template -->
<button class="c-action-toolbar__btn{{#if btnClass}} {{btnClass}}{{/if}}">
    {{~#if icon~}}
    <i class="{{icon}}" aria-hidden="true"></i>
    {{~/if~}}
    <span>{{text}}</span>
</button>

<!-- Usage -->
{{> toolbar.action-button icon="icon-delete" text="Delete" btnClass="-dark"}}
```

### Example 2: Conditional Rendering

```handlebars
<div class="c-card">
    {{#if showHeader}}
    <div class="c-card__header">
        <h3>{{title}}</h3>
    </div>
    {{/if}}
    
    <div class="c-card__body">
        {{~#if @partial-block}}
            {{> @partial-block }}
        {{~else~}}
            <p>No content provided</p>
        {{~/if~}}
    </div>
</div>
```

### Example 3: Loop with Data

```handlebars
<ul class="c-menu">
{{#each menuItems}}
    <li class="c-menu__item{{#if this.active}} -active{{/if}}">
        <a href="{{this.url}}">
            <i class="{{this.icon}}"></i>
            <span>{{this.label}}</span>
        </a>
    </li>
{{/each}}
</ul>
```

---

## Quick Reference

### Handlebars Cheat Sheet

| Syntax | Description |
|--------|-------------|
| `{{variable}}` | Output variable |
| `{{{variable}}}` | Output without escaping HTML |
| `{{> partial}}` | Include partial |
| `{{> partial param="value"}}` | Include with parameters |
| `{{#if condition}}...{{/if}}` | Conditional |
| `{{#each array}}...{{/each}}` | Loop |
| `{{this}}` | Current item in loop |
| `{{@index}}` | Current index in loop |
| `{{~...~}}` | Trim whitespace |

### SCSS Cheat Sheet

| Pattern | Example |
|---------|---------|
| Variable | `$primary-color: #A100FF;` |
| CSS Variable | `var(--color-primary)` |
| Nesting | `.parent { .child { } }` |
| Mixin define | `@mixin name { }` |
| Mixin use | `@include name;` |
| Extend | `@extend %placeholder;` |
| Import | `@import "filename";` |

---

## Need Help?

1. Check the browser console for JavaScript errors
2. Check the terminal for build errors
3. Ensure all imports are correct in `toolkit.scss` and `toolkit.js`
4. Run `npm install` if dependencies are missing
5. Restart the dev server if changes aren't reflecting

---

*Last updated: December 2024*
