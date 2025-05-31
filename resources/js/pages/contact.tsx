import React from 'react';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Head, usePage, router } from '@inertiajs/react';
import SectionHeading from '@/components/section-heading';
import ContactForm from '@/components/contact-form';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface ContactInfo {
    address: string;
    phones: []
    email: string;
    weekday_hours: string;
    saturday_hours: string;
    sunday_hours: string;
    map_src: string;
  }


interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  faqs: {
    data: Faq[];
    links: PaginationLink[];
  };
  [key: string]: unknown;
  contact: ContactInfo | null;
}

export default function ContactPage() {
    const { faqs, contact } = usePage<PageProps>().props;

  const handlePagination = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  return (
    <AppMenuTemplate>
      <Head title="Contactez-nous" />

      {/* Hero Section */}
      <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Contactez-nous</h1>
            <p className="text-white/90 text-[20px] mb-8">
              Nous sommes impatients de discuter de votre projet et de répondre à toutes vos questions. N'hésitez pas à nous contacter.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white dark:bg-white">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <SectionHeading
                subtitle="Écrivez-nous"
                title="Envoyez-nous un message"
                description="Remplissez ce formulaire pour nous parler de vos besoins et nous vous répondrons dans les plus brefs délais."
              />
              <ContactForm />
            </div>

            <div className="space-y-10">
              <SectionHeading
                subtitle="Nos coordonnées"
                title="Comment nous joindre"
                description="Plusieurs moyens de nous contacter pour discuter de votre projet."
              />

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium
                    text-black dark:text-black mb-1">Adresse</h4>
                    <p className="text-gray-500 dark:text-gray-500">{contact?.address ?? 'Adresse non disponible'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium
                    text-black dark:text-black mb-1">Téléphone</h4>
                    <p className="text-gray-500 dark:text-gray-500">{contact?.phones?.length ? contact.phones.join(', ') : 'Téléphone non disponible'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium
                    text-black dark:text-black mb-1">Email</h4>
                    <p className="text-gray-500 dark:text-gray-500">{contact?.email ?? 'Email non disponible'}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-accent mr-4 mt-1" />
                  <div>
                    <h4 className="font-medium
                    text-black dark:text-black mb-1">Horaires</h4>
                    <p className="text-gray-500 dark:text-gray-500">
                        Lundi - Vendredi: {contact?.weekday_hours ?? 'N/A'}<br />
                        Samedi: {contact?.saturday_hours ?? 'N/A'}<br />
                        Dimanche: {contact?.sunday_hours ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium text-black dark:text-black mb-4">Nous trouver</h4>
                <div className="h-64 rounded-lg overflow-hidden shadow-md">
                  <iframe
                        title="Map"
                        className="w-full h-full border-0"
                        src={contact?.map_src || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83998.76457430334!2d2.2769948739866728!3d48.85894658138793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e0!3m2!1sen!2sus!4v1699374764410!5m2!1sen!2sus"} // 👈 Dynamique
                        allowFullScreen
                        loading="lazy"
                    ></iframe>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section dynamique si données disponibles */}
      {faqs?.data?.length > 0 && (
        <section className="py-20 bg-gray-100 dark:bg-gray-100 ">
          <div className="container">
            <SectionHeading
              subtitle="FAQ"
              title="Questions fréquentes"
              description="Vous avez des questions ? Nous avons les réponses. Voici quelques questions fréquemment posées par nos clients."
              centered
            />

            <div className="max-w-3xl mx-auto mt-10 space-y-6">
              {faqs.data.map((faq) => (
                <div key={faq.id} className="bg-white dark:bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="font-medium text-black dark:text-black mb-2">{faq.question}</h4>
                  <p className="text-gray-500 dark:text-gray-500">{faq.answer}</p>
                </div>
              ))}

              <div className="flex justify-center gap-2 mt-6">
                {faqs.links.map((link, idx) => (
                  <Button
                  className='bg-white dark:bg-white
                  dark:border-gray-100 text-black dark:text-black
                  dark:hover:bg-gray-100/15'
                    key={idx}
                    variant={link.active ? 'default' : 'outline'}
                    disabled={!link.url}
                    onClick={() => handlePagination(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </AppMenuTemplate>
  );
}
