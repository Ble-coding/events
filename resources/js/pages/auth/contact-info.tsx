import React, { useMemo, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoaderCircle, Save } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Contact {
  id?: number;
  address: string;
  text_footer: string;
  copyright: string;
  phones: string[];
  email: string;
  weekday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  map_src: string;
  social_links: {
    [key: string]: string; // ✅ rend les plateformes dynamiques
  };
}

interface PageProps extends InertiaPageProps {
  contact?: Contact;
  flash?: {
    success?: string;
  };
  errors?: Record<string, string>;
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
}

export default function ContactInfoManager() {

  const { contact, flash, auth, errors } = usePage<PageProps>().props;
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
  const isViewer = auth.user.role  === 'viewer';
  const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
  const [flashError, setFlashError] = useState<string | null>(null);
const isReadOnly = isViewer && !(isAdmin || isEditor);
  const defaultSocialLinks = {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    linkedin: '',
    telegram: '',
    whatsapp: '',
  };

  const mergedSocialLinks = {
    ...defaultSocialLinks,
    ...(contact?.social_links || {}),
  };

  const { data, setData, post, put, processing } = useForm({
    address: contact?.address ?? '',
    text_footer: contact?.text_footer ?? '',
    copyright: contact?.copyright ?? '',
    // phone: contact?.phone ?? '',
    phones: contact?.phones ?? [''],
    email: contact?.email ?? '',
    weekday_hours: contact?.weekday_hours ?? '',
    saturday_hours: contact?.saturday_hours ?? '',
    sunday_hours: contact?.sunday_hours ?? '',
    map_src: contact?.map_src ?? '',
    social_links: mergedSocialLinks, // 🔥 ici
  });


//   const { toast } = useToast();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/contact-info' },
  ];




  useMemo(() => {
    if (flash?.success) {
      setFlashSuccess(flash.success);
      setTimeout(() => setFlashSuccess(null), 4000); // Masquer après 4s
    }

    if (errors?.file) {
      setFlashError(errors.file);
      setTimeout(() => setFlashError(null), 5000); // Masquer après 5s
    }
  }, [flash?.success, errors?.file]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const method = contact?.id ? put : post;
    const url = '/contact-infos';

    method(url, {
      preserveScroll: true,
    });
  };

  return (

    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Informations de Contact" />

      <div className="flex flex-col gap-4 p-4">
      {/* {(isAdmin || isEditor) && ( */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de Contact</CardTitle>
            <CardDescription>
              {contact ? 'Modifier les informations' : 'Ajouter les informations de contact'}
            </CardDescription>
          </CardHeader>

          <CardContent>
          {flashSuccess && (

<div className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3" role="alert">
<svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z"/></svg>
<p> {flashSuccess}</p>
</div>
)}

{flashError && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  {/* <strong class="font-bold">Holy smokes!</strong> */}
  <span className="block sm:inline">{flashError}</span>
  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div>
)}
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  disabled={isReadOnly}
                   placeholder="Adresse 123 Avenue des Services 75000 Paris, France"
                />
              </div>

              {/* <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone" disabled={isReadOnly}
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
              </div> */}


<div>
  <Label>Téléphones</Label>
  {data.phones.map((value, index) => (
    <div key={index} className="flex gap-2 items-center mb-2">
      <Input
        value={value}
        onChange={(e) => {
          const updated = [...data.phones];
          updated[index] = e.target.value;
          setData('phones', updated);
        }}
        placeholder={`Téléphone #${index + 1}`}
        disabled={isReadOnly}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          const updated = [...data.phones];
          updated.splice(index, 1);
          setData('phones', updated);
        }}
        disabled={data.phones.length === 1}
      >
        Supprimer
      </Button>
    </div>
  ))}

  {!isReadOnly && (
    <Button  disabled={data.phones.length >= 3}
      type="button"
      variant="outline"
      onClick={() => setData('phones', [...data.phones, ''])}
    >
      + Ajouter un téléphone
    </Button>
  )}
  {errors?.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
</div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email" disabled={isReadOnly}
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="contact@guiloservices.fr"
                />
              </div>

              <div>
                <Label htmlFor="weekday_hours">Heures (Semaine)</Label>
                <Input
                  id="weekday_hours" disabled={isReadOnly}
                  value={data.weekday_hours}
                  onChange={(e) => setData('weekday_hours', e.target.value)}
                   placeholder="9h00 - 18h00"
                />
              </div>

              <div>
                <Label htmlFor="saturday_hours">Heures (Samedi)</Label>
                <Input
                  id="saturday_hours"
                  value={data.saturday_hours} disabled={isReadOnly}
                  onChange={(e) => setData('saturday_hours', e.target.value)}
                  placeholder="10h00 - 16h00"
                />
              </div>

              <div>
                <Label htmlFor="sunday_hours">Heures (Dimanche)</Label>
                <Input
                  id="sunday_hours" disabled={isReadOnly}
                  value={data.sunday_hours}
                  onChange={(e) => setData('sunday_hours', e.target.value)}
                placeholder="Fermé"
                />
              </div>

              <div>
                <Label htmlFor="text_footer">Texte du Footer</Label>
                <Input
                  id="text_footer"
                  value={data.text_footer}
                  onChange={(e) => setData('text_footer', e.target.value)}
                  disabled={isReadOnly}
                   placeholder="Des prestations sur mesure pour vos évènements, avec une attention particulière aux détails et à vos envies.."
                />
                {errors?.text_footer && <p className="text-red-500 text-sm">{errors.text_footer}</p>}
              </div>

              <div>
                <Label htmlFor="copyright">Copyright</Label>
                <Input
                  id="copyright"
                  value={data.copyright}
                  onChange={(e) => setData('copyright', e.target.value)}
                  disabled={isReadOnly}
                   placeholder="Guil'O Services. Tous droits réservés."
                />
                {errors?.copyright && <p className="text-red-500 text-sm">{errors.copyright}</p>}
              </div>


            <div className="grid gap-2">
            <Label>Liens Réseaux Sociaux</Label>
            {Object.entries(data.social_links).map(([platform, value]) => (
                <div key={platform}>
                <Label htmlFor={`social-${platform}`} className="capitalize">{platform}</Label>
                <Input disabled={isReadOnly}
                    id={`social-${platform}`}
                    value={value}
                    onChange={(e) => setData('social_links', {
                    ...data.social_links,
                    [platform]: e.target.value
                    })}
                    placeholder={`https://${platform}.com/...`}
                />
                </div>
            ))}
            </div>

              <div className="grid gap-2">
                <Label htmlFor="map_src">
                    Lien Google Maps (iframe) <span className="text-muted-foreground text-xs">(embed uniquement)</span>
                </Label>
                {/* <Input
                    id="map_src"
                    value={data.map_src}
                    onChange={(e) => setData('map_src', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                /> */}
                 <Textarea disabled={isReadOnly}
                    id="map_src" required
                    value={data.map_src}
                    onChange={(e) => setData('map_src', e.target.value)}
                    placeholder="https://www.google.com/maps/embed?pb=..."
                />
                {data.map_src?.startsWith("https://www.google.com/maps/embed") && (
                    <div className="h-64 mt-2 rounded-md overflow-hidden shadow">
                    <iframe
                        title="Prévisualisation carte"
                        src={data.map_src}
                        className="w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                    </div>
                )}
                {!data.map_src?.startsWith("https://www.google.com/maps/embed") && data.map_src && (
                    <p className="text-xs text-red-500">⚠️ Le lien doit être un lien *embed* Google Maps valide.</p>
                )}
                </div>

                {(isAdmin || isEditor) && (
              <div className="pt-4">
              <Button type="submit" className="w-full" disabled={processing || isReadOnly}>

                  <Save className="h-4 w-4 mr-2" />
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {contact ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
              </div> )}
            </form>
          </CardContent>
        </Card>
        {/* )} */}
      </div>
    </AppLayout>
  );
}
