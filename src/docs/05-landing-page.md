## Landing Page Components

The landing page module provides a complete set of components for building application portal landing pages like **myApplicationID**. These components follow the BEVM methodology and are fully accessible.

### Components Overview

| Component | Class Prefix | Description |
|-----------|--------------|-------------|
| myAppID Header | `c-myappid-header` | Custom header with logo, title, and nav icons |
| Landing Hero | `c-landing-hero` | Welcome banner with background image |
| Action Toolbar | `c-action-toolbar` | Row of action buttons for managing requests |
| Requests Section | `c-requests-section` | Complete section wrapper with header, search, and table |
| Requests Table | `c-requests-table` | Data table for displaying requests |
| Empty State | `c-empty-state` | Placeholder when no data is available |
| Important Notice | `c-important-notice` | Fixed sidebar for important announcements |
| Helper Tip | `c-helper-tip` | Contextual help tooltip (AI assistant prompt) |

---

### myAppID Header

Custom header component for myApplicationID portal with logo, title, and navigation icons.

```html
{{> landing.myappid-header}}
```

**Parameters:**
- `showHelperTip` - Show the amethyst helper tip tooltip (boolean)
- `hasNotification` - Show notification badge (boolean)
- `avatarImg` - Custom avatar image URL

**Icons included:**
- Help (?)
- Chat
- Campaign (speaker)
- Notification (bell)
- Amethyst AI Assistant
- User Avatar

---

### Landing Hero

The hero component displays a welcome banner with a background image, title, and description.

```html
{{> landing.landing-hero}}
```

**Modifiers:**
- `-compact` - Smaller variant with reduced padding

**Parameters:**
- `heroClass` - Additional CSS classes
- `heroDesc` - Custom description text

---

### Action Toolbar

A horizontal row of action buttons for managing table records.

```html
{{> landing.action-toolbar}}
```

**Button Variants:**
- Default - Standard gray button
- `-accent` - Purple outline (Upload Bulk Verify)
- `-outline` - Purple outline with hover fill (Export)
- `-delete` - Red on hover (Delete action)

**Data Attributes:**
- `data-action` - Action identifier for JavaScript handlers

---

### Requests Section

A complete wrapper component that includes:
- Section header with title
- "Create New Request" button
- Action toolbar
- Search field
- Table area

```html
{{> landing.requests-section}}
```

---

### Requests Table

Data table with sortable columns and checkbox selection.

```html
{{> landing.requests-table}}
```

**Columns:**
- Checkbox (selection)
- Application ID
- Account Type
- Status
- Credential
- AIR ID
- Application

**Row Modifiers:**
- `.-selected` - Highlighted selected row
- `.-disabled` - Grayed out disabled row

---

### Empty State

Displays when no data is available in a list or table.

```html
{{> landing.empty-state}}
```

**Parameters:**
- `emptyClass` - Additional CSS classes
- `emptyIcon` - Custom icon filename (from `/assets/toolkit/images/empty-states/`)
- `emptyTitle` - Title text (default: "No App ID Requests")
- `emptyDesc` - Description text
- `emptyAction` - Action button text

**Variants:**
- `-search` - Search results empty state
- `-error` - Error state
- `-compact` - Smaller variant

---

### Important Notice

A fixed sidebar component for displaying important announcements.

```html
{{> landing.important-notice}}
```

**Parameters:**
- `noticeClass` - Additional CSS classes

**States:**
- Default (collapsed) - Shows only toggle button
- Expanded - Shows full panel with content

---

### Helper Tip

A small contextual tooltip for AI assistant prompts or quick help tips.

```html
{{> landing.helper-tip}}
```

**Parameters:**
- `tipClass` - Additional CSS classes
- `tipText` - Tip message text
- `tipAction` - Show action button (boolean)

**Variants:**
- `-left` - Arrow points to the left
- `-top` - Arrow points upward

---

### Complete Page Example

```html
<!-- myApplicationID Header -->
{{> landing.myappid-header showHelperTip=true hasNotification=true}}

<!-- Landing Hero -->
{{> landing.landing-hero}}

<main class="app-container">
    <!-- My Requests Section -->
    {{> landing.requests-section}}
</main>

<!-- Important Notice Sidebar -->
{{> landing.important-notice}}
```

---

### Accessibility Notes

1. All interactive elements have proper `aria-label` attributes
2. Tables include `<caption>` for screen readers
3. Sort buttons have descriptive labels
4. Expandable components use `aria-expanded` and `aria-controls`
5. Color contrast meets WCAG 2.1 AA standards

---

### JavaScript Integration

The landing page components emit the following events:

| Component | Event | Description |
|-----------|-------|-------------|
| Action Toolbar | `action:click` | Fired when an action button is clicked |
| Requests Table | `row:select` | Fired when a row checkbox is changed |
| Important Notice | `notice:toggle` | Fired when the panel is opened/closed |

Example:
```javascript
document.querySelector('.c-action-toolbar').addEventListener('action:click', (e) => {
    const action = e.detail.action; // 'view-update', 'disable', etc.
    const selectedIds = getSelectedRequestIds();
    handleAction(action, selectedIds);
});
```
