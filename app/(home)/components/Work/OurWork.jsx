'use client'
import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
    { title: "Project Alpha", image: "/w1.png", description: "Pioneering the future of digital interaction through an intricate blend of sleek UI and aggressive brutalism." },
    { title: "Project Beta", image: "/w2.png", description: "A bold experiment in grid-breaking layouts, focusing on high-contrast colors and kinetic typography." },
    { title: "LimitlesStudio", image: "/bg.png", description: "Our flagship showcase, pushing the boundaries of WebGL and raw GSAP animations in the browser." },
    { title: "Project Delta", image: "/w4.png", description: "A dark-themed architectural portfolio designed to feel like exploring an endless, brutalist megastructure." },
    { title: "Project Echo", image: "/w5.png", description: "An e-commerce experience redefined. Distorted aesthetics meet seamless transactional workflows." },
    { title: "Project Alpha", image: "/w1.png", description: "Pioneering the future of digital interaction through an intricate blend of sleek UI and aggressive brutalism." },
    { title: "Project Beta", image: "/w2.png", description: "A bold experiment in grid-breaking layouts, focusing on high-contrast colors and kinetic typography." },
    { title: "LimitlesStudio", image: "/bg.png", description: "Our flagship showcase, pushing the boundaries of WebGL and raw GSAP animations in the browser." },
    { title: "Project Delta", image: "/w4.png", description: "A dark-themed architectural portfolio designed to feel like exploring an endless, brutalist megastructure." },
    { title: "Project Echo", image: "/w5.png", description: "An e-commerce experience redefined. Distorted aesthetics meet seamless transactional workflows." }
];

const ScrambleText = ({ text, speed = 1/3 }) => {
    const [displayText, setDisplayText] = React.useState(text);

    React.useEffect(() => {
        let iteration = 0;
        let animationFrame;
        const chars = '!<>-_\\\\/[]{}—=+*^?#________';

        const tick = () => {
            setDisplayText(prev => {
                return text.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
            });
            
            iteration += speed; 

            if (iteration < text.length) {
                animationFrame = requestAnimationFrame(tick);
            } else {
                setDisplayText(text);
            }
        };

        animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, [text, speed]);

    return <span>{displayText}</span>;
}

const GlitchImage = ({ src }) => {
    const imgRef = React.useRef(null);
    const noiseRef = React.useRef(null);
    const [currentSrc, setCurrentSrc] = React.useState(src);

    React.useEffect(() => {
        if (src !== currentSrc) {
            const tl = gsap.timeline();

            tl.set(noiseRef.current, { opacity: 1 })
              .to(imgRef.current, {
                  filter: "contrast(250%) brightness(200%) saturate(0%) invert(100%)",
                  scale: 1.15,
                  x: () => (Math.random() - 0.5) * 30,
                  y: () => (Math.random() - 0.5) * 30,
                  skewX: () => (Math.random() - 0.5) * 15,
                  duration: 0.05,
                  ease: "none"
              })
              .to(imgRef.current, {
                  filter: "contrast(150%) brightness(150%) hue-rotate(90deg)",
                  x: () => (Math.random() - 0.5) * 30,
                  y: () => (Math.random() - 0.5) * 30,
                  skewX: () => (Math.random() - 0.5) * -15,
                  duration: 0.05,
                  ease: "none",
                  onComplete: () => setCurrentSrc(src)
              })
              .to(imgRef.current, {
                  filter: "contrast(100%) brightness(100%) hue-rotate(0deg) saturate(100%) invert(0%)",
                  scale: 1,
                  x: 0,
                  y: 0,
                  skewX: 0,
                  duration: 0.1,
                  ease: "power2.out"
              })
              .set(noiseRef.current, { opacity: 0 }, "-=0.1");
        }
    }, [src, currentSrc]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#0a0a0a]">
            <img 
                ref={imgRef}
                src={currentSrc} 
                alt="Showcase"
                className="w-full h-full object-cover"
            />
            <div 
                ref={noiseRef}
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px'
                }}
            ></div>
        </div>
    );
};

const OurWork = () => {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(2);
    const dialContainerRef = useRef(null);
    const wheelAccumulator = useRef(0);
    const lastWheelTime = useRef(Date.now());
    const [isMobile, setIsMobile] = useState(false);

    let projIndex = activeIndex % projects.length;
    if (projIndex < 0) projIndex += projects.length;

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize(); // set initial
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.pop-text', 
                { 
                    y: '120%', 
                    filter: 'blur(15px)',
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                    y: '0%',
                    filter: 'blur(0px)',
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                    stagger: 0.12,
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    useEffect(() => {
        const el = dialContainerRef.current;
        if (!el) return;

        const handleWheel = (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            
            const now = Date.now();
            if (now - lastWheelTime.current > 150) {
                wheelAccumulator.current = 0;
            }
            lastWheelTime.current = now;

            wheelAccumulator.current += e.deltaY;

            if (wheelAccumulator.current > 70) {
                setActiveIndex(prev => prev + 1);
                wheelAccumulator.current = 0; 
            } else if (wheelAccumulator.current < -70) {
                setActiveIndex(prev => prev - 1);
                wheelAccumulator.current = 0;
            }
        };

        el.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div ref={sectionRef} className='w-full h-[120vh] bg-[#000000] text-white relative z-[999] flex flex-col md:flex-row items-center justify-between px-[5vw] md:px-32 py-5 font-sans work-section'>
            <div className='w-full h-[100vh] md:h-[85vh] relative'>
                
            {/* Top Left Title */}
            <div className='absolute top-0 left-0 z-20 flex flex-col'>
                <div className="overflow-hidden pb-1">
                    <h2 className='pop-text inline-block text-4xl font-metropolis font-[400] tracking-tight'>Our Work</h2>
                </div>
                <div className="overflow-hidden pb-1">
                    <h3 className='pop-text inline-block text-2xl font-metropolis font-[400] text-white/40 mt-1'>LimitlesStudio</h3>
                </div>
            </div>

            {/* Center Area */}
            <div className='flex-1 flex flex-col items-start justify-start md:justify-end relative w-full h-full mt-[15vh] md:mt-0 pr-0 md:pr-[10%]'>
                
                {/* Main Image Container */}
                <div className='relative w-full md:w-[75%] h-[40vh] md:h-[60vh] flex items-center justify-center mt-4 md:mt-0'>
                    {/* Corner Accents using Bracket.svg */}
                    <img src="/Bracket.svg" className='absolute top-0 left-0 w-8 h-8 z-10 opacity-60 -rotate-90 translate-x-3 translate-y-3' alt="bracket" />
                    <img src="/Bracket.svg" className='absolute top-0 right-0 w-8 h-8 z-10 opacity-60 rotate-0 -translate-x-3 translate-y-3' alt="bracket" />
                    <img src="/Bracket.svg" className='absolute bottom-0 right-0 w-8 h-8 z-10 opacity-60 rotate-90 -translate-x-3 -translate-y-3' alt="bracket" />
                    <img src="/Bracket.svg" className='absolute bottom-0 left-0 w-8 h-8 z-10 opacity-60 -rotate-180 translate-x-3 -translate-y-3' alt="bracket" />
                    
                    <div className="overflow-hidden w-full h-full rounded-2xl p-2">
                        <div className='pop-text w-full h-full rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]'>
                            <GlitchImage src={projects[projIndex].image} />
                        </div>
                    </div>
                </div>

                {/* Bottom Paragraph */}
                <div className='w-full md:w-[75%] flex justify-end md:justify-end mt-4 md:mt-5'>
                    <div className="overflow-hidden w-[90%] md:w-[65%] flex justify-end min-h-[60px] pr-2 md:pr-0">
                        <p className='pop-text inline-block text-[10px] md:text-xs text-white/50 font-ibm-plex-mono text-right w-full leading-relaxed'>
                            <ScrambleText key={activeIndex} text={projects[projIndex].description} speed={2.5} />
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side Thumbnails Dial Wrapper */}
            <div 
                ref={dialContainerRef}
                className='absolute left-0 bottom-0 w-full h-[25vh] md:left-auto md:bottom-auto md:right-8 md:top-0 md:h-full md:w-[30%] z-20 flex flex-col md:flex-row items-center justify-center md:justify-end overflow-hidden scale-75 md:scale-100 origin-bottom md:origin-right'
            >
                {/* Target Area (Fixed Center) */}
                <div className='absolute bottom-[30px] left-1/2 -translate-x-1/2 md:left-auto md:bottom-auto md:right-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 flex flex-col md:flex-row items-center gap-2 md:gap-4 z-30 pointer-events-none'>
                    <span className='text-[11px] font-ibm-plex-mono tracking-widest text-white/80 whitespace-nowrap drop-shadow-md order-2 md:order-1 mt-2 md:mt-0'>
                        <ScrambleText key={activeIndex} text={projects[projIndex].title} />
                    </span>
                    <div className='p-[4px] rounded-xl border border-dashed border-white/40 scale-100 order-1 md:order-2'>
                        <div className='w-[190px] h-[120px] rounded-lg' />
                    </div>
                </div>

                {/* Scrolling List - Infinite Virtual Dial */}
                <div className="relative w-full h-full flex items-center justify-center md:justify-end">
                    {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(offset => {
                        const globalIndex = activeIndex + offset;
                        let itemProjIndex = globalIndex % projects.length;
                        if (itemProjIndex < 0) itemProjIndex += projects.length;
                        
                        const project = projects[itemProjIndex];
                        const isActive = offset === 0;

                        return (
                            <div 
                                key={globalIndex} 
                                className='absolute group cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] flex items-center justify-center md:justify-end'
                                onClick={() => setActiveIndex(globalIndex)}
                                style={{ 
                                    opacity: Math.abs(offset) > 3 ? 0 : 1,
                                    pointerEvents: Math.abs(offset) > 3 ? 'none' : 'auto',
                                    top: isMobile ? 'auto' : '50%',
                                    bottom: isMobile ? '56px' : 'auto',
                                    left: isMobile ? '50%' : 'auto',
                                    right: isMobile ? 'auto' : '0px',
                                    transform: isMobile 
                                        ? `translateX(calc(-50% + ${offset * 200}px))` 
                                        : `translateY(calc(-50% + ${offset * 142}px))`
                                }}
                            >
                                <div className={`p-[4px] rounded-xl transition-all duration-300 ease-out border border-transparent ${isActive ? 'opacity-100' : 'opacity-30 hover:opacity-60 scale-95'}`}>
                                    <div className='relative w-[190px] h-[120px] rounded-lg overflow-hidden'>
                                        <img src={project.image} alt={project.title} className='w-full h-full object-cover' />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            </div>
        </div>
    )
}

export default OurWork