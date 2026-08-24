"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface SlideData {
  id: number;
  image: string;
  heading: string;
  subtext: string;
  buttonText: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    image: "/assets/hero-1.png",
    heading: "EFFORTLESS\nVACATION STYLE",
    subtext: "Shop the Latest Fashion Must-Haves",
    buttonText: "SHOP NOW",
  },
  {
    id: 2,
    image: "/assets/hero-2.png",
    heading: "SUMMER\nCOLLECTION",
    subtext: "Discover Light & Breezy Fabrics",
    buttonText: "EXPLORE",
  },
  {
    id: 3,
    image:
      "/assets/hero-3.png",
    heading: "EVENING\nELEGANCE",
    subtext: "Stand Out in Every Occasion",
    buttonText: "DISCOVER",
  },
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  /* ---------- Preload All Images ---------- */

  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  /* ---------- Auto Slide With Preload ---------- */

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;

      const img = new Image();
      img.src = slides[nextIndex].image;

      img.onload = () => {
        setPrevIndex(currentIndex);
        setCurrentIndex(nextIndex);
      };
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleDotClick = (index: number) => {
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  /* ---------- Slide Animations ---------- */

  const getSlideVariants = (index: number): Variants => {
    if (index === 0) {
      return {
        initial: { y: "-100%" },
        animate: { y: "0%", transition: { duration: 1.2, ease: "easeOut" } },
        exit: { opacity: 0 },
      };
    }

    if (index === 1) {
      return {
        initial: { x: "-100%" },
        animate: { x: "0%", transition: { duration: 1.2, ease: "easeOut" } },
        exit: { opacity: 0 },
      };
    }

    return {
      initial: { y: "-100%" },
      animate: { y: "0%", transition: { duration: 1.2, ease: "easeOut" } },
      exit: { opacity: 0 },
    };
  };

  /* ---------- Text Animation ---------- */

  const textContainerVariants: Variants = {
    initial: { opacity: 0, x: 200 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.4 },
    },
  };

  const headingVariants: Variants = {
    initial: { opacity: 0, y: -30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3 },
    },
  };

  const subtextVariants: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.5 },
    },
  };

  const buttonVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay: 0.7 },
    },
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Previous slide stays visible */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${slides[prevIndex].image})`,
        }}
      />
      {/* Current slide animation */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          variants={getSlideVariants(currentIndex)}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${currentSlide.image})`,
            }}
          />
        </motion.div>
      </AnimatePresence>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-[1]" />
      {/* Top black shadow */}
      <div className="absolute top-0 left-0 w-full h-[78px] bg-gradient-to-b from-black/80 to-transparent z-[1]" />{" "}
      {/* Content */}
      <div className="relative z-[2] min-h-screen max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={textContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl"
          >
            <motion.h1
              variants={headingVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-5 whitespace-pre-line"
            >
              {currentSlide.heading}
            </motion.h1>

            <motion.p
              variants={subtextVariants}
              className="text-base md:text-lg text-white/90 mb-8 font-light tracking-wide"
            >
              {currentSlide.subtext}
            </motion.p>

            <motion.div variants={buttonVariants}>
              <button className="px-8 py-3 border border-white text-white text-sm tracking-widest uppercase transition-colors duration-300 hover:bg-white hover:text-gray-900 cursor-pointer">
                {currentSlide.buttonText}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Pagination */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className="relative flex items-center justify-center w-4 h-4 cursor-pointer"
          >
            {currentIndex === index && (
              <span className="absolute inset-0 rounded-full border border-white" />
            )}

            <span
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-1.5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}