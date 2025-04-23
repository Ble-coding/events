import React, { useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
}

interface PageProps extends InertiaPageProps {
  contact?: Contact;
  flash?: {
    success?: string;
  };
}

export default function ContactInfoManager() {
  const { contact, flash } = usePage<PageProps>().props;
  const { data, setData, post, put, processing } = useForm({
    address: contact?.address ?? '',
    phone: contact?.phone ?? '',
    email: contact?.email ?? '',
    weekday_hours: contact?.weekday_hours ?? '',
    saturday_hours: contact?.saturday_hours ?? '',
    sunday_hours: contact?.sunday_hours ?? '',
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
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="weekday_hours">Heures (Semaine)</Label>
                <Input
                  id="weekday_hours"
                  value={data.weekday_hours}
                  onChange={(e) => setData('weekday_hours', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="saturday_hours">Heures (Samedi)</Label>
                <Input
                  id="saturday_hours"
                  value={data.saturday_hours}
                  onChange={(e) => setData('saturday_hours', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="sunday_hours">Heures (Dimanche)</Label>
                <Input
                  id="sunday_hours"
                  value={data.sunday_hours}
                  onChange={(e) => setData('sunday_hours', e.target.value)}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={processing}>
                  <Save className="h-4 w-4 mr-2" />
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {contact ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
