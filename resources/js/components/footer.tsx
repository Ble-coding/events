// components/footer.tsx

import { FaFacebook, FaInstagram, FaLinkedin, FaTelegram, FaTiktok, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa';



interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  social_links: {
    [key: string]: string; // ✅ rend les plateformes dynamiques
  };
}
interface Service {
    id: number;
    title: string;
  }



const Footer = ({ contact, services, }: { contact: ContactInfo | null;
    services: Service[]; }) => {
  return (
    <footer className="bg-[#EA7A0B] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Colonne 1 - Présentation */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Guil'O Services</h3>
            <p className="max-w-xs">
              Des prestations sur mesure pour vos évènements, avec une attention particulière aux détails et à vos envies.
            </p>
            <div className="flex space-x-4">
                {contact?.social_links?.facebook && (
                    <a href={contact.social_links.facebook} target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={20} />
                    </a>
                )}
                {contact?.social_links?.instagram && (
                    <a href={contact.social_links.instagram} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={20} />
                    </a>
                )}
                {contact?.social_links?.twitter && (
                    <a href={contact.social_links.twitter} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={20} />
                    </a>
                )}
                 {contact?.social_links?.youtube && (
                    <a href={contact.social_links.youtube} target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={20} />
                    </a>
                )}
                 {contact?.social_links?.tiktok && (
                    <a href={contact.social_links.tiktok} target="_blank" rel="noopener noreferrer">
                    <FaTiktok size={20} />
                    </a>
                )}

            {contact?.social_links?.linkedin && (
                    <a href={contact.social_links.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin size={20} />
                    </a>
                )}

                {contact?.social_links?.telegram && (
                    <a href={contact.social_links.telegram} target="_blank" rel="noopener noreferrer">
                    <FaTelegram size={20} />
                    </a>
                )}
                {contact?.social_links?.whatsapp && (
                    <a href={contact.social_links.whatsapp} target="_blank" rel="noopener noreferrer">
                    <FaWhatsapp size={20} />
                    </a>
                )}

                </div>

          </div>

          {/* Colonne 2 - Liens rapides */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liens rapides</h4>
            <nav className="flex flex-col space-y-2">
              {/* <a href="/" className="hover:underline">Accueil</a> */}
              <a href="/services" className="hover:underline">Services</a>
              <a href="/galerie" className="hover:underline">Galerie</a>
              <a href="/events" className="hover:underline">Événements</a>
              <a href="/venues" className="hover:underline">Salles</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </nav>
          </div>

          {/* Colonne 3 - Contact dynamique */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <nav className="flex flex-col space-y-2">
            {services.map((service) => (
      <a
        key={service.id}
        href="/services"
        className="hover:underline"
      >
        {service.title}
      </a>
    ))}
            </nav>
          </div>
            {/* Colonne 4 - Contact dynamique */}
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
