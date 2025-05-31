import React, { useState, useMemo } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';

interface PageProps {
  flash?: {
    success?: string;
  };
  [key: string]: unknown;
  errors?: Record<string, string>;
}

const ContactForm = () => {
    const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
    const [flashError, setFlashError] = useState<string | null>(null);
const { flash, errors } = usePage<PageProps>().props;

  const { data, setData, reset, post, processing } = useForm({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post('/contact-message', {
      preserveScroll: true,
      onSuccess: () => reset(),
    });
  };


  return (
    <>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
              className=' text-black dark:text-black'
               htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Votre nom"

                className="bg-white/70
                                border border-gray-300 text-black placeholder:text-gray-500
                dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500
                backdrop-blur-sm"


              />
              {errors?.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label className=' text-black dark:text-black' htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Votre email"

                className="bg-white/70
                border border-gray-300 text-black placeholder:text-gray-500
dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500
backdrop-blur-sm"
              />
              {errors?.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className=' text-black dark:text-black' htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="Votre téléphone"
              className="bg-white/70
              border border-gray-300 text-black placeholder:text-gray-500
dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500
backdrop-blur-sm"
            />
            {errors?.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label  className=' text-black dark:text-black'
            htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={5}
              value={data.message}
              onChange={(e) => setData('message', e.target.value)}

              placeholder="Votre message"
              className="bg-white/70  resize-none
              border border-gray-300 text-black placeholder:text-gray-500
dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500
backdrop-blur-sm"

            //   className="dark:bg-accent/10 bg-white/70 backdrop-blur-sm"
            />
            {errors?.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>
        </div>

        <Button
  type="submit"
  size="lg"
  className="w-full sm:w-auto px-8 rounded-full
             bg-black text-white hover:bg-black/60
             dark:bg-black dark:text-white dark:hover:bg-black/60"
  disabled={processing}
>
  Envoyer le message
</Button>

      </form>
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
    </>
  );
};

export default ContactForm;
