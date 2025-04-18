import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthRegisterLayout from '@/layouts/auth-register-layout';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  tel: string;
  role: string;
  password_confirmation: string;
};

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    tel: '',
    role: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('creation'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthRegisterLayout
      title="Créer un compte"
      description="Entrez vos informations pour créer un compte"
    >
      <Head title="Inscription" />

      <form
        className="w-full max-w-screen-xl min-w-[850px] mx-auto px-4 md:px-10 flex flex-col gap-8 bg-white p-8 rounded-xl shadow-lg"
        onSubmit={submit}
        >



        {/* Nom & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              type="text"
              required
              autoFocus
              autoComplete="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              disabled={processing}
              placeholder="Votre nom complet"
            />
            <InputError message={errors.name} />
          </div>

          <div>
            <Label htmlFor="email">Adresse e-mail</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              disabled={processing}
              placeholder="exemple@email.com"
            />
            <InputError message={errors.email} />
          </div>
        </div>

        {/* Téléphone & Rôle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="tel">Numéro de téléphone</Label>
            <Input
              id="tel"
              type="tel"
              required
              value={data.tel}
              onChange={(e) => setData('tel', e.target.value)}
              disabled={processing}
              placeholder="06 00 00 00 00"
            />
            <InputError message={errors.tel} />
          </div>

          <div>
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={data.role}
              onValueChange={(value) => setData('role', value)}
            >
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="editor">Éditeur</SelectItem>
                <SelectItem value="viewer">Visiteur</SelectItem>
              </SelectContent>
            </Select>
            <InputError message={errors.role} />
          </div>
        </div>

        {/* Mot de passe & confirmation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              disabled={processing}
              placeholder="Mot de passe"
            />
            <InputError message={errors.password} />
          </div>

          <div>
            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
            <Input
              id="password_confirmation"
              type="password"
              required
              autoComplete="new-password"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              disabled={processing}
              placeholder="Confirmation"
            />
            <InputError message={errors.password_confirmation} />
          </div>
        </div>

        {/* Bouton soumettre */}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
          Créer le compte
        </Button>

        {/* Lien vers la connexion */}
        <div className="text-muted-foreground text-center text-sm">
          Vous avez déjà un compte ?{' '}
          <TextLink href={route('login')}>Se connecter</TextLink>
        </div>
      </form>
    </AuthRegisterLayout>
  );
}
