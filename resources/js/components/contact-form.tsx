import React, { useEffect } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface PageProps {
  flash?: {
    success?: string;
  };
  [key: string]: unknown;
  errors?: Record<string, string>;
}

const ContactForm = () => {
  const { toast } = useToast();
  const { flash, errors } = usePage<PageProps>().props;

  const { data, setData, reset, post, processing } = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  useEffect(() => {
    if (flash?.success) {
      toast({
        title: 'Message envoyé',
        description: flash.success,
      });
    //   reset();
    }
  }, [flash, toast, reset]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/contact-message', {
      preserveScroll: true,
      onSuccess: () => {
        reset(); // ✅ Reset ici, quand la requête est réussie
        toast({
          title: 'Message envoyé',
          description: flash?.success ?? 'Nous vous répondrons dans les plus brefs délais.',
        });
      },
    });
  };


  return (
    <>
      {flash?.success && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          ✅ {flash.success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Votre nom"
                required
                className="bg-white/70 backdrop-blur-sm"
              />
              {errors?.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Votre email"
                required
                className="bg-white/70 backdrop-blur-sm"
              />
              {errors?.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="Votre téléphone"
              className="bg-white/70 backdrop-blur-sm"
            />
            {errors?.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}
              required
              placeholder="Votre message"
              className="resize-none bg-white/70 backdrop-blur-sm"
            />
            {errors?.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto rounded-full px-8"
          disabled={processing}
        >
          Envoyer le message
        </Button>
      </form>
    </>
  );
};

export default ContactForm;
