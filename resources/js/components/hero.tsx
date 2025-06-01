import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselPrevious,
//   CarouselNext,
} from "@/components/ui/carousel";

interface HeroSlideButton {
  text: string;
  href: string;
}

interface HeroSlide {
  title: string;
  description: string;
  image?: string;
  buttons: HeroSlideButton[];
}

interface PageProps {
  heroSlides: HeroSlide[];
  [key: string]: unknown;
}

const Hero = () => {
  const { heroSlides } = usePage<PageProps>().props;
  const [currentIndex, setCurrentIndex] = useState(0);
  const delay = 5000; // 5 secondes

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
    }, delay);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <div className="relative mt-24 md:mt-13 min-h-[90vh]">
      <Carousel className="w-full" opts={{ loop: true }}>
        {/* <CarouselContent
          style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: "transform 0.8s ease-in-out" }}
          className="flex"
        > */}

<CarouselContent
  style={{
    transform: `translateX(-${currentIndex * 100}%)`,
    transition: "transform 1.2s ease-in-out", // ici 1.2s au lieu de 0.8s
  }}
  className="flex"
>


          {heroSlides.map((slide, index) => (
          <CarouselItem
          key={index}
          className="min-w-full relative min-h-[90vh] flex items-center justify-center overflow-hidden transition-all duration-1000"
        >

              {/* Image de fond */}
              <div className="absolute inset-0 z-0">
                {slide.image && (
                  <img
                    src={slide.image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
              </div>

              {/* Contenu */}
              <div className="container relative z-10 text-center px-4 py-20">
                <div className="max-w-3xl mx-auto">
                  <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 leading-tight font-playfair">
                    {slide.title}
                  </h1>
                  <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    {slide.description}
                  </p>

                  <div className="flex justify-center gap-4 flex-wrap">
                    {slide.buttons.map((btn, idx) => (
                      <Button
                        key={idx}
                        asChild
                        size="lg"
                        className={cn(
                          "rounded-full px-8 py-6 text-white font-medium",
                          "bg-[#EA7A0B] hover:opacity-90 dark:bg-[#EA7A0B] dark:hover:opacity-60"
                        )}
                      >
                        <Link href={btn.href}>{btn.text}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>


      </Carousel>
    </div>
  );
};

export default Hero;
