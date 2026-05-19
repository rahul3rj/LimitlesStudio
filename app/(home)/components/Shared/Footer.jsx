'use client'
import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HoverLink = ({ href, children }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [scrambledText, setScrambledText] = useState(children);

    useEffect(() => {
        if (!isHovered) {
            setScrambledText(children);
            return;
        }

        let iteration = 0;
        let animationFrame;
        const chars = '!<>-_\\\\/[]{}—=+*^?#________';

        const tick = () => {
            setScrambledText(prev => {
                return children.split('').map((char, index) => {
                    if (char === ' ') return ' ';
                    if (index < iteration) {
                        return children[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join('');
            });

            iteration += 1 / 3;

            if (iteration < children.length) {
                animationFrame = requestAnimationFrame(tick);
            } else {
                setScrambledText(children);
            }
        };

        animationFrame = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(animationFrame);
    }, [isHovered, children]);

    return (
        <a
            href={href}
            className='hover:text-white transition-colors block w-fit'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered ? `[ ${scrambledText} ]` : children}
        </a>
    )
}

const Footer = () => {
    const noiseCanvasRef = useRef(null)
    const sectionRef = useRef(null)

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
                    duration: 1.0,
                    ease: 'power2.out',
                    stagger: 0.10,
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [])

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

    return (
        <div ref={sectionRef} className='min-h-screen w-full relative footer-section flex flex-col justify-end text-white px-10 xl:px-14 2xl:px-16 pb-10 xl:pb-12 bg-black overflow-hidden'>
            <div className='absolute inset-0 z-0 pointer-events-none'>
                <img
                    src="/bg3.png"
                    alt=""
                    className='w-full h-full object-cover object-top mix-blend-screen scale-105'
                    style={{
                        filter: 'blur(5px) brightness(0.92)'
                    }}
                />
            </div>

            {/* Dark tint + noise layer */}
            <div
                className='absolute inset-0 z-0 pointer-events-none'
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.38)' }}
            >
                <canvas
                    ref={noiseCanvasRef}
                    className='absolute inset-0 w-full h-full pointer-events-none opacity-[0.12]'
                />
            </div>
            {/* Middle Section (Menus and Info) */}
            <div className='flex flex-col md:flex-row justify-end w-full flex-grow pt-[25vh] lg:pt-[35vh] z-10 gap-10'>

                <div className='flex gap-20 lg:gap-32 w-[10vw]'>
                    {/* Column 1: Links */}
                    <div className='flex flex-col gap-1 text-sm font-ibm-plex-mono tracking-[0.1em] text-white/70'>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Home</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Work</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Services</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Studio</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Plans</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Approach</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">News</HoverLink></div></div>
                    </div>


                </div>
                <div className='flex gap-20 lg:gap-32 w-[10vw]'>
                    {/* Column 2: Socials & Legal */}
                    <div className='flex flex-col gap-1 text-sm font-ibm-plex-mono tracking-[0.1em] text-white/70'>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Dribble</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Instagram</HoverLink></div></div>
                        <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">LinkedIn</HoverLink></div></div>
                        {/* <div className="overflow-hidden pb-1"><div className="pop-text inline-block"><HoverLink href="#">Legal</HoverLink></div></div> */}
                    </div>

                </div>

                {/* Column 3: Description */}
                <div className='flex flex-col gap-5 text-sm font-ibm-plex-mono text-white/70 tracking-wide mt-12 md:mt-0 md:w-[30vw]'>
                    <div className="overflow-hidden pb-1"><p className="pop-text inline-block">We are a creative studio based in India.</p></div>
                    <div className="overflow-hidden pb-1"><p className="pop-text inline-block">Work with us if average isn't your thing. Drop it, we'll build it!</p></div>
                    <div className="overflow-hidden pt-1 pb-1">
                        <a href="https://cal.com/limitlesstudio-xbgeew/client-talk" className='pop-text inline-flex items-center gap-1.5 italic text-white hover:opacity-70 transition-opacity w-fit mt-2'>
                            Let's Talk
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className='w-full flex flex-col mt-20'>
                {/* Scroll Indicator */}
                <div className='flex items-center gap-1 text-[9px] xl:text-[10px] tracking-[0.1em] font-ibm-plex-mono text-white/70 mb-2 uppercase'>
                    SCROLL
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </div>

                {/* Massive Text */}
                <div className='w-full text-center md:text-left overflow-hidden pb-2'>
                    <h1 className='pop-text inline-block text-[10vw] md:text-[11.8vw] leading-[1.0] font-metropolis font-bold tracking-tighter text-[#eefbfb] mb-5 mix-blend-difference'>
                        LIMITLESSTUDIO
                    </h1>
                </div>

                {/* Footer Bottom Row */}
                <div className='flex flex-col md:flex-row items-center justify-between w-full relative pt-2'>

                    {/* Empty left spacer */}
                    <div className='hidden md:block flex-1'></div>

                    {/* Center Copyright */}
                    <p className='text-[9px] xl:text-[10px] font-ibm-plex-mono text-white/50 tracking-[0.1em] flex-1 text-center md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2'>
                        © 2026 Limitless Studio. All Rights Reserved.
                    </p>

                    {/* Social Icons (Horizontal) */}
                    <div className='flex items-center gap-5 text-white flex-1 justify-end mt-4 md:mt-0'>
                        {/* Dribbble */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <circle cx="12" cy="12" r="10" fill="currentColor" />
                                <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                            </svg>
                        </a>

                        {/* Instagram */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="currentColor" />
                                <circle cx="12" cy="12" r="4.5" fill="none" stroke="black" strokeWidth="1.8" />
                                <circle cx="17.5" cy="6.5" r="1.2" fill="black" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a href="#" className="hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer