import React, { useEffect } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface Contact {
  id?: number;
  address: string;
  phone: string;
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
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
}

export default function ContactInfoManager() {

  const { contact, flash, auth } = usePage<PageProps>().props;
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
  const isViewer = auth.user.role  === 'viewer';
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
    phone: contact?.phone ?? '',
    email: contact?.email ?? '',
    weekday_hours: contact?.weekday_hours ?? '',
    saturday_hours: contact?.saturday_hours ?? '',
    sunday_hours: contact?.sunday_hours ?? '',
    map_src: contact?.map_src ?? '',
    social_links: mergedSocialLinks, // 🔥 ici
  });


  const { toast } = useToast();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Contact', href: '/contact-info' },
  ];



  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

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

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone" disabled={isReadOnly}
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  placeholder="+33 1 23 45 67 89"
                />
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
