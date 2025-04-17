
import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  return (

  <footer className="bg-[#EA7A0B] text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Colonne 1 - Présentation */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Guil'O Services</h3>
          <p className="max-w-xs">
            Des prestations sur mesure pour vos évènements, avec une attention particulière aux détails et à vos envies.
          </p>
        </div>

        {/* Colonne 2 - Liens rapides */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Liens rapides</h4>
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="hover:underline">Accueil</Link>
            <Link href="/services" className="hover:underline">Services</Link>
            <Link href="/galerie" className="hover:underline">Galerie</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </nav>
        </div>

        {/* Colonne 3 - Contact */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Contact</h4>
          <div className="space-y-2">
            <p>Téléphone: 01 23 45 67 89</p>
            <p>Email: contact@guiloservices.fr</p>
            <p>Adresse: 123 Avenue des Services, 75000 Paris</p>
          </div>
        </div>
      </div>

      {/* Ligne et mentions */}
      <div className="mt-10 pt-6 border-t border-white/30 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Guil'O Services. Tous droits réservés.</p>
      </div>
    </div>
  </footer>

  );
};

export default Footer;
