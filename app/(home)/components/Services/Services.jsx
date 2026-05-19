'use client'
import React, { useState, useEffect, useRef } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const servicesList = [
  "BRANDING",
  "WEB DEVELOPMENT",
  "APP DEVELOPMENT",
  "AI AUTOMATION",
  "GRAPHIC DESIGNING",
  "UI/UX DESIGN",
  "VIDEO EDITING"
];

const serviceImages = {
  "BRANDING": "/m1.png",
  "WEB DEVELOPMENT": "/m2.png",
  "APP DEVELOPMENT": "/m3.png",
  "AI AUTOMATION": "/m4.png",
  "GRAPHIC DESIGNING": "/m5.png",
  "UI/UX DESIGN": "/m6.png",
  "VIDEO EDITING": "/m7.png"
};

const ScrambleText = ({ text }) => {
    const [displayText, setDisplayText] = React.useState(text);
    const formattedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

    React.useEffect(() => {
        let iteration = 0;
        let animationFrame;
        const chars = '!<>-_\\\\/[]{}—=+*^?#________';

        const tick = () => {
            setDisplayText(prev => {
                return formattedText.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration) {
                        return formattedText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
            });
            
            iteration += 1 / 3; 

            if (iteration < formattedText.length) {
                animationFrame = requestAnimationFrame(tick);
            } else {
                setDisplayText(formattedText);
            }
        };

        animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, [formattedText]);

    return <span>[ {displayText} ]</span>;
}

const GlitchImage = ({ src }) => {
    const imgRef = React.useRef(null);
    const noiseRef = React.useRef(null);
    const [currentSrc, setCurrentSrc] = React.useState(src);

    React.useEffect(() => {
        if (src !== currentSrc) {
            const tl = gsap.timeline();

            // Flash noise overlay and distort image heavily
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
                  onComplete: () => setCurrentSrc(src) // swap src precisely mid-glitch
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
                alt="Service showcase"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* SVG Noise pattern overlay */}
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

const Services = () => {
    const sectionRef = useRef(null);
    const [activeService, setActiveService] = useState("WEB DEVELOPMENT");
    const activeIndex = servicesList.indexOf(activeService) + 1;
    const formattedIndex = activeIndex < 10 ? `0${activeIndex}` : activeIndex;

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

    return (
        <div ref={sectionRef} className='min-h-screen w-full bg-[#000000] text-white p-[8vw] md:p-30 relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-5 font-sans overflow-hidden workwedo-section'>
            
            {/* Left Column */}
            <div className='h-auto md:h-[70vh] w-full md:w-[28%] flex flex-col items-start justify-start gap-3 mt-[10vh] md:mt-0'>
                <div className='flex flex-col'>
                    <div className="overflow-hidden pb-1">
                        <h2 className='pop-text inline-block text-3xl md:text-4xl font-metropolis font-[500] tracking-tight'>Our Services</h2>
                    </div>
                    <div className="overflow-hidden pb-1">
                        <h3 className='pop-text inline-block text-xl md:text-2xl font-metropolis font-[500] text-white/60 mt-2'>What we do?</h3>
                    </div>
                </div>
                <div className="overflow-hidden pt-2">
                    <p className='pop-text inline-block text-[10px] md:text-xs text-white/40 font-ibm-plex-mono leading-relaxed w-full'>
                        LimitlesStudio is a boundary-pushing creative powerhouse where digital craftsmanship meets radical innovation. We don't just build platforms; we architect immersive experiences that redefine the intersection of art and technology. Our mission is to elevate disruptive brands through high-fidelity design and state-of-the-art engineering, transforming complex visions into seamless, limitless realities that resonate in a digital-first world.
                    </p>
                </div>
            </div>

            {/* Center Column - Image Container */}
            <div className='w-full md:w-[35%] h-[50vh] md:h-[80vh] relative flex flex-col justify-center my-10 md:my-0'>
                {/* Top Labels */}
                <div className='flex justify-between items-center w-full text-[10px] md:text-xs font-ibm-plex-mono text-gray-400 mb-4 tracking-widest uppercase'>
                    <ScrambleText text={String(formattedIndex)} />
                    <ScrambleText text={activeService} />
                </div>
                
                {/* Image Box */}
                <div className="overflow-hidden w-full h-full relative rounded-2xl pb-2">
                    <div className='pop-text w-full h-full relative rounded-2xl overflow-hidden group border border-white/5'>
                        {/* Corner Accents using Bracket.svg */}
                        <img src="/Bracket.svg" className='absolute top-4 left-4 w-6 h-6 z-10 opacity-70 rotate-270' alt="bracket" />
                        <img src="/Bracket.svg" className='absolute top-4 right-4 w-6 h-6 z-10 opacity-70 rotate-0' alt="bracket" />
                        <img src="/Bracket.svg" className='absolute bottom-4 right-4 w-6 h-6 z-10 opacity-70 rotate-90' alt="bracket" />
                        <img src="/Bracket.svg" className='absolute bottom-4 left-4 w-6 h-6 z-10 opacity-70 -rotate-180' alt="bracket" />
                        
                        {/* Actual Image */}
                        <GlitchImage src={serviceImages[activeService]} />
                        
                        {/* Vignette Overlay to darken edges like the design */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className='w-full md:w-[28%] flex flex-col justify-between h-auto md:h-[80vh] min-h-[50vh] md:min-h-0 relative mb-[10vh] md:mb-0'>
                
                {/* Top Right Mini Card */}
                {/* <div className='flex items-center gap-4 p-3 w-fit md:ml-auto self-start md:self-end relative md:absolute md:top-0 md:left-0 overflow-hidden mb-8 md:mb-0'>
                    <div className="pop-text flex items-center gap-4">
                        <img src="/bg1.png" alt="Team Cyphers" className='w-10 h-10 rounded-lg object-cover' />
                        <div className='pr-4'>
                            <h4 className='text-sm font-semibold text-white'>Team Cyphers</h4>
                            <p className='text-[10px] text-gray-400 font-ibm-plex-mono mt-0.5'>2024, Hack-A-Thon</p>
                        </div>
                    </div>
                </div> */}

                {/* Vertical Services Menu */}
                <div className='flex flex-col gap-2 font-metropolis uppercase font-bold text-lg md:text-[1.7rem] xl:text-3xl tracking-tight mt-auto'>
                    {servicesList.map((service, index) => (
                        <div key={index} className="overflow-hidden py-1">
                            <div 
                                onMouseEnter={() => setActiveService(service)}
                                className={`pop-text inline-block cursor-pointer transition-all duration-300 ease-out 
                                    ${activeService === service 
                                        ? 'text-white translate-x-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                        : 'text-white/30 hover:text-white'
                                    }`}
                            >
                                {service}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Services