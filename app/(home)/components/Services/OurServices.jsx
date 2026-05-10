'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const POPUP_IMAGES = [
  { src: "/f1.png", width: "15vw", height: "40vh", transform: "scale(0.85) translateY(120px)" },
  { src: "/f2.png", width: "20vw", height: "26vh", transform: "scale(0.85) translateY(120px)" },
  { src: "/f3.png", width: "16vw", height: "45vh", transform: "scale(0.85) translateY(120px)" },
  { src: "/f4.png", width: "18vw", height: "28vh", transform: "scale(0.85) translateY(120px)" },
];

const OurServices = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const loopInterval = useRef(null)
  const activeCardIdx = useRef(0)
  const [isHovering, setIsHovering] = useState(false)

  // Scroll-triggered entrance animation for text lines
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

  // Pop in a card — stacks on top of previous ones
  const popCard = useCallback((index) => {
    const cardsEl = cardsContainerRef.current;
    if (!cardsEl) return;

    const cards = cardsEl.querySelectorAll(".popup-card");
    if (!cards.length) return;

    const card = cards[index % cards.length];
    if (!card) return;

    // Random slight rotation for organic feel
    const randomRotation = (Math.random() - 0.5) * 12; // -6 to +6 degrees

    // Bring this card to top of stack
    card.style.zIndex = index + 1;

    // Animate from bottom up onto the pile, straight first, then tilt
    gsap.killTweensOf(card);
    
    const tl = gsap.timeline();

    tl.fromTo(
      card,
      {
        opacity: 0,
        scale: 0.85,
        y: 120,
        rotation: 0,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0, // Keep straight during pop
        duration: 0.5,
        ease: "elastic.out(1.1, 0.5)",
      }
    ).to(
      card,
      {
        rotation: randomRotation,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.2" // Slight overlap just as the bounce is finishing
    );
  }, []);

  // Start looping images on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    activeCardIdx.current = 0;

    const cardsEl = cardsContainerRef.current;
    if (!cardsEl) return;

    // Reset all cards hidden
    const cards = cardsEl.querySelectorAll(".popup-card");
    gsap.set(cards, { opacity: 0, scale: 0.85, y: 120, rotation: 0 });

    // Show the container
    gsap.to(cardsEl, {
      opacity: 1,
      duration: 0.1,
    });

    // Show first card immediately
    popCard(0);

    // Loop through cards — keep stacking infinitely
    loopInterval.current = setInterval(() => {
      activeCardIdx.current = activeCardIdx.current + 1;
      popCard(activeCardIdx.current);
    }, 500);
  }, [popCard]);

  // Stop loop on leave
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);

    if (loopInterval.current) {
      clearInterval(loopInterval.current);
      loopInterval.current = null;
    }

    const cardsEl = cardsContainerRef.current;
    if (!cardsEl) return;

    const cards = cardsEl.querySelectorAll(".popup-card");

    // Entire stack slides down and fades
    gsap.to(cards, {
      y: 80,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.02,
    });

    gsap.to(cardsEl, {
      opacity: 0,
      duration: 0.15,
      delay: 0.25,
    });
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (loopInterval.current) clearInterval(loopInterval.current);
    };
  }, []);

  return (
    <div ref={sectionRef} className='w-full h-screen text-black relative z-[999] flex items-center justify-center text-page-section'>
      
      {/* Popover Images Container */}
      <div
        ref={cardsContainerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-0 z-[1000]"
        style={{ willChange: "opacity" }}
      >
        {POPUP_IMAGES.map((item, cardIdx) => (
          <div
            key={cardIdx}
            className="popup-card absolute rounded-xl overflow-hidden shadow-2xl shadow-black/60"
            style={{
              width: item.width,
              height: item.height,
              willChange: "transform, opacity",
              opacity: 0,
              transform: item.transform,
            }}
          >
            <img
              src={item.src}
              alt={`Project ${cardIdx + 1}`}
              className="w-full h-full object-cover block"
              draggable="false"
            />
          </div>
        ))}
      </div>

      <div className='absolute w-full h-auto flex flex-col gap-2 items-center justify-center text-white'>
        <div className="overflow-hidden w-full flex justify-center">
          <p className='pop-text text-xs md:text-[1.8vh] font-ibm-plex-mono font-[300]  md:w-[58%] text-center'>CREATIVE STUDIO BUILDS PREMIUM DIGITAL EXPERIENCES.</p>
        </div>
        <div className="overflow-hidden w-full flex justify-center pt-2">
          <h1 className='pop-text text-3xl md:text-5xl font-metropolis font-[700] md:w-[58%] text-center leading-tight tracking-tight'>IT’S NEVER “JUST A WEBSITE.” </h1>
        </div>
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className='pop-text text-3xl md:text-5xl font-metropolis font-[700] md:w-[58%] text-center leading-tight tracking-tight'>EVERY <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='text-white font-metropolis font-[700] w-[58%] text-center leading-tight tracking-tight underline decoration-2 cursor-pointer relative z-10' style={{ textShadow: isHovering ? "0 0 40px rgba(255,255,255,0.2)" : "none", transition: "text-shadow 0.3s" }}>DETAIL</span> MATTERS.</h1>
        </div>
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className='pop-text text-3xl md:text-5xl font-metropolis font-[700] md:w-[58%] text-center leading-tight tracking-tight'>WE CRAFT DIGITAL EXPERIENCES.</h1>
        </div>
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className='pop-text text-3xl md:text-5xl font-metropolis font-[700] md:w-[58%] text-center leading-tight tracking-tight'>YOUR DESIGN. OUR OBSESSION.</h1>
        </div>
        <div className="overflow-hidden w-full flex justify-center">
          <h1 className='pop-text text-3xl md:text-5xl font-metropolis font-[700] md:w-[58%] text-center leading-tight tracking-tight'>YOUR BRAND. OUR <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='text-white font-metropolis font-[700] w-[58%] text-center leading-tight tracking-tight underline decoration-2 mix-blend-difference cursor-pointer relative z-10' style={{ textShadow: isHovering ? "0 0 40px rgba(255,255,255,0.2)" : "none", transition: "text-shadow 0.3s" }}>PLAYGROUND</span>.</h1>
        </div>
      </div>
    </div>
  )
}

export default OurServices