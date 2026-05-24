# 🎨 UI Developer Onboarding Guide: Thozhil Frontend

Welcome to the team! This document will walk you through our architecture and workflow. As a UI Developer, your primary focus will be on the **visual layer**, ensuring a premium, polished user experience.

---

## 🏗 High-Level Architecture

We follow a strict **Separation of Concerns** using a "Hook-Container-Visual" pattern.

### The "Visual-First" Pattern
Most major features are split into three parts:
1.  **Hooks (`src/hooks/`)**: Handles all logic, API calls, and state management.
2.  **Visual Components (`src/components/.../Visuals.tsx`)**: The code you will spend 90% of your time in. These focus exclusively on layout, HTML structure, and class names.
3.  **Styles (`src/styles/`)**: Dedicated CSS files for each module.

---

## 📂 Folder Structure & Permissions

| Folder | What's inside? | Your Access |
| :--- | :--- | :--- |
| `src/styles/` | All CSS files. Organized by module (dashboard, profile, etc.). | **Full Access** (Edit freely) |
| `src/components/` | Visual components (Header, Cards, Stats). Look for files ending in `Visuals.tsx`. | **Full Access** (Styling/Layout) |
| `src/pages/` | Main page containers. Use these to see how components are assembled. | **Limited** (Layout adjustments only) |
| `src/hooks/` | Business logic, API fetching, and complex calculations. | **Read-only** (Unless adding new UI states) |
| `src/api/` | Backend communication logic. | **Restricted** (Avoid editing) |
| `src/utils/` | Shared constants and formatters. | **Read-only** |

---

## 💅 Styling Guidelines

### 1. CSS over Inline Styles
We prefer centralized CSS files in `src/styles/`. Avoid using inline `style={{...}}` props unless it's for dynamic values (like progress bar percentages).

### 2. Design Tokens
Check `src/index.css` for our global CSS variables (colors, fonts, shadows). Always use these variables to maintain consistency:
```css
/* CORRECT ✅ */
color: var(--primary-color);
box-shadow: var(--card-shadow);

/* INCORRECT ❌ */
color: #3b82f6; 
```

### 3. Animations
We use high-quality micro-interactions. Look for classes like `animate-fade-in` or check `student-dashboard.css` for our standard transition durations.

---

## 🛠 Workflow & Troubleshooting

### When adding a new UI element:
1.  Check the `*Visuals.tsx` component.
2.  Check the props being passed from the hook to see what data is available.
3.  Update the corresponding `.css` file in `src/styles/`.

### If you hit a wall:
- **Data missing?** If a component needs a profile field that isn't in the `profile` object, talk to the Senior Engineer (me) to update the Hook or Backend API.
- **Routing issues?** Navigation is handled in `src/routes/`. If a link is broken, check there.
- **Build Errors?** If you see TypeScript errors, it's usually because a prop type was changed. Ensure your new component props are reflected in the `interface` at the top of the file.

### Syncing with Backend:
We use a mock/real data bridge in our hooks. You don't need to know how the API works, just how to use the data provided to the visuals.

---

## 🚀 Final Tip: "Migration, not Mutation"
When refactoring a complex component, we prefer splitting it into smaller, single-responsibility files (e.g., `ProfileHeader.tsx`, `ProfileBio.tsx`) rather than having one 1000-line file.

**Happy Coding! Let's build something beautiful.**
