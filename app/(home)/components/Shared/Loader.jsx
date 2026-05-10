'use client'
import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

const Loader = ({ onComplete }) => {
    const containerRef = useRef(null);
    const centerBoxRef = useRef(null);
    const leftLineRef = useRef(null);
    const rightLineRef = useRef(null);
    const numberRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';

        const tl = gsap.timeline({
            onComplete: () => {
                // Unlock scrolling
                document.body.style.overflow = '';
                if (onComplete) onComplete();
            }
        });

        // 1. Initial fade in of the center box
        gsap.set(centerBoxRef.current, { opacity: 0, scale: 0.9 });
        gsap.set([leftLineRef.current, rightLineRef.current], { width: '0%' });

        tl.to(centerBoxRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out"
        }, 0);

        // 2. Count up to 100%
        tl.to({ val: 0 }, {
            val: 100,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: function() {
                setProgress(Math.round(this.targets()[0].val));
            }
        }, 0);

        // 3. Expand the lines, pushing the text outwards
        tl.to([leftLineRef.current, rightLineRef.current], {
            width: '100%',
            duration: 2.5,
            ease: "power3.inOut"
        }, 0.5);

        // 4. Awwwards level exit sequence
        // Scale up the percentage text massively and fade out
        tl.to(numberRef.current, {
            scale: 20,
            opacity: 0,
            filter: "blur(20px)",
            duration: 1.2,
            ease: "power4.in"
        }, 3.2);

        // Fade out the surrounding elements (lines, text, brackets)
        tl.to([leftLineRef.current, rightLineRef.current, centerBoxRef.current], {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        }, 3.2);

        // Sweep the black container UP to reveal the site
        tl.to(containerRef.current, {
            yPercent: -100,
            duration: 1.2,
            ease: "power4.inOut",
            borderBottomLeftRadius: "100%",
            borderBottomRightRadius: "100%",
        }, 3.5);

        return () => {
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 z-[99999] bg-[#050505] flex items-center justify-center font-ibm-plex-mono text-white overflow-hidden"
            style={{ willChange: 'transform, border-radius' }}
        >
            <div className="flex items-center justify-center w-full max-w-[90vw] md:max-w-[70vw] relative z-10">
                
                {/* Left Side */}
                <div className="flex items-center flex-1 justify-end">
                    <span className="text-xs md:text-sm tracking-widest text-white/80 mr-4 md:mr-6 uppercase">Limitless</span>
                    <div ref={leftLineRef} className="relative h-[1px] bg-white/20 flex-shrink-0" style={{ width: '0%' }}>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[8px] bg-white/60"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white/60"></div>
                    </div>
                </div>

                {/* Center Box */}
                <div ref={centerBoxRef} className="relative flex items-center justify-center mx-4 md:mx-8 w-[160px] md:w-[220px] h-[100px] md:h-[140px] flex-shrink-0">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/40 rounded-tl-[2px]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/40 rounded-tr-[2px]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/40 rounded-bl-[2px]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/40 rounded-br-[2px]"></div>
                    
                    <h1 ref={numberRef} className="font-metropolis text-5xl md:text-7xl font-bold tracking-tighter text-white" style={{ willChange: 'transform, opacity, filter' }}>
                        {progress}%
                    </h1>
                </div>

                {/* Right Side */}
                <div className="flex items-center flex-1 justify-start">
                    <div ref={rightLineRef} className="relative h-[1px] bg-white/20 flex-shrink-0" style={{ width: '0%' }}>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white/60"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[8px] bg-white/60"></div>
                    </div>
                    <span className="text-xs md:text-sm tracking-widest text-white/80 ml-4 md:ml-6 uppercase">Studio</span>
                </div>

            </div>
        </div>
    )
}

export default Loader
