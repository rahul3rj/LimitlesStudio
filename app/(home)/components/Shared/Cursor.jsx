'use client'

import { useEffect, useRef } from "react";
import gsap from "gsap";

const Cursor = () => {
  const wrapRef   = useRef(null);
  const imgRef    = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img  = imgRef.current;
    if (!wrap || !img) return;

    // ── GSAP setup: translate via xPercent/yPercent so SVG stays centred ──
    gsap.set(wrap, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });

    // ── Tracking vars ────────────────────────────────────────────────
    const mouse   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const lerpPos = { x: mouse.x, y: mouse.y };
    const vel     = { x: 0, y: 0 }; // for rotation tilt
    let prevX = mouse.x, prevY = mouse.y;
    let currentState = "default";

    const lerp  = (a, b, t) => a + (b - a) * t;
    const xSet  = gsap.quickSetter(wrap, "x", "px");
    const ySet  = gsap.quickSetter(wrap, "y", "px");

    // ── RAF tick ─────────────────────────────────────────────────────
    const tickFn = () => {
      // Smooth follow
      lerpPos.x = lerp(lerpPos.x, mouse.x, 0.11);
      lerpPos.y = lerp(lerpPos.y, mouse.y, 0.11);
      xSet(lerpPos.x);
      ySet(lerpPos.y);

      // Velocity → subtle tilt on the reticle
      vel.x = lerp(vel.x, mouse.x - prevX, 0.18);
      vel.y = lerp(vel.y, mouse.y - prevY, 0.18);
      prevX = lerpPos.x;
      prevY = lerpPos.y;

      // Clamp tilt to ±8 deg, feels restrained/military
      if (currentState === "default") {
        const tilt = Math.max(-8, Math.min(8, vel.x * 0.55));
        gsap.set(img, { rotation: tilt });
      }
    };
    gsap.ticker.add(tickFn);

    // ── Mouse move ───────────────────────────────────────────────────
    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const hideEl = e.target.closest('[data-cursor="hide"]');
      if (hideEl) {
        if (currentState !== "hide") {
          currentState = "hide";
          gsap.to(wrap, { opacity: 0, duration: 0.2, overwrite: true });
        }
        return;
      }

      // Check if hovering over any interactive element
      const clickable = e.target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      
      if (clickable) {
        if (currentState !== "hover") {
          currentState = "hover";
          
          // Convert wrapper to a big circle
          gsap.to(wrap, {
            width: 80,
            height: 80,
            backgroundColor: "white",
            borderRadius: "50%",
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true,
          });

          // Hide the SVG reticle
          gsap.to(img, {
            opacity: 0,
            scale: 0.5,
            duration: 0.3,
            ease: "power3.out",
            overwrite: true
          });
        }
      } else {
        if (currentState !== "default") {
          currentState = "default";
          
          // Revert wrapper to transparent state for SVG
          gsap.to(wrap, {
            width: 35,
            height: 27,
            backgroundColor: "transparent",
            borderRadius: "0%",
            opacity: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true,
          });

          // Show the SVG reticle
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: true
          });
        }
      }
    };
    
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Cleanup ──────────────────────────────────────────────────────
    return () => {
      gsap.ticker.remove(tickFn);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="global-cursor"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         35,
        height:        27,
        pointerEvents: "none",
        zIndex:        999999,
        willChange:    "transform, width, height",
        mixBlendMode:  "difference",     // keep colours true — no invert
        display:       "flex",
        alignItems:    "center",
        justifyContent:"center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="/cursor.svg"
        alt=""
        draggable={false}
        style={{
          width:      "100%",
          height:     "100%",
          display:    "block",
          userSelect: "none",
          opacity:    1,
        }}
      />
    </div>
  );
};

export default Cursor;