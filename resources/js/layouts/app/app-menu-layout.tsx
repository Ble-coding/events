import { AppContent } from '@/components/app-content';
import { AppMenu } from '@/components/app-menu';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import Footer from '@/components/footer';
import { usePage } from '@inertiajs/react';


// Tu peux déclarer ContactInfo ici ou l'importer depuis '@/types'
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


// Typage des props Inertia locales
type PageProps = {
  contact: ContactInfo | null;
  servicesFooter: Service[];
};



export default function AppMenuLayout({ children }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] ;
  }>) {

    const { contact, servicesFooter } = usePage<PageProps>().props;

  return (
    <AppShell>
      <AppMenu />
      <AppContent>{children}</AppContent>
      <Footer contact={contact} services={servicesFooter} />
    </AppShell>
  );

}










