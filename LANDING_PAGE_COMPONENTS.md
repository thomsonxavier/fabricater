# Landing Page Components Documentation

Complete documentation for all components used in the myApplicationID landing page.

---

## Table of Contents

1. [Header Component](#1-header-component)
2. [Hero Section Component](#2-hero-section-component)
3. [Requests Section Component](#3-requests-section-component)
4. [Action Toolbar Component](#4-action-toolbar-component)
5. [Filter Panel Component](#5-filter-panel-component)
6. [Search Field Element](#6-search-field-element)
7. [Requests Table Component](#7-requests-table-component)
8. [Empty State Component](#8-empty-state-component)
9. [Footer Component](#9-footer-component)
10. [Toolbar Button Element](#10-toolbar-button-element)

---

## 1. Header Component

**File:** `src/materials/02-components/03-landing/08-myappid-header.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-myappid-header.scss`

### Description
Custom header for the myApplicationID portal. Includes logo, title, navigation icons (help, chat, campaign, notifications), Amethyst AI Assistant with tooltip, and user avatar.

### HTML Structure

```handlebars
{{> landing.myappid-header showHelperTip=true hasNotification=true avatarImg="/path/to/avatar.jpg"}}
```

### Key Features
- Logo and application title
- Navigation icons with 16px spacing
- Notification badge support
- Amethyst AI Assistant with hover tooltip
- Tooltip includes hand click indicator
- User avatar/profile button

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-myappid-header` | Main header container |
| `.c-myappid-header__inner` | Inner wrapper with app-container |
| `.c-myappid-header__left` | Left section (logo + title) |
| `.c-myappid-header__right` | Right section (nav + profile) |
| `.c-myappid-header__nav` | Navigation icons container |
| `.c-myappid-header__nav-btn` | Individual nav icon button |
| `.c-myappid-header__nav-btn.-notification` | Notification button variant |
| `.c-myappid-header__nav-btn.-amethyst` | Amethyst AI button |
| `.c-myappid-header__tooltip` | Tooltip container (appears on hover) |
| `.c-myappid-header__tooltip-content` | Tooltip content wrapper |
| `.c-myappid-header__tooltip-text` | Tooltip text |
| `.c-myappid-header__tooltip-actions` | Tooltip actions (close + hand icon) |
| `.c-myappid-header__notif-badge` | Notification badge indicator |
| `.c-myappid-header__avatar` | User avatar button |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `showHelperTip` | Boolean | `false` | Show Amethyst tooltip on load |
| `hasNotification` | Boolean | `false` | Show notification badge |
| `avatarImg` | String | - | Custom avatar image URL |
| `baseurl` | String | - | Base URL for assets |

### Usage Example

```handlebars
{{> landing.myappid-header 
    showHelperTip=true 
    hasNotification=true 
    avatarImg="/images/user-avatar.jpg"
}}
```

### Styling Notes
- Header has fixed positioning at top
- Navigation icons have 16px gap (`gap: 1rem`)
- Tooltip width: 185px
- Tooltip text: Graphik, 12px, #333
- Hand icon appears below close button in tooltip

---

## 2. Hero Section Component

**File:** `src/materials/02-components/03-landing/00-landing-hero.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-landing-hero.scss`

### Description
Welcome banner section with background image, title, and description text. Full-width section that appears below the header.

### HTML Structure

```handlebars
{{> landing.landing-hero heroClass="-compact" heroDesc="Custom description text"}}
```

### Key Features
- Full-width background image
- Gradient background support
- Customizable title (supports partial blocks)
- Description text
- Compact variant available

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-landing-hero` | Main hero container |
| `.c-landing-hero__bg` | Background image layer |
| `.c-landing-hero__content` | Content wrapper |
| `.c-landing-hero__title` | Main title (h1) |
| `.c-landing-hero__title-highlight` | "Welcome to myApplication" text |
| `.c-landing-hero__title-accent` | "ID" text with accent color |
| `.c-landing-hero__desc` | Description paragraph |
| `.c-landing-hero.-compact` | Compact variant (smaller height) |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `heroClass` | String | - | Additional CSS classes |
| `heroDesc` | String | "A self-service portal..." | Description text |
| `baseurl` | String | - | Base URL for assets |

### Typography

**Title:**
- Color: `#7C01DB`
- Font: Graphik
- Size: 36px
- Weight: 700
- Line-height: 120%
- Letter-spacing: -1px

**Description:**
- Color: `rgba(51, 51, 51, 0.80)`
- Font: Graphik
- Size: 20px
- Weight: 500
- Line-height: 26px (130%)
- Text-align: center

### Usage Example

```handlebars
{{> landing.landing-hero 
    heroDesc="Custom welcome message here"
}}
```

### Styling Notes
- Background height: 251px
- Background image: `src/assets/toolkit/images/hero-bg-gradient.png`
- Full-width layout
- Centered content

---

## 3. Requests Section Component

**File:** `src/materials/02-components/03-landing/03-requests-section.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-requests-section.scss`

### Description
Complete section container for the "My Requests" area. Includes header with title and "Create New Request" button, filter column, toolbar, search field, and table area.

### HTML Structure

```handlebars
{{> landing.requests-section}}
```

### Key Features
- Section header with title and action button
- Filter button positioned at left edge
- Action toolbar for bulk actions
- Search field with fixed width (1107px)
- Scrollable table container
- Responsive layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-requests-wrapper` | Main section container |
| `.c-requests-wrapper__header` | Header row (title + button) |
| `.c-requests-wrapper__title` | "My Requests" title |
| `.c-requests-wrapper__actions` | Action buttons container |
| `.c-requests-wrapper__content` | Main content row (flex layout) |
| `.c-requests-wrapper__filter-col` | Filter column at left edge |
| `.c-requests-wrapper__filter-btn` | Filter toggle button |
| `.c-requests-wrapper__filter-panel` | Filter panel container |
| `.c-requests-wrapper__main` | Main content area |
| `.c-requests-wrapper__toolbar` | Action toolbar container |
| `.c-requests-wrapper__search-table` | Search + table wrapper |
| `.c-requests-wrapper__search` | Search field container |
| `.c-requests-wrapper__table` | Scrollable table container |

### Layout Structure

```
.c-requests-wrapper
├── .c-requests-wrapper__header
│   ├── .c-requests-wrapper__title
│   └── .c-requests-wrapper__actions
└── .c-requests-wrapper__content
    ├── .c-requests-wrapper__filter-col (left edge)
    │   ├── .c-requests-wrapper__filter-btn
    │   └── .c-requests-wrapper__filter-panel
    └── .c-requests-wrapper__main
        ├── .c-requests-wrapper__toolbar
        └── .c-requests-wrapper__search-table
            ├── .c-requests-wrapper__search
            └── .c-requests-wrapper__table
```

### Typography

**Title ("My Requests"):**
- Color: `#333`
- Font: Graphik
- Size: 20px
- Weight: 500
- Line-height: 30px (150%)

**Create New Request Button:**
- Height: 40px
- Min-width: 108px
- Padding: 12px 16px
- Gap: 8px
- Color: `#FFF`
- Font: Graphik, 14px, 400
- Background: Gradient

### Styling Notes
- Filter button positioned at absolute left edge
- Search field: Fixed width 1107px, height 16px
- Table container: Responsive, scrollable
- Border-radius: 24px on top-left corner only
- Borders: Top, right, left (1px solid #DCDCDC)
- Background: #FFF

---

## 4. Action Toolbar Component

**File:** `src/materials/02-components/03-landing/02-action-toolbar.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-action-toolbar.scss`

### Description
Toolbar containing filter button and action buttons for bulk operations. Buttons are resizable and support multiple variants.

### HTML Structure

```handlebars
{{> landing.action-toolbar disabled=false}}
```

### Key Features
- Filter button (optional, can be hidden with `-no-filter` class)
- Multiple action buttons (View/Update, Disable, Re-Enable, Reset Password, Verify)
- Variant buttons (Upload Bulk Verify, Delete, Export)
- Resizable buttons (auto width based on content)
- 24px spacing between buttons

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-action-toolbar` | Main toolbar container |
| `.c-action-toolbar.-no-filter` | Hide filter button variant |
| `.c-action-toolbar__filter-btn` | Filter toggle button |
| `.c-action-toolbar__btn` | Action button (legacy, uses o-toolbar-button) |

### Button Variants

| Variant | Class | Description |
|---------|-------|-------------|
| Default | (none) | Gray background, dark text |
| Accent | `-accent` | Purple border, transparent bg |
| Dark | `-dark` | Dark background, white text |
| Outline | `-outline` | Purple border, transparent bg |

### Button Actions

| Action | Icon | Variant | Description |
|--------|------|---------|-------------|
| View/Update | `icon-toolbar-launch` | Default | View or update selected items |
| Disable | `icon-toolbar-disable` | Default | Disable selected items |
| Re-Enable | `icon-toolbar-done` | Default | Re-enable disabled items |
| Reset Password | `icon-toolbar-history` | Default | Reset password for items |
| Verify | `icon-toolbar-refresh` | Default | Verify selected items |
| Upload Bulk Verify | `icon-toolbar-refresh` | Accent | Upload and verify in bulk |
| Delete | `icon-toolbar-delete` | Dark | Delete selected items |
| Export | `icon-toolbar-launch` | Outline | Export data |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `disabled` | Boolean | `false` | Disable all buttons |

### Usage Example

```handlebars
{{> landing.action-toolbar disabled=false}}
```

### Styling Notes
- Gap between buttons: 24px (`gap: 1.5rem`)
- Buttons are resizable (width: auto)
- Minimum width: 40px
- Height: 32px
- Border-radius: 999px (pill shape)
- Flex-wrap enabled for responsive layout

---

## 5. Filter Panel Component

**File:** `src/materials/02-components/03-landing/09-filter-panel.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-filter-panel.scss`

### Description
Collapsible filter panel that appears when the filter button is clicked. Contains filter sections, clear all option, minimize button, and apply filters action.

### HTML Structure

```handlebars
{{> landing.filter-panel filterClass="-show"}}
```

### Key Features
- Initially hidden (shown with `-show` class)
- Header with title, clear all link, and minimize button
- Body section for filter options
- Footer with "Apply Filters" button
- Replaces filter button when opened

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-filter-panel` | Main panel container |
| `.c-filter-panel.-show` | Show panel (visible state) |
| `.c-filter-panel__header` | Panel header |
| `.c-filter-panel__title` | "FILTERS" title with icon |
| `.c-filter-panel__clear` | "Clear All" link/button |
| `.c-filter-panel__minimize` | Minimize button (icon-minus) |
| `.c-filter-panel__body` | Filter content area |
| `.c-filter-panel__placeholder` | Placeholder content |
| `.c-filter-panel__footer` | Footer with apply button |
| `.c-filter-panel__apply` | "Apply Filters" button |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `filterClass` | String | - | Additional classes (use `-show` to display) |

### Usage Example

```handlebars
{{> landing.filter-panel filterClass="-show"}}
```

### Styling Notes
- Panel appears as sidebar replacing filter button
- Width: 280px (default)
- Minimize icon: `icon-minus`
- Clear All: Link style, right-aligned
- Apply button: Primary button style

---

## 6. Search Field Element

**File:** `src/materials/01-elements/08-search/01-searchfield.html`  
**SCSS:** `src/assets/toolkit/styles/elements/search/_o-searchfield.scss`

### Description
Search input field with icon. Used within the requests section for filtering/searching requests.

### HTML Structure

```handlebars
{{> search.searchfield srchfplc="Search" srchfid="requests-search"}}
```

### Key Features
- Search icon (`icon-input-search`)
- Placeholder text support
- Accessible labels
- Toggle variant available

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.o-searchfield__wrap` | Input wrapper container |
| `.o-searchfield__icon` | Search icon |
| `.o-searchfield__input` | Input field |
| `.o-searchfield__toggle` | Toggle button (for toggle variant) |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `toggle` | Boolean | `false` | Use toggleable variant |
| `srchfplc` | String | "Search..." | Placeholder text |
| `srchfid` | String | "searchf_1" | Input ID |
| `srchflbl` | String | "Search" | Aria label |
| `srcfcls` | String | - | Additional wrapper classes |

### Typography & Styling

- Width: 1107px (fixed)
- Height: 16px
- Padding: 8.008px 0.5px 8.008px 3.003px
- Gap: 4px (icon to input)
- Color: `#7C7C7C`
- Font: Graphik, 14px, 400
- Border-bottom: 1px solid #A5A5A5
- Icon color: `#5922F6`
- Icon size: 13.372px × 12.75px

### Usage Example

```handlebars
{{> search.searchfield 
    srchfplc="Search requests..." 
    srchfid="requests-search"
    srchflbl="Search requests"
}}
```

### Styling Notes
- Centered within container
- Border appears below input (centered)
- Icon positioned to the left
- Responsive: max-width adjusts on smaller screens

---

## 7. Requests Table Component

**File:** `src/materials/02-components/03-landing/04-requests-table.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-requests-table.scss`

### Description
Data table for displaying application ID requests. Includes sortable columns, checkbox selection, and empty state support.

### HTML Structure

```handlebars
{{> landing.requests-table}}
```

### Key Features
- Checkbox column for row selection
- Sortable columns with `icon-swap-vert` indicator
- Multiple data columns
- Empty state support
- Responsive table layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-requests-table` | Main table container |
| `.c-table__responsive` | Responsive wrapper |
| `.c-table__table` | Table element |
| `.c-requests-table__checkbox-col` | Checkbox column |
| `.c-requests-table__header` | Column header wrapper |
| `.c-requests-table__title` | Column title text |
| `.c-requests-table__sort` | Sort button |
| `.c-requests-table__empty-row` | Empty state row |

### Table Columns

| Column | Sortable | Description |
|--------|----------|-------------|
| Checkbox | No | Select all/individual rows |
| Application ID | Yes | Application identifier |
| Account Type | Yes | Type of account |
| Status | Yes | Request status |
| Credential | Yes | Credential information |
| AIR ID | Yes | AIR identifier |
| Application | Yes | Application name |

### Table Header Styling

- Background: `#F2F2F2`
- Border-right: 1px solid `#DCDCDC`
- Border-left: 1px solid `#DCDCDC`
- Padding: 0.75rem 1rem (vertical, horizontal)
- Font: Graphik, 13px, 500
- Color: `#181D1F`
- Text: No wrap (`white-space: nowrap`)

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| (uses partial blocks) | - | - | Pass table rows via `@partial-block` |

### Usage Example

```handlebars
{{#> landing.requests-table}}
    <tr>
        <td><input type="checkbox" /></td>
        <td>APP-001</td>
        <td>Production</td>
        <td>Active</td>
        <td>Cred-123</td>
        <td>AIR-456</td>
        <td>My App</td>
    </tr>
{{/landing.requests-table}}
```

### Styling Notes
- Table layout: `auto` (natural column widths)
- Checkbox column: 56px width
- Sort icon: `icon-swap-vert`
- Empty state shown when no rows provided
- Scrollable within container

---

## 8. Empty State Component

**File:** `src/materials/02-components/03-landing/05-empty-state.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-empty-state.scss`

### Description
Displays when no data is available. Includes illustration, title, description, and optional action button.

### HTML Structure

```handlebars
{{> landing.empty-state 
    emptyTitle="No App ID Requests" 
    emptyDesc="Create a new request to get started"
    emptyIcon="emptystateboard"
    emptyAction="Create Request"
}}
```

### Key Features
- Customizable illustration
- Title and description text
- Optional action button
- Variant support

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-empty-state` | Main container |
| `.c-empty-state__icon` | Illustration image container |
| `.c-empty-state__title` | Title heading |
| `.c-empty-state__desc` | Description text |
| `.c-empty-state__action` | Action button container |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `emptyClass` | String | - | Additional CSS classes |
| `emptyTitle` | String | "No App ID Requests" | Title text |
| `emptyDesc` | String | - | Description text |
| `emptyIcon` | String | "emptystateboard" | Illustration filename (without .svg) |
| `emptyAction` | String | - | Action button text |
| `baseurl` | String | - | Base URL for assets |

### Typography

**Title:**
- Color: `#333`
- Font: Graphik
- Size: 24px
- Weight: 500
- Line-height: 32px (133.333%)
- Text-align: center
- Overflow: hidden
- Text-overflow: ellipsis

**Description:**
- Color: `#333`
- Font: Graphik
- Size: 16px
- Weight: 400
- Line-height: 32px (200%)
- Overflow: hidden
- Text-overflow: ellipsis

### Usage Example

```handlebars
{{> landing.empty-state 
    emptyTitle="No Results Found" 
    emptyDesc="Try adjusting your search criteria"
    emptyIcon="empty-search"
    emptyAction="Clear Filters"
}}
```

### Styling Notes
- Illustration: `src/assets/toolkit/images/empty-states/emptystateboard.svg`
- Centered layout
- Text truncation with ellipsis
- Action button uses primary button component

---

## 9. Footer Component

**File:** `src/materials/02-components/03-landing/11-landing-footer.html`  
**SCSS:** `src/assets/toolkit/styles/components/landing/_c-landing-footer.scss`

### Description
Simple footer for the landing page with copyright text, dynamic year, and terms/privacy links.

### HTML Structure

```handlebars
{{> landing.landing-footer}}
```

### Key Features
- Dynamic copyright year (2001-current year)
- Terms of Use link
- Privacy Statement link
- Responsive layout

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.c-landing-footer` | Main footer container |
| `.c-landing-footer__inner` | Inner wrapper with app-container |
| `.c-landing-footer__copyright` | Copyright text |
| `.c-landing-footer__year` | Dynamic year span |
| `.c-landing-footer__links` | Links container |
| `.c-landing-footer__link` | Individual link |
| `.c-landing-footer__separator` | Separator pipe (|) |

### Typography & Styling

- Border-top: 1px solid `#737373`
- Background: `#000`
- Color: `#FFF`
- Font: Graphik
- Size: 12px
- Weight: 400
- Line-height: 16px (133.333%)
- Padding: 1rem

### Parameters

None (no parameters required)

### Usage Example

```handlebars
{{> landing.landing-footer}}
```

### Dynamic Year

The footer automatically updates the year using inline JavaScript:

```javascript
const yearElement = document.querySelector('.c-landing-footer__year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}
```

### Styling Notes
- Footer spans full width
- Links have hover underline effect
- Separator has reduced opacity
- Flexbox layout for responsive alignment

---

## 10. Toolbar Button Element

**File:** `src/materials/01-elements/01-buttons/04-toolbar-button.html`  
**SCSS:** `src/assets/toolkit/styles/elements/buttons/_o-toolbar-button.scss`

### Description
Reusable button element for action toolbars. Supports icons, text, variants, and disabled states. Resizable based on content.

### HTML Structure

```handlebars
{{> buttons.toolbar-button 
    icon-left="icon-toolbar-launch" 
    btn-text="View/Update" 
    variant="accent"
    dataAction="view-update"
    disabled=false
}}
```

### Key Features
- Left icon support
- Text label
- Multiple variants (default, accent, dark, outline)
- Disabled state
- Resizable (auto width)
- Data-action attribute for JS handlers

### CSS Classes

| Class | Purpose |
|-------|---------|
| `.o-toolbar-button` | Main button element |
| `.o-toolbar-button.-accent` | Accent variant (purple border) |
| `.o-toolbar-button.-dark` | Dark variant (dark bg, white text) |
| `.o-toolbar-button.-outline` | Outline variant (purple border, transparent) |
| `.o-toolbar-button.-disabled` | Disabled state |
| `.o-toolbar-button__icon` | Icon element |
| `.o-toolbar-button__text` | Text label |

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `icon-left` | String | - | Icon class name |
| `btn-text` | String | "Button" | Button text |
| `variant` | String | - | Variant: `accent`, `dark`, `outline` |
| `dataAction` | String | - | Data-action attribute value |
| `disabled` | Boolean | `false` | Disable button |
| `btn-Class` | String | - | Additional CSS classes |
| `arialabel` | String | - | Aria label |
| `custom` | String | - | Custom attributes |

### Button Variants

#### Default
- Background: `#B3B2B5`
- Border: 2px solid transparent
- Text: `#423D47`
- Hover: `#9a999c`

#### Accent (`-accent`)
- Background: transparent
- Border: 2px solid `#CCCBCE`
- Text: `#A100FF`
- Hover: `rgba(161, 0, 255, 0.08)`

#### Dark (`-dark`)
- Background: `#423D47`
- Border: `#423D47`
- Text: `#FFF`
- Hover: `#2d2a30`

#### Outline (`-outline`)
- Background: transparent
- Border: 2px solid `#A100FF`
- Text: `#A100FF`
- Hover: Background `#A100FF`, text `#FFF`

### Typography & Dimensions

- Height: 32px (fixed)
- Min-width: 40px
- Width: auto (resizable)
- Padding: 8px 12px (vertical, horizontal)
- Gap: 6px (icon to text)
- Border-radius: 999px (pill shape)
- Font: Graphik (or Inter fallback)
- Font-size: 14px
- Font-weight: 500
- Line-height: 100%
- White-space: nowrap

### Usage Examples

```handlebars
<!-- Default button -->
{{> buttons.toolbar-button 
    icon-left="icon-toolbar-launch" 
    btn-text="View/Update"
    dataAction="view-update"
}}

<!-- Accent variant -->
{{> buttons.toolbar-button 
    icon-left="icon-toolbar-refresh" 
    btn-text="Upload Bulk Verify"
    variant="accent"
    dataAction="upload-bulk"
}}

<!-- Dark variant -->
{{> buttons.toolbar-button 
    icon-left="icon-toolbar-delete" 
    btn-text="Delete"
    variant="dark"
    dataAction="delete"
}}

<!-- Disabled button -->
{{> buttons.toolbar-button 
    icon-left="icon-toolbar-launch" 
    btn-text="Disabled Action"
    disabled=true
}}
```

### Styling Notes
- Buttons automatically resize to fit content
- Minimum width ensures usability
- Flex-shrink: 0 prevents compression
- Focus-visible: 2px solid accent outline
- Disabled: 50% opacity, not-allowed cursor

---

## Component Integration

### Complete Landing Page Structure

```handlebars
{{> landing.myappid-header}}

{{> landing.landing-hero}}

<main class="c-landing-main__content app-container">
    {{> landing.requests-section}}
</main>

{{> landing.landing-footer}}
```

### Component Dependencies

| Component | Depends On |
|-----------|------------|
| Requests Section | Action Toolbar, Filter Panel, Search Field, Requests Table |
| Action Toolbar | Toolbar Button Element |
| Requests Table | Empty State Component |
| Filter Panel | (standalone) |
| Search Field | (standalone element) |
| Empty State | Primary Button Element (optional) |

---

## JavaScript Functionality

### Filter Panel Toggle
- Filter button toggles panel visibility
- Panel replaces button when opened
- Minimize button closes panel
- Clear All resets filters

### Tooltip Management
- Amethyst tooltip appears on hover
- Close button dismisses tooltip
- Hand icon indicates clickable action

### Table Sorting
- Sort buttons on column headers
- Toggle ascending/descending
- Visual indicator with `icon-swap-vert`

### Dynamic Footer Year
- Automatically updates to current year
- No manual updates needed

---

## Accessibility Features

- ARIA labels on all interactive elements
- Semantic HTML (header, main, footer, nav, aside)
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Proper heading hierarchy

---

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile/tablet
- CSS Grid and Flexbox support required
- CSS Custom Properties (variables) support required

---

*Last updated: December 2024*
