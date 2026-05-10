'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * SmoothScrollProvider
 *
 * Initialises Lenis smooth scroll and pipes it into GSAP's ticker so that
 * ScrollTrigger stays perfectly in sync.
 *
 * Feel tuning:
 *   lerp  — lower  = longer, dreamier tail (e.g. 0.07)
 *           higher = snappier, shorter tail (e.g. 0.2)
 *   0.12  ≈ 0.3-0.4 s ease-out inertia — the "Awwwards" sweet spot.
 */
export default function SmoothScrollProvider({ children }) {
    const lenisRef = useRef(null)

    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.08,           // Reduced from 0.12 for a smoother, more buttery ease-out tail
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        })

        lenisRef.current = lenis

        // Feed Lenis into GSAP's ticker so ScrollTrigger scrub stays in sync
        lenis.on('scroll', ScrollTrigger.update)

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        // Disable GSAP lag smoothing — Lenis already handles this
        gsap.ticker.lagSmoothing(0)

        return () => {
            gsap.ticker.remove((time) => lenis.raf(time * 1000))
            lenis.destroy()
        }
    }, [])

    return <>{children}</>
}
