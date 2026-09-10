# 🎨 Chalk Animation & Hand-Drawn Graphics Guide

This guide details how to author, customize, and maintain chalk-styled animations and graphics across the portfolio platform with maximum velocity.

---

## 🏛️ System Architecture

```
components/chalk/
├── ChalkGritFilter.tsx      # Global SVG <filter id="chalk-grit"> (feTurbulence + displacement)
├── ChalkAnnotation.tsx      # Procedural text wrappers (circle, underline, box, highlight, strike, bracket)
├── ChalkArrow.tsx           # Organic chalk arrows (directional, curved, loops)
├── ChalkBadge.tsx           # Callout badges & sticky labels (+$12M, PROD READY)
└── ChalkSvgDiagram.tsx      # Automated Excalidraw/SVG path parser & stroke animator
```

---

## 1. Quick Start: Text Annotations

Wrap any text, keyword, or element with `<ChalkAnnotation>`:

```tsx
import ChalkAnnotation from "@/components/chalk/ChalkAnnotation";

export default function MetricCallout() {
  return (
    <p className="text-xl">
      Delivered pricing adjustments generating{" "}
      <ChalkAnnotation type="circle" color="#d94e34" trigger="inView">
        +$12M premium lift
      </ChalkAnnotation>{" "}
      with{" "}
      <ChalkAnnotation type="underline" color="#f59e0b" trigger="hover">
        sub-12ms inference latency
      </ChalkAnnotation>.
    </p>
  );
}
```

### Available Annotation Types:
| Type | Visual Effect | Default Color | Best For |
|---|---|---|---|
| `circle` | Loose enclosing hand-drawn ellipse | `#d94e34` (Terracotta) | Key metrics, revenue figures, milestones |
| `underline` | Organic double-stroke wavy underline | `#f59e0b` (Amber) | Emphasized technical terms, tools |
| `box` | Sketchy rectangular boundary | `#38bdf8` (Sky) | Architectural components, card labels |
| `bracket` | Left & right editorial brackets | `#10b981` (Emerald) | Quotes, citations, formulas |
| `strike` | Chalk cross-out strike line | `#ef4444` (Red) | Deprecated systems, legacy comparison |
| `highlight` | Translucent chalk hatch fill | Amber 25% | Editorial emphasis |

### Props Reference:
- `trigger`: `"inView"` (draws on scroll) | `"hover"` (draws on hover) | `"mount"` (draws immediately)
- `duration`: Animation duration in seconds (default `0.45`)
- `strokeWidth`: Stroke thickness in px (default `2.2`)
- `roughness`: Curve jitter/wobble intensity (default `1.6`)
- `color`: Custom CSS color string (e.g. `#d94e34` or `#38bdf8`)

---

## 2. Chalk Connectors & Badges

### Hand-drawn Chalk Arrows:
```tsx
import ChalkArrow from "@/components/chalk/ChalkArrow";

<ChalkArrow
  direction="curve-right-down"
  color="#f59e0b"
  label="12ms latency"
  trigger="inView"
/>
```
**Supported directions**: `"right"`, `"left"`, `"up"`, `"down"`, `"curve-right-down"`, `"curve-left-down"`, `"loop-right"`.

### Callout Badges:
```tsx
import ChalkBadge from "@/components/chalk/ChalkBadge";

<ChalkBadge color="#10b981" trigger="inView">
  PROD READY
</ChalkBadge>
```

---

## 3. Fast Diagram Pipeline: Excalidraw to Code

Instead of coding SVG paths manually, follow this visual workflow:

1. Open [Excalidraw](https://excalidraw.com) or the VS Code Excalidraw extension.
2. Draw your ML pipeline, state machine, or system architecture.
3. Click **Export** ➔ **Export to SVG** (check "Embed scene" if you want to edit later).
4. Save the file into `public/chalk-diagrams/my-architecture.svg`.
5. Render and animate it with one line:
   ```tsx
   import ChalkSvgDiagram from "@/components/chalk/ChalkSvgDiagram";

   <ChalkSvgDiagram
     src="/chalk-diagrams/my-architecture.svg"
     trigger="inView"
     stagger={0.06}
     strokeDuration={0.4}
     colorMode="adaptive"
     showControls
   />
   ```

`ChalkSvgDiagram` automatically:
- Extracts all vector paths and text layers.
- Applies the powdery `#chalk-grit` SVG filter.
- Animates each stroke sequentially as if hand-drawn in real time.
- Adapts colors seamlessly between dark blackboard and light graph paper.

---

## 4. Chalk in Blog Post Markdown

You can author chalk annotations directly in markdown files without writing TSX:

### Inline Annotations:
```markdown
Delivered compound GLM models driving [+$12M revenue](chalk:circle) with [under 12ms latency](chalk:underline).

This system replaced the [legacy monolithic engine](chalk:strike).
```

### Embedded Chalk Diagrams:
````markdown
```chalk-diagram
/chalk-diagrams/ml-pipeline-sample.svg
```
````

---

## 5. Developer Chalk Studio (`/admin/chalk-lab`)

Visit `/admin/chalk-lab` in your local development environment (`http://localhost:3000/admin/chalk-lab`) to:
1. **Interactive Sandbox**: Adjust roughness, stroke thickness, duration, and colors with live sliders.
2. **SVG Paste Tester**: Paste any raw SVG from Figma or Excalidraw and see how it animates with chalk filters.
3. **One-Click Code Generation**: Click **Copy JSX** to grab production-ready component code.
