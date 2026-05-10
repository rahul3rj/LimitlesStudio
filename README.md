# LimitlesStudio

An ultra-premium, Awwwards-style creative agency portfolio built with **Next.js**, **Tailwind CSS**, and heavily powered by **GSAP** for advanced scroll animations and complex interactions.

## 🚀 Technology Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation Engine:** [GSAP (GreenSock)](https://gsap.com/) + ScrollTrigger
- **Typography:** `next/font` with custom local fonts (Metropolis, IBM Plex Mono, Poppins)

---

## 📁 Project Structure

The codebase is strictly structured inside the Next.js `app/` directory, specifically grouped under the `(home)` route group to modularize the landing page components.

```text
limitlesstudio/
├── app/
│   ├── (home)/
│   │   ├── page.js                 # Main Assembly Page
│   │   └── components/
│   │       ├── Hero/
│   │       │   └── Hero.jsx        # Expanding Showreel & Intro
│   │       ├── Services/
│   │       │   └── Services.jsx    # "What we do?" with Glitch Images
│   │       ├── Work/
│   │       │   └── OurWork.jsx     # Virtual Infinite Scrolling Dial
│   │       └── Shared/
│   │           ├── Background.jsx  # Global Pinned Parallax Layer
│   │           ├── Cursor.jsx      # Custom Circular Interaction Cursor
│   │           ├── Footer.jsx      # Animated Footer
│   │           ├── Loader.jsx      # Initial Boot Circular Preloader
│   │           └── Navbar.jsx      # Global Nav & Side Scroll Ticks
│   ├── globals.css                 # Base Tailwind & Font Faces
│   └── layout.js                   # Root Layout & Font Initialization
└── public/                         # Static Assets (Images, Videos, Fonts)
```

---

## 🧠 Core Systems & Architecture

### 1. Advanced GSAP Integration
This project does not rely on simple CSS transitions. Almost all heavy lifting (parallax, pinning, text scrambling, expanding boxes) is done using **GSAP** and **ScrollTrigger**. 
- Whenever adding new animations, ensure you use `gsap.context()` inside a `useEffect` to safely clean up animations and prevent memory leaks.
- Mobile responsiveness for animations is primarily handled via `gsap.matchMedia()` instead of CSS media queries.

### 2. Global Pinned Background
Instead of assigning background images per component, a single `<Background />` component sits globally behind all sections. 
- It uses `position: fixed` and transitions its `object-position` dynamically as the user reaches different scroll triggers. 
- **Important:** Ensure z-indexes in new components are managed carefully so they do not accidentally fall behind the pinned background.

### 3. Custom Nav & Tick Dials
The `<Navbar />` contains absolute positioned UI layers. Specifically, the "Ticks layer" generates an endless virtual scrolling gauge (similar to a lens) on the left/right of the screen that tracks the user's scroll progression natively via `requestAnimationFrame`.

### 4. Custom Virtual Dial (OurWork)
The `OurWork.jsx` component uses a highly customized mouse-wheel event listener to cycle through projects instead of a standard horizontal scroll. 
- **Desktop:** Positions as a vertical infinite scrolling dial on the right.
- **Mobile:** Converts to a horizontal dial at the bottom of the section.
- Modifying this requires understanding the physical offset mathematics scaling applied in the inline React styles.

### 5. Text Glitch & Scramble
Components frequently use a custom `<ScrambleText />` micro-component which mathematically scrambles characters using `requestAnimationFrame` before landing on the final string.

### 6. Mix-Blend Modes & Colors
The project relies heavily on `mix-blend-difference` for text overlapping white backgrounds or images. Do not alter container background colors arbitrarily, as this will break the blending math and make text invisible.

---

## 📱 Mobile Responsiveness Strategy
The project was originally designed desktop-first. The responsive architecture strictly follows:
1. **Preserving Desktop**: Desktop UI remains untampered via the explicit use of `md:` prefixes in Tailwind.
2. **Mobile Layouts**: On mobile, elements collapse into flex-columns (`flex-col`), and GSAP `matchMedia` changes physical animation sizes (e.g., expanding from `30vw` to `80vw`).
3. **Hidden Chrome**: Extraneous UI (like the side scroll ticks, social icons, and large dials) are selectively hidden on mobile using `hidden md:flex` to avoid cluttering the viewport.

---

## 💻 Getting Started

To run the development server:

```bash
# Install dependencies
npm install

# Start the server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
