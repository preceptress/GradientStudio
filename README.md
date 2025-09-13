# Gradient Studio 🎨⚡  
[![HTML](https://img.shields.io/badge/HTML-5-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)  
[![CSS](https://img.shields.io/badge/CSS-3-blue?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)  
[![SwiftUI](https://img.shields.io/badge/SwiftUI-Live_Exports-orange?logo=swift)](https://developer.apple.com/xcode/swiftui/)  
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952b3?logo=bootstrap)](https://getbootstrap.com/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**One-Stop Background & Theme Generator** for people who argue about `#0b0c10` vs `#0e1117`.

Turn color stops into production-ready **CSS**, **SwiftUI**, and **PNG assets**—with live previews, draggable stops, and export toys galore. If you’ve ever said *“that conic blend needs 8% more teal,”* this is for you.

---

## ✨ Features

- **Three gradient types**: Linear, Radial, Conic (Angular)  
- **Drag-reorder stops** with precise **Position (%)** + **Opacity (%)** controls  
- **Live preview** + a mini **iPhone mock** that mirrors your gradient  
- **One-click exports**  
  - `Theme.swift` (drop into any SwiftUI project)  
  - **CSS** variable bundle (`theme.css`)  
  - **JSON** (import/export whole collections)  
  - **PNG** single + **PNG Pack** at custom sizes  
  - **iOS Demo (ZIP)**: a runnable SwiftUI app zipped from your current gradient  
- **100% local**: runs entirely in your browser — your gradients stay with you

---

## 🚀 Quick Start

```bash
git clone https://github.com/your-org/gradient-studio.git
cd gradient-studio
# Open index.html in your browser (no build step needed)
```

> Pro tip: enable **Format on Save** in VS Code for tidy edits.

---

## 🖥️ UI Tour

- **Designer**  
  Pick **Linear / Radial / Angular**, set angle or centers, then add color stops.  
  - **Position** = where the stop sits along the gradient (0–100%).  
  - **Opacity** = how opaque that stop is (0–100%).  
  - Drag ☰ to reorder.  
  - “Remove” deletes the row (at least one stop required).

- **Preview**  
  Full-bleed gradient preview that scales to match the Designer’s height.

- **Prototype & Code**  
  - **iPhone mock**: see it as a background on a device frame.  
  - **SwiftUI** and **CSS** code blocks update live with copy buttons.

---

## 📦 Exports

### PNG (single)
Choose a size (defaults to **1024**) → **Download PNG**.

### PNG Pack
Enter comma-separated sizes (e.g., `256, 512, 1024, 2000`) → **Export PNG Pack**.  
Files download like `MyGradient-256.png`, etc.

### CSS
Exports variables and helpers:

```css
/* theme.css */
:root {
  --g-myGradient: linear-gradient(90deg, rgba(26,26,64,1) 0%, rgba(0,0,0,1) 100%);
}
.bg-myGradient { background: var(--g-myGradient); }
```

### SwiftUI
`Theme.swift` with strongly typed `LinearGradient`, `RadialGradient`, or `AngularGradient`.

```swift
import SwiftUI

struct Theme {
    static let myGradient = LinearGradient(
        gradient: Gradient(colors: [
            Color(red: 0.102, green: 0.102, blue: 0.251, opacity: 1),
            Color(red: 0.114, green: 0.765, blue: 0.137, opacity: 1)
        ]),
        startPoint: UnitPoint(x: 0.0, y: 0.5),
        endPoint: UnitPoint(x: 1.0, y: 0.5)
    )
}
```

### iOS Demo (ZIP)
Generates:
- `Theme.swift` (your gradient)  
- `ContentView.swift` (simple SwiftUI demo)  
- `GradientDemoApp.swift`  
- `README.md` with run instructions  

Unzip, drag into Xcode, run on a simulator. Done.

---

## 🔧 Dev Notes

- **Stack**: HTML + Bootstrap (no build), Vanilla JS, JSZip  
- **Zero dependencies** at runtime (CDN Bootstrap + JSZip)  
- **Local-storage**: optional (save/restore collections—currently hidden by default)

### File map
```
index.html   # everything in one file (HTML/CSS/JS)
```

---

## 🧪 Power Tips

- Hold **Option/Alt** when editing numbers (macOS: use ↑/↓) to nudge values quickly.  
- Use **Angular** gradients for dials, rings, and “sweep” effects.  
- Opacity blends stops *between* colors—great for foggy ramps and UI glass.

---

## 🗺️ Roadmap

- [ ] Multi-stop easing (color space + interpolation curves)  
- [ ] Tailwind plugin generator  
- [ ] SVG export (mesh & shape masks)  
- [ ] WCAG contrast checker over gradients  
- [ ] Palette extraction from images  
- [ ] Shareable URLs

Have an idea? Open an issue with a tiny mock or example 👇

---

## 🤝 Contributing

PRs welcome!  
- Keep it dependency-light (no bundlers)  
- Aim for accessibility, keyboard support, and tidy semantics  
- Update this README if you add UI controls or shortcuts

---

## 📸 Screenshots

> Drop a couple of PNGs/GIFs here:
- `docs/screenshot-designer.png`  
- `docs/screenshot-iphone-mock.png`  
- `docs/screenshot-exports.png`

---

## 📝 License

MIT — build cool, colorful things.

---

## 🙌 Credits

Built by **TeamApex — Preceptress.ai** with an unhealthy respect for color stops.  
Questions? [`friends@preceptress.ai`](mailto:friends@preceptress.ai)

---

> “I came for the gradients, stayed for the PNG pack exporter.” – a very biased color nerd
