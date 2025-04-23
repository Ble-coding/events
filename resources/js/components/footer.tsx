// components/footer.tsx

import React from 'react';

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

const Footer = ({ contact }: { contact: ContactInfo | null }) => {
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
              <a href="/" className="hover:underline">Accueil</a>
              <a href="/services" className="hover:underline">Services</a>
              <a href="/galerie" className="hover:underline">Galerie</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </nav>
          </div>

          {/* Colonne 3 - Contact dynamique */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-2">
              <p>Téléphone: {contact?.phone ?? 'Non disponible'}</p>
              <p>Email: {contact?.email ?? 'Non disponible'}</p>
              <p>Adresse: {contact?.address ?? 'Non disponible'}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/30 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Guil'O Services. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
