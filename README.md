# Meditation Quiz Island: Technical Documentation & Customization Guide

A mindful, immersive reflection experience designed to deepen the connection between a student and their meditation practice. This component is architected as a highly customizable "Island," ready for integration into modern web frameworks or deployment as a standalone module.

---

## 🛠 Key Features & Exhaustive Customization

The project is built on a modular stack that separates content, logic, and design systems for maximum flexibility.

### 1. Data Layer & Markdown Parsing
The quiz content is decoupled from the UI. It uses a custom parser that converts Markdown files into structured lesson objects. This allows non-technical editors to update quizzes without touching React code.

*   **File**: `src/data/lessons.ts`
*   **The Parser**: The `parseMarkdown` function handles semantic nuances, such as different dash types (—, –, -) and specific block markers.
*   **Snippet (Extending the Parser)**:
    ```typescript
    // To add a new data field (e.g., 'Insight'), update the regex loop in lessons.ts:
    const insightMatch = line.match(/-\s*\*Insight\*: (.*)/);
    if (insightMatch) {
      questions.push({ ...q, insight: insightMatch[1] });
    }
    ```

### 2. Mindful Visuals (The Motif System)
The breathing motifs are pure SVG components. They are designed to be "living" elements that respond to the `motif` and `transition` props.

*   **File**: `src/components/Motif.tsx`
*   **Customization**: You can add new motifs by implementing an SVG block in this file.
    ```typescript
    // Example: Adding a 'star' motif
    if (kind === "star") {
      return (
        <svg className={cls} viewBox="0 0 100 100">
          <polygon points="50,5 20,99 95,39 5,39 80,99" fill="currentColor" />
        </svg>
      );
    }
    ```
*   **Animation**: Core motifs use the `.breathe` CSS class for the expansion/contraction loop. The **Wave** motif uses a more complex, multi-path drift animation defined in `index.css`.

### 3. Design System (CSS Variables)
The entire aesthetic—from accent colors to transition speeds—is driven by a centralized CSS variable architecture.

*   **File**: `src/index.css`
*   **Theme Variables**:
    ```css
    :root {
      --sage: #8aa17a;      /* Main brand accent */
      --amber: #c48d52;     /* High-contrast highlight (AA accessible) */
      --t: 1000ms;          /* Duration for all phase transitions */
      --ease: cubic-bezier(0.4, 0, 0.2, 1);
    }
    ```
*   **Dusk Mode**: Applying the `.dusk` class to the `<html>` or `<body>` element automatically redefines these variables for low-light environments.

### 4. Typography & Legibility
To ensure quotes (Kierkegaard, Grundtvig, etc.) remain legible in all modes, we use a tiered font strategy:
*   **Lora (Serif)**: Used for reflective text and feedback. Its sturdy strokes and balanced contrast ensure "t"s and "i"s don't clip in light mode.
*   **Playfair Display (Serif)**: Used for high-impact headlines and intros.
*   **JetBrains Mono**: Used for functional "Metadata" (Lesson progress, timestamps).

### 5. Behavioral Psychology (habit-building)
The app implements three specific psychological triggers:
*   **Zeigarnik Effect**: The Journey Map (dots at the top) creates an "open loop" in the user's mind, motivating them to complete all lessons.
*   **IKEA Effect**: The pre-quiz reflection ensures users are "invested" in their current state before the first question is presented.
*   **B=MAT**: The result screen features a "Next Up" card with a direct CTA to maintain momentum.

---

## 🏝 Island Integration (Astro / Next.js / Remix)

This project follows the **Island Architecture** pattern, making it a self-contained unit of state and style.

### Connecting to an Astro Project:
1.  **Preparation**: Ensure your Astro project has the React integration (`npx astro add react`).
2.  **Import**: Move the `src` folder into your Astro components directory.
3.  **Deployment**: Use a client directive to hydrate the component:
    ```astro
    ---
    import { Island } from './components/Meditation/Island';
    ---
    <!-- client:visible ensures it only loads when scrolled into view -->
    <Island 
      client:visible 
      motif="lotus" 
      accent="sage" 
      language="da" 
      lessonId={1} 
    />
    ```

---

## 🚀 Moving to Production

To transition this from a design prototype to a live product:

### 1. Production Cleanup
The prototype includes a "Chrome" layer for designer review. To remove it:
*   **Action**: In `App.tsx`, delete the `<div className="chrome">...</div>` and `<div className="tweaks">...</div>` blocks.
*   **Action**: Remove the `editMode` state and toggles.

### 2. API Integration
The app currently uses `localStorage` for persistence. For a production environment, update `src/utils/persistence.ts` to sync with your database:
```typescript
export const saveProgress = async (data: Partial<SavedProgress>) => {
  // Production implementation:
  await fetch('/api/v1/progress', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### 3. Build Command
```bash
npm run build
```
The optimized assets will be generated in the `dist/` directory, ready for deployment on any static or edge hosting provider.
