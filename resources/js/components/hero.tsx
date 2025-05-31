import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, usePage } from "@inertiajs/react";

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

  return (
    <div className="relative
    mt-24 md:mt-13
    min-h-[90vh]">
      {heroSlides.map((slide, index) => (
        <div key={index} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            {slide.image && (
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center animate-scale-in"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          </div>

          {/* Contenu */}
          <div className="container relative z-10 text-center px-4 py-20 animate-fade-in">
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
                      "bg-[#EA7A0B] hover:opacity-90  dark:bg-[#EA7A0B] dark:hover:opacity-60"
                    )}
                  >
                    <Link href={btn.href}>{btn.text}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
