'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Numerical dial data ── */
const DIAL_NUMBERS = [
    '001', '002', '003', '004', '005', '006', '007', '008',
    '009', '010', '011', '012', '013', '014', '015', '016',
    '017', '018', '019', '020', '021', '022', '023', '024',
]

const Hero = () => {
    const noiseCanvasRef = useRef(null)
    const sectionRef = useRef(null)
    const centerBoxRef = useRef(null)
    const heroTextRef = useRef(null)
    const subtitleRef = useRef(null)
    const creativeRef = useRef(null)
    const projectsRef = useRef(null)
    const leftDialRef = useRef(null)
    const rightDialRef = useRef(null)
    const leftDialWrapRef = useRef(null)
    const rightDialWrapRef = useRef(null)
    const contactRef = useRef(null)
    const cornersRef = useRef(null)
    const cursorRef = useRef(null)
    const videoRef = useRef(null)

    const [cursorVisible, setCursorVisible] = useState(false)
    const [isTouchDevice, setIsTouchDevice] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const isPlayingRef = useRef(false) // For GSAP callback scope

    // Detect touch devices — hide custom cursor on mobile/tablet
    useEffect(() => {
        const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
        setIsTouchDevice(isTouch)
    }, [])

    // Logic to handle cursor visibility based on hover AND expansion
    useEffect(() => {
        if (isTouchDevice) return

        if (isHovering && isExpanded) {
            setCursorVisible(true)
            document.body.classList.add('hide-global-cursor')
        } else {
            setCursorVisible(false)
            document.body.classList.remove('hide-global-cursor')
        }
    }, [isHovering, isExpanded, isTouchDevice])

    // Custom cursor follow effect (mouse only)
    useEffect(() => {
        if (isTouchDevice) return
        const cursor = cursorRef.current
        if (!cursor) return

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out',
            })
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [isTouchDevice])

    /* ── Noise canvas ── */
    useEffect(() => {
        const canvas = noiseCanvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const rect = canvas.getBoundingClientRect()
        const w = Math.floor(rect.width * dpr)
        const h = Math.floor(rect.height * dpr)
        canvas.width = w
        canvas.height = h

        const imageData = ctx.createImageData(w, h)
        const data = imageData.data
        const density = 0.42
        const alpha = Math.round(255 * 0.25)

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < density) {
                data[i] = 0
                data[i + 1] = 0
                data[i + 2] = 0
                data[i + 3] = alpha
            } else {
                data[i] = 0
                data[i + 1] = 0
                data[i + 2] = 0
                data[i + 3] = 0
            }
        }

        ctx.putImageData(imageData, 0, 0)
    }, [])

    /* ── GSAP scroll animations ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia()

            mm.add({
                isDesktop: "(min-width: 768px)",
                isMobile: "(max-width: 767px)"
            }, (context) => {
                let { isDesktop, isMobile } = context.conditions;

                // Pin the section for the duration of the scroll animation
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: '+=150%',
                        scrub: 1.2,
                        pin: true,
                        anticipatePin: 1,
                        onUpdate: (self) => {
                            // The LIMITLESSTUDIO text fades out over duration 0.2
                            // Out of total duration 0.7, 0.2/0.7 = ~0.28
                            // So setting progress > 0.3 ensures text is gone completely!
                            setIsExpanded(self.progress > 0.3)

                            // If scrolling further down (towards the end of the pin), fade out video
                            if (self.progress > 0.85 && isPlayingRef.current) {
                                if (videoRef.current) videoRef.current.pause()
                                setIsPlaying(false)
                                isPlayingRef.current = false
                            }
                        }
                    },
                })

                // ── Phase 1: Center box expands with elastic feel ──
                tl.to(
                    centerBoxRef.current,
                    {
                        width: isMobile ? '95vw' : '77vw',
                        height: isMobile ? '85vh' : '77vh',
                        borderRadius: '18px',
                        ease: 'power3.out',
                        duration: 0.7,
                    },
                    0
                )

                // ── Phase 1: Fade out hero text FAST ──
                tl.to(
                    heroTextRef.current,
                    {
                        opacity: 0,
                        y: 100,
                        scale: 0.95,
                        ease: 'power3.in',
                        duration: 0.2,
                    },
                    0
                )

                // ── Phase 1: Fade out subtitle FAST ──
                tl.to(
                    subtitleRef.current,
                    {
                        opacity: 0,
                        y: 50,
                        ease: 'power3.in',
                        duration: 0.15,
                    },
                    0
                )

                // ── Phase 1: Move CREATIVE AGENCY up & keep visible ──
                tl.to(
                    creativeRef.current,
                    {
                        y: -20,
                        ease: 'power2.out',
                        duration: 0.6,
                    },
                    0
                )

                // ── Phase 1: Move 20+ PROJECTS down & keep visible ──
                tl.to(
                    projectsRef.current,
                    {
                        y: 20,
                        ease: 'power2.out',
                        duration: 0.6,
                    },
                    0
                )

                // ── Phase 1: Dial inner strips scroll (rolling numbers effect) ──
                tl.to(
                    leftDialRef.current,
                    {
                        y: -200,
                        ease: 'power2.in',
                        duration: 0.6,
                    },
                    0
                )
                tl.to(
                    rightDialRef.current,
                    {
                        y: -200,
                        ease: 'power2.in',
                        duration: 0.6,
                    },
                    0
                )

                // ── Phase 1: Fade out dials + contact when LIMITLESSTUDIO fades ──
                tl.to(
                    leftDialWrapRef.current,
                    {
                        opacity: 0,
                        ease: 'power2.in',
                        duration: 0.3,
                    },
                    0  // delay fade so the roll animation is visible first
                )
                tl.to(
                    rightDialWrapRef.current,
                    {
                        opacity: 0,
                        ease: 'power2.in',
                        duration: 0.3,
                    },
                    0
                )
                // tl.to(
                //     contactRef.current,
                //     {
                //         opacity: 0,
                //         ease: 'power2.in',
                //         duration: 0.2,
                //     },
                //     0
                // )

                // (Old static play button animation removed in favor of custom hover cursor)
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <div
            ref={sectionRef}
            className="landing-section h-screen w-full relative"
        >
            {/* ── Layer 1: Global Background Image (360vh tall, overflowing) ── */}
            <div className="absolute top-0 left-0 w-full h-[360vh] -z-10 flex items-center justify-center">
                <img
                    src="/bg.webp"
                    alt=""
                    className="w-full h-[360vh] md:h-full object-cover md:object-[0px_4.2%] block scale-[1.07] blur-[5px] brightness-[0.92]"
                />
            </div>

            {/* ── Layer 2: Dark tint + noise (360vh tall, perfectly matching bg) ── */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '360vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.38)',
                    pointerEvents: 'none',
                    zIndex: -1,
                }}
            >
                <canvas
                    ref={noiseCanvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        opacity: 0.12,
                    }}
                />
            </div>

            {/* ── Layer 3: LIMITLESSTUDIO text — mix-blend-mode:difference
                 NO z-index, NO transform on this wrapper (both create stacking
                 contexts that trap the blend). Sits between tint (layer 2) and
                 content chrome (layer 4 / z:3). Blends against bg + tint. ── */}
            <div
                ref={heroTextRef}
                className="absolute w-full text-center pointer-events-none mix-blend-difference bottom-[5vh] md:bottom-[4vh] left-0"
            >
                <h1
                    className="font-bold leading-[0.9] tracking-[-0.02em] select-none m-0 whitespace-nowrap text-white text-[11vw] px-[4vw] md:text-[clamp(48px,10vw,180px)] md:px-[2vw]"
                    style={{
                        fontFamily: 'var(--font-metropolis), sans-serif',
                    }}
                >
                    LIMITLESSTUDIO
                </h1>
            </div>

            {/* ── Layer 4: UI chrome — NO zIndex so no isolated stacking context
                 is created. DOM order (last sibling) ensures it paints on top.
                 Without a stacking context, mix-blend-mode on children (dials etc.)
                 propagates to the root and blends against bg + tint correctly. ── */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center"
            >
                {/* ── CREATIVE AGENCY label (above box) ── */}
                <div
                    ref={creativeRef}
                    className="uppercase z-[5] mix-blend-difference font-extralight text-white/75 text-[10px] md:mb-[0px] mb-[20px] tracking-[2px] md:tracking-normal"
                    style={{
                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    }}
                >
                    CREATIVE AGENCY<span className="hidden md:inline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </div>

                {/* ═══════ CENTER BOX (masking window) ═══════
                    overflow is NOT on this div — it's on the inner masking container.
                    This allows CONTACT to be a child positioned outside the box
                    without being clipped, while still tracking the box edge. */}
                <div
                    ref={centerBoxRef}
                    className="hero-center-box relative rounded-[12px] will-change-[width,height,border-radius] w-[80vw] h-[65vh] md:h-[38vh] md:w-[32vw]"
                    style={{
                        cursor: isTouchDevice ? "pointer" : "none",
                    }}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    onClick={() => {
                        if (isExpanded) {
                            const video = videoRef.current
                            if (!video) return

                            if (video.paused) {
                                video.play()
                                setIsPlaying(true)
                                isPlayingRef.current = true
                            } else {
                                video.pause()
                                setIsPlaying(false)
                                isPlayingRef.current = false
                            }
                        }
                    }}
                >
                    {/* Video Showreel */}
                    <video
                        ref={videoRef}
                        src="/showreel.mp4"
                        loop
                        playsInline
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: isPlaying ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                            borderRadius: 'inherit',
                            pointerEvents: 'none', // let centerBox catch the clicks
                            zIndex: 4, // Above masking image, below corners
                        }}
                    />

                    <div
                        className="absolute inset-0 rounded-[inherit] overflow-hidden z-[2]"
                    >
                        <img
                            className='object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[200vw] h-[100vh] md:w-[130vw] md:h-[130vh]'
                            src="/bg1.png"
                            alt="Showreel preview"
                        />
                    </div>

                    {/* ── CONTACT label (tracks left edge of center box) ── */}
                    <div
                        ref={contactRef}
                        className="absolute top-1/2 -translate-y-1/2 -rotate-90 origin-center text-[10px] text-white/75 uppercase whitespace-nowrap z-[5] mix-blend-difference left-[-20px] md:left-[-30px]"
                        style={{
                            fontFamily: 'var(--font-ibm-plex-mono), monospace',
                            letterSpacing: '0em',
                        }}
                    >
                        CONTACT
                    </div>

                    {/* ── LEFT DIAL (tracks left edge of center box) ── */}
                    <div
                        ref={leftDialWrapRef}
                        className="absolute top-[-80%] bottom-[-80%] items-center z-[1] mix-blend-difference hidden md:flex w-[30px] left-[0px]"
                    >
                        <div
                            ref={leftDialRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '60px',
                                willChange: 'transform',
                            }}
                        >
                            {[...DIAL_NUMBERS, ...DIAL_NUMBERS].map((num, i) => (
                                <span
                                    key={`ld-${i}`}
                                    style={{
                                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                                        fontSize: '10px',
                                        letterSpacing: '0.15em',
                                        color: 'white',
                                        opacity: 0.25,
                                        mixBlendMode: 'difference',
                                        writingMode: 'vertical-lr',
                                        transform: 'rotate(180deg)',
                                        userSelect: 'none',
                                        lineHeight: 1,
                                    }}
                                >
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT DIAL (tracks right edge of center box) ── */}
                    <div
                        ref={rightDialWrapRef}
                        className="absolute top-[-80%] bottom-[-80%] items-center justify-end z-[1] mix-blend-difference hidden md:flex w-[30px] right-[0px]"
                    >
                        <div
                            ref={rightDialRef}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '60px',
                                willChange: 'transform',
                                alignItems: 'flex-end',
                            }}
                        >
                            {[...DIAL_NUMBERS, ...DIAL_NUMBERS].map((num, i) => (
                                <span
                                    key={`rd-${i}`}
                                    style={{
                                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                                        fontSize: '10px',
                                        letterSpacing: '0.15em',
                                        color: 'white',
                                        opacity: 0.25,
                                        mixBlendMode: 'difference',
                                        writingMode: 'vertical-lr',
                                        userSelect: 'none',
                                        lineHeight: 1,
                                    }}
                                >
                                    {num}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Corner brackets */}
                    <div
                        ref={cornersRef}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 10,
                            mixBlendMode: 'difference',
                        }}
                    >
                        {/* Top-left */}
                        <img
                            src="/Bracket.svg"
                            alt=""
                            style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                width: '28px',
                                height: '28px',
                                rotate: '-90deg'
                            }}
                        />
                        {/* Top-right */}
                        <img
                            src="/Bracket.svg"
                            alt=""
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '28px',
                                height: '28px',
                                transform: 'rotate(90deg)',
                                rotate: '-90deg'
                            }}
                        />
                        {/* Bottom-right */}
                        <img
                            src="/Bracket.svg"
                            alt=""
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                width: '28px',
                                height: '28px',
                                transform: 'rotate(180deg)',
                                rotate: '-90deg'
                            }}
                        />
                        {/* Bottom-left */}
                        <img
                            src="/Bracket.svg"
                            alt=""
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                left: '10px',
                                width: '28px',
                                height: '28px',
                                transform: 'rotate(270deg)',
                                rotate: '-90deg'
                            }}
                        />
                    </div>


                    {/* Custom Cursor — follows mouse, hidden on touch devices */}
                    {!isTouchDevice && (
                        <div
                            ref={cursorRef}
                            className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                            style={{
                                opacity: cursorVisible ? 1 : 0,
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
                                {/* Circle with icon */}
                                <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] rounded-full bg-transparent border border-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    {isPlaying ? (
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 22" fill="none">
                                            <rect x="2" y="1" width="5" height="20" rx="1.5" fill="white" />
                                            <rect x="13" y="1" width="5" height="20" rx="1.5" fill="white" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-5 sm:w-5 sm:h-6" viewBox="0 0 20 24" fill="none">
                                            <path d="M2 2L18 12L2 22V2Z" fill="white" />
                                        </svg>
                                    )}
                                </div>
                                {/* WATCH text */}
                                <span
                                    className="text-[8px] sm:text-[10px] font-medium tracking-[0.2em] uppercase text-white"
                                    style={{ fontFamily: "var(--font-metropolis), sans-serif" }}
                                >
                                    {isPlaying ? "PAUSE" : "WATCH"}
                                </span>
                            </div>
                        </div>
                    )}

                </div>

                {/* ── 20+ PROJECTS DELIVERED (below box) ── */}
                <div
                    ref={projectsRef}
                    className="uppercase z-[5] mix-blend-difference text-white/75 text-[10px] mt-[20px] md:mt-[0px] tracking-[1px] md:tracking-normal hidden md:block"
                    style={{
                        fontFamily: 'var(--font-ibm-plex-mono), monospace',
                        letterSpacing: '0em',
                    }}
                >
                    20+ PROJECTS DELIVERED
                </div>

                {/* ── Subtitle: "Where vision becomes experience" ── */}
                <div
                    className='absolute text-white font-extralight tracking-[0.05em] z-[5] mix-blend-difference bottom-[10vh] right-[5vw] text-[14px] md:bottom-[23vh] md:right-[10vw] md:text-[20px]'
                    ref={subtitleRef}
                    style={{
                        fontFamily: 'var(--font-poppins), sans-serif',
                    }}
                >
                    Where vision becomes experience
                </div>


            </div>

        </div>
    )
}

export default Hero
