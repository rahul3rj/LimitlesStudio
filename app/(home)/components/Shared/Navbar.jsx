'use client'

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); 

// ── Section definitions — update selectors to match your actual section classNames ──
const SECTIONS = [
  { selector: ".landing-section",  name: "HOME",      start: "top center", end: "bottom center" },
  { selector: ".text-page-section", name: "MANIFEST",  start: "top center", end: "bottom center" },
  { selector: ".workwedo-section",  name: "SERVICES",  start: "top center", end: "bottom center" },
  { selector: ".work-section",      name: "WORK",      start: "top center", end: "bottom center" },
  { selector: ".footer-section",    name: "FOOTER",    start: "top center", end: "bottom center" },
];

const TICK_COUNT = 200;

// ── Tick dimension knobs ──
const TICK_GAP          = 5;    // px gap between every tick
const MINOR_TICK_W      = 4;    // px width  of a minor tick
const MINOR_TICK_H      = 2;    // px height of a minor tick
const MAJOR_TICK_W      = 12;   // px width  of a major tick (every 5th)
const MAJOR_TICK_H      = 2;    // px height of a major tick
const LENS_EXPAND_MAJOR = 22;   // extra px added to major ticks at cursor
const LENS_EXPAND_MINOR = 14;   // extra px added to minor ticks at cursor
const TICK_SCROLL_SPEED = 0.15; // scroll multiplier
const TICKS_HEIGHT      = 300;  // px height of the ticks column on screen

const TICK_STEP = MAJOR_TICK_H + TICK_GAP; // dominant row height

const Navbar = () => {
  const ticks = Array.from({ length: TICK_COUNT });

  const leftTicksRef  = useRef(null);
  const rightTicksRef = useRef(null);
  const leftLabelRef  = useRef(null);
  const rightLabelRef = useRef(null);
  const smoothY       = useRef(0);
  const dotsRef       = useRef(null);
  const navRef        = useRef(null);
  const isMenuOpen    = useRef(false);
  const isScrolledDown = useRef(false);

  const [currentSection,    setCurrentSection]    = useState("HOME");
  const [leftLabelVisible,  setLeftLabelVisible]  = useState(false);
  const [rightLabelVisible, setRightLabelVisible] = useState(false);

  // Lens state — kept in refs so no re-renders occur per frame
  const leftMouseY  = useRef(-1);
  const rightMouseY = useRef(-1);
  const leftActive  = useRef(false);
  const rightActive = useRef(false);

  // ── Lens effect: widens ticks near the cursor ──
  const applyLens = useCallback((ticksInner, mouseY, isActive) => {
    if (!ticksInner) return;
    const children  = ticksInner.children;
    const transform = ticksInner.style.transform || "";
    const match     = transform.match(/translateY\(([-\d.]+)px\)/);
    const scrollOffset = match ? parseFloat(match[1]) : 0;

    for (let i = 0; i < children.length; i++) {
      const isMajor = i % 5 === 0;
      const baseW   = isMajor ? MAJOR_TICK_W : MINOR_TICK_W;
      if (isActive && mouseY >= 0) {
        const tickVisualY = i * TICK_STEP + scrollOffset;
        const dist        = Math.abs(tickVisualY - mouseY);
        const sigma       = 28;
        const factor      = Math.exp(-(dist * dist) / (2 * sigma * sigma));
        const w           = baseW + (isMajor ? LENS_EXPAND_MAJOR : LENS_EXPAND_MINOR) * factor;
        children[i].style.width = `${w}px`;
      } else {
        children[i].style.width = `${baseW}px`;
      }
    }
  }, []);

  // ── RAF loop: scrolls ticks + applies lens every frame ──
  useEffect(() => {
    const mod = (n, m) => ((n % m) + m) % m;
    let rafId;

    const animate = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const targetY = scrollY * TICK_SCROLL_SPEED;
      smoothY.current += (targetY - smoothY.current) * 0.12;
      const wrappedY = -mod(smoothY.current, TICK_STEP * 5);

      if (leftTicksRef.current) {
        leftTicksRef.current.style.transform = `translateY(${wrappedY}px)`;
        applyLens(leftTicksRef.current, leftMouseY.current, leftActive.current);
      }
      if (rightTicksRef.current) {
        rightTicksRef.current.style.transform = `translateY(${wrappedY}px)`;
        applyLens(rightTicksRef.current, rightMouseY.current, rightActive.current);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [applyLens]);

  // ── Track which section is in the viewport ──
  useEffect(() => {
    const triggers = [];
    // Delay slightly so all sections have mounted
    const timer = setTimeout(() => {
      SECTIONS.forEach((s) => {
        const el = document.querySelector(s.selector);
        if (!el) return;
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: s.start,
            end:   s.end,
            onEnter: () => setCurrentSection(s.name),
            onEnterBack: () => setCurrentSection(s.name)
          })
        );
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  // ── Nav Links ↔ Dots hamburger transition driven by scroll ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(dotsRef.current, { opacity: 0, scale: 0.8, pointerEvents: "none" });
      gsap.set(navRef.current,  { opacity: 1, y: 0, x: 0, pointerEvents: "auto" });

      ScrollTrigger.create({
        trigger: ".landing-section",
        start: "bottom 60%",
        onLeave: () => {
          isScrolledDown.current = true;
          if (!isMenuOpen.current) {
              gsap.to(navRef.current,  { opacity: 0, y: 10, x: 0, duration: 0.3, ease: "power2.in",  pointerEvents: "none" });
          }
          gsap.to(dotsRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out", pointerEvents: "auto" });
        },
        onEnterBack: () => {
          isScrolledDown.current = false;
          isMenuOpen.current = false;
          gsap.to(dotsRef.current, { opacity: 0, scale: 0.8, rotate: 0, duration: 0.3, ease: "power2.in",  pointerEvents: "none" });
          gsap.to(navRef.current,  { opacity: 1, y: 0, x: 0, duration: 0.4, ease: "power2.out", pointerEvents: "auto" });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen.current) {
        isMenuOpen.current = false;
        gsap.to(dotsRef.current, { rotate: 0, duration: 0.3, ease: "power2.out" });
        if (isScrolledDown.current) {
            gsap.to(navRef.current, { opacity: 0, y: 10, x: 0, duration: 0.3, ease: "power2.in", pointerEvents: "none" });
        }
    } else {
        isMenuOpen.current = true;
        gsap.to(dotsRef.current, { rotate: 90, duration: 0.3, ease: "power2.out" });
        gsap.to(navRef.current, { opacity: 1, y: 0, x: -35, duration: 0.4, ease: "power2.out", pointerEvents: "auto" });
    }
  };

  // ── Mouse handlers for left tick lens ──
  const onLeftMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    leftMouseY.current = e.clientY - rect.top;
    if (leftLabelRef.current) {
      leftLabelRef.current.style.top = `${leftMouseY.current}px`;
    }
  }, []);
  const onLeftEnter = useCallback(() => {
    leftActive.current = true;
    setLeftLabelVisible(true);
  }, []);
  const onLeftLeave = useCallback(() => {
    leftActive.current  = false;
    leftMouseY.current  = -1;
    setLeftLabelVisible(false);
  }, []);

  // ── Mouse handlers for right tick lens ──
  const onRightMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rightMouseY.current = e.clientY - rect.top;
    if (rightLabelRef.current) {
      rightLabelRef.current.style.top = `${rightMouseY.current}px`;
    }
  }, []);
  const onRightEnter = useCallback(() => {
    rightActive.current = true;
    setRightLabelVisible(true);
  }, []);
  const onRightLeave = useCallback(() => {
    rightActive.current  = false;
    rightMouseY.current  = -1;
    setRightLabelVisible(false);
  }, []);

  return (
    <>
      {/* ── UI layer ── */}
      <div className="fixed inset-0 z-[1000] pointer-events-none font-sans text-white">

        {/* ── Top Left: Logo (wrapped in Link for SPA navigation) ── */}
        <Link 
          href="/" 
          className="absolute top-10 left-10 xl:top-12 xl:left-14 2xl:top-8 2xl:left-16 pointer-events-auto flex items-center gap-3 cursor-pointer"
        >
          <img src="/logo.png" className="h-7" alt="" />
        </Link>

        {/* ── Top Right: 4-Dot Hamburger (visible after scroll) ── */}
        <div
          ref={dotsRef}
          onClick={toggleMenu}
          data-cursor="hover"
          className="absolute top-10 right-10 xl:top-12 xl:right-14 2xl:top-14 2xl:right-16 pointer-events-auto cursor-pointer"
        >
          <div className="grid grid-cols-2 gap-[5px]">
            <span className="w-[5px] h-[5px] rounded-full bg-white/80"></span>
            <span className="w-[5px] h-[5px] rounded-full bg-white/80"></span>
            <span className="w-[5px] h-[5px] rounded-full bg-white/80"></span>
            <span className="w-[5px] h-[5px] rounded-full bg-white/80"></span>
          </div>
        </div>

        {/* ── Top Right: Nav Links (visible on landing, hides on scroll) ── */}
        <div
          ref={navRef}
          className="absolute top-10 right-10 xl:top-12 xl:right-14 2xl:top-14 2xl:right-16 pointer-events-auto flex flex-col text-right text-[10px] xl:text-[11px] tracking-[0.2em] gap-3 xl:gap-4"
        >
          {["WORK", "PROCESS", "STUDIO", "CONTACT"].map((item, idx) => (
            <a
              key={idx}
              href="#"
              data-cursor="nav"
              className="relative group overflow-hidden cursor-none block"
            >
              <span className="block transition-all duration-300 group-hover:translate-y-[-100%]">
                {item}
              </span>
              <span className="absolute top-0 left-0 w-full text-right transition-all duration-300 translate-y-full group-hover:translate-y-0">
                {item}
              </span>
            </a>
          ))}
        </div>

        {/* ── Bottom Left: Scroll Indicator ── */}
        <div 
          className="absolute bottom-10 left-10 xl:bottom-12 xl:left-14 2xl:bottom-14 2xl:left-16 pointer-events-auto origin-bottom-left -rotate-90 hidden md:flex items-center gap-1 transition-opacity duration-500"
          style={{ opacity: currentSection === "FOOTER" ? 0 : 1 }}
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-200">Scroll</span>
          {/* Inline arrow — no external image needed */}
          <img src="/arrow.png" alt="scroll arrow" className="w-3 h-3 rotate-90" />
        </div>

        {/* ── Bottom Right: Social Icons ── */}
        <div 
          className="absolute bottom-10 right-10 xl:bottom-12 xl:right-14 2xl:bottom-14 2xl:right-16 pointer-events-auto hidden md:flex flex-col gap-5 xl:gap-6 text-neutral-200 transition-opacity duration-500"
          style={{ opacity: currentSection === "FOOTER" ? 0 : 1 }}
        >

          {/* Dribbble */}
          <a href="#" data-cursor="icon" className="hover:text-white transition-colors cursor-none">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <circle cx="12" cy="12" r="10" fill="currentColor"/>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </a>

          {/* Instagram */}
          <a href="#" data-cursor="icon" className="hover:text-white transition-colors cursor-none">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="currentColor"/>
              <circle cx="12" cy="12" r="4.5" fill="none" stroke="black" strokeWidth="1.8"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="black"/>
            </svg>
          </a>

          {/* LinkedIn */}
          <a href="#" data-cursor="icon" className="hover:text-white transition-colors cursor-none">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

        </div>
      </div>

      {/* ── Ticks layer ── */}
      <div 
        className="fixed inset-0 z-[1000] pointer-events-none font-sans text-white transition-opacity duration-500 hidden md:block"
        style={{ opacity: currentSection === "FOOTER" ? 0 : 1 }}
      >

        {/* ── LEFT TICKS ── */}
        <div
          className="absolute left-10 xl:left-14 2xl:left-16 top-1/2 -translate-y-1/2 pointer-events-auto"
          onMouseMove={onLeftMove}
          onMouseEnter={onLeftEnter}
          onMouseLeave={onLeftLeave}
          style={{ cursor: "default", width: "40px", height: `${TICKS_HEIGHT}px` }}
        >
          {/* Section label — follows cursor Y */}
          <div
            ref={leftLabelRef}
            className="absolute left-full -translate-y-1/2 ml-3 flex items-center gap-2 whitespace-nowrap"
            style={{ opacity: leftLabelVisible ? 1 : 0, transition: "opacity 0.25s ease" }}
          >
            <div className="w-5 h-[1px] bg-white/50"></div>
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-white/90 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentSection}
            </span>
          </div>

          {/* Tick strip */}
          <div
            className="h-full overflow-hidden"
            style={{
              width: "40px",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div
              ref={leftTicksRef}
              className="absolute top-0 left-0 w-full flex flex-col items-start"
              style={{ gap: `${TICK_GAP}px` }}
            >
              {ticks.map((_, i) => (
                <div
                  key={`l-${i}`}
                  className="shrink-0"
                  style={{
                    width:      i % 5 === 0 ? `${MAJOR_TICK_W}px` : `${MINOR_TICK_W}px`,
                    height:     i % 5 === 0 ? `${MAJOR_TICK_H}px` : `${MINOR_TICK_H}px`,
                    background: i % 5 === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                    transition: "width 0.12s ease-out",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT TICKS ── */}
        <div
          className="absolute right-10 xl:right-14 2xl:right-16 top-1/2 -translate-y-1/2 pointer-events-auto"
          onMouseMove={onRightMove}
          onMouseEnter={onRightEnter}
          onMouseLeave={onRightLeave}
          style={{ cursor: "default", width: "40px", height: `${TICKS_HEIGHT}px` }}
        >
          {/* Section label — follows cursor Y */}
          <div
            ref={rightLabelRef}
            className="absolute right-full -translate-y-1/2 flex items-center gap-1 whitespace-nowrap"
            style={{ opacity: rightLabelVisible ? 1 : 0, transition: "opacity 0.25s ease" }}
          >
            <span
              className="text-[11px] tracking-[0.2em] uppercase text-white/90 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {currentSection}
            </span>
            <div className="w-5 h-[1px] bg-white/50"></div>
          </div>

          {/* Tick strip */}
          <div
            className="h-full overflow-hidden"
            style={{
              width: "40px",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            }}
          >
            <div
              ref={rightTicksRef}
              className="absolute top-0 right-0 w-full flex flex-col items-end"
              style={{ gap: `${TICK_GAP}px` }}
            >
              {ticks.map((_, i) => (
                <div
                  key={`r-${i}`}
                  className="shrink-0"
                  style={{
                    width:      i % 5 === 0 ? `${MAJOR_TICK_W}px` : `${MINOR_TICK_W}px`,
                    height:     i % 5 === 0 ? `${MAJOR_TICK_H}px` : `${MINOR_TICK_H}px`,
                    background: i % 5 === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                    transition: "width 0.12s ease-out",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;