import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface CallToActionWithButtonProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColorClass?: string;
  textColorClass?: string;
  buttonVariant?: 'outline' | 'default';
}

const CallToActionWithButton: React.FC<CallToActionWithButtonProps> = ({
  title = "Prêt à créer un événement inoubliable ?",
  description = "Contactez-nous dès aujourd'hui pour discuter de votre projet et commencer à créer des souvenirs exceptionnels.",
  buttonText = "Demander un devis gratuit",
  buttonLink = "/contact",
  bgColorClass = "bg-dark-gk",
  textColorClass = "text-white",
  buttonVariant = 'outline',
}) => {
  return (
    <section className={`py-16 ${bgColorClass} ${textColorClass}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold">{title}</h2>
        <p className="text-lg max-w-2xl mx-auto">{description}</p>

        <Button asChild variant={buttonVariant} className="mt-6">
          <Link href={buttonLink} className="inline-flex items-center button-orange">
            {buttonText} <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CallToActionWithButton;
