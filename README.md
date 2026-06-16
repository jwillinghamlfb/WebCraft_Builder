# WebCraft — Handcrafted Standalone Visual Web Inspector & No-Code Builder

A high-fidelity developer workspace and single-pane visual web app builder. Assemble responsive grid elements, configure client or full-stack backend endpoints (Firebase Firestore, Supabase, or local sandboxes), capture multi-version project snapshots, and instantly compile SEO/AEO/GEO-optimized standalone codebases with zero layout drift.

Licensed under the **GNU AGPLv3** copyleft license.

---

## 🚀 Architectural Paradigm

WebCraft compiles visual node graphs straight to pure-CSS component sheets. Features include:
- **Zero-Drift Bento-Grid Engine**: Drag, drop, order, and customize modular responsive containers.
- **Deep Integrations**: Real-time firebase databases, auth templates, and raw API channels configured directly in-editor.
- **Micro-History Snapshots**: Save, rollback, restore, or delete version-tagged snapshot histories maintained in local storage.
- **Complete AEO/GEO Ingestion Profile**: Embedded JSON-LD schema scripting, meta keywords, primary queries, and robots context alongside LLM-optimized crawler descriptors (`llms.txt`, `llms-full.txt`).

---

## 🛠️ Local Installation & Development

To run the WebCraft IDE locally in a sandboxed developer environment, execute:

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** or **PNPM** package manager

### 1. Clone & Navigate
```bash
git clone <repository-url> webcraft-ide
cd webcraft-ide
```

### 2. Install Dependencies
Initialize base system libraries and Vite development server assets:
```bash
npm install
```

### 3. Environment Variables Setup
Copy the template variables file and fill in optionally your custom credentials:
```bash
cp .env.example .env
```

### 4. Boot Dev Server
Runs a highly active local environment with Vite automatic type resolution and Hot Module Replacement (HMR) capabilities:
```bash
npm run dev
```
By default, the application runs on **port 3000** at `http://localhost:3000`.

### 5. Production Compilation
Bundle public builds and compile the client bundle into standard static files:
```bash
npm run build
```

---

## 📖 How To Use WebCraft

1. **Workspace Grid Design**: Hover blocks on the main browser canvas viewport, adjust layout stacking orders, delete, or configure properties.
2. **Build Drawer Sidebar**: Slide open the Left Tool drawer to drop templates or components (Headers, Features, Pricing panels, Hero screens).
3. **Configure Search Engine & Crawler Optimization**: Use the custom **Settings tab** inside the Left Sidebar. Expand the SEO, AEO, or LLM-focused crawler details, toggle "Auto-Generate Compliant Spec Metadata", or review crawler sheets.
4. **Integration Setup**: Toggle the database options for custom Live Firebase setups or Supabase collections. 
5. **Exporter Console**: Drag the Right Code drawer to inspect compiled responsive HTML, view inline styles, copy snippet modules, or review auto-injected JSON-LD structural graphs.
6. **Live Sandbox Preview**: Launch full interactive prototypes using the live workspace player.

---

## ⚖️ AGPLv3 LICENSE REFERENCE

This program is free software: you can redistribute it and/or modify it under the terms of the **GNU Affero General Public License (AGPLv3)** as published by the Free Software Foundation. 

```text
Visual WebCraft Workspace IDE - A high-performance no-code code sandbox.
Copyright (C) 2026 WebCraft Dev Community

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.
```

For full details, please refer to the `LICENSE` file or visit [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html). If you host this application as a network service, you must make its source code fully available to the connecting audience under AGPL.
