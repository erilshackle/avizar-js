# Avizar-js 🚀

A lightweight, modern notification library for JavaScript. Features **Glassmorphism** and **Pill** styles out of the box with zero dependencies.

## 📦 Installation

### Via NPM (Recommended)

```bash
npm install avizar-js

```

### Via CDN (Directly in Browser)

Insert the Script in your `<head>` or before `</body>`:

```html
<script src="https://unpkg.com/avizar-js@1.0.0/dist/avizar.min.js"></script>
```

---

## 🚀 Quick Start

### As an ES Module

```javascript
import Avizar from 'avizar-js';

Avizar.success("Success!", "Operation completed successfully.");

```

### Using CDN

```javascript
// Access it via the global 'Avizar' object
Avizar.info("Welcome!", "This is running via CDN.");

```

---

## 🛠 Usage & Shorthands

The API is designed to be flexible. You can pass just a message, or title + message + actions.

```javascript
// Just a message
Avizar.warning("Careful there!");

// Title and Message
Avizar.error("Database Error", "Connection lost.");

// With a single Button (Shorthand)
Avizar.success("File Saved", "Your progress is safe.", {
    button: "Open Folder",
    onClick: (id) => console.log("Toast " + id + " clicked!")
});

// With multiple Actions
Avizar.show("Confirm Exit", "Unsaved changes will be lost.", [
    { button: "Stay", onClick: () => {} },
    { button: "Exit", onClick: () => exitApp(), className: "btn-danger" }
]);

```

---

## ⚙️ Global Configuration

Set your defaults once at the start of your project.

```javascript
Avizar.config({
  position: 'top-right', // top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  theme: 'auto',         // 'light', 'dark', 'auto' (follows system)
  duration: 4000,        // 0 for infinite
  showProgress: true
});

```

---

## 🧪 Playground

Want to see it in action before installing? Check out the live playground:

👉 **[Launch Avizar Playground](https://erilshackle.github.io/avizar-js/)**

---

## 🎨 Themes

* **Glass:** Default modern look with backdrop blur.
* **Pill:** Rounded, compact notification. Add `className: 'pill'` to your options.
* **Solid:** Rect, solid notification. Add `className: 'solid'` to your options.

---

## 📄 License

MIT © [Erilando Carvalho](./LICENSE)
