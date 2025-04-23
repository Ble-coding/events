import  { useEffect, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface UserType {
  id: number;
  name: string;
  email: string;
  tel: string;
  role: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps extends InertiaPageProps {
  auth: {
    user: {
      role: string;
    };
  };
  utilisateurs: {
    data: UserType[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
  flash?: {
    success?: string;
  };
}

export default function UserManager() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const { auth, utilisateurs, flash } = usePage<PageProps>().props;
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [search, setSearch] = useState('');
  const { data, setData, post, put, reset, processing} = useForm({
    name: '',
    email: '',
    tel: '',
    role: '',
  });
  const { toast } = useToast();
  const userRole = auth.user.role;
  const roleLabel: { [key: string]: string } = {
    admin: 'Admin',
    editor: 'Éditeur',
    viewer: 'Visiteur',
  };


  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Utilisateurs', href: '/utilisateurs-dashboard' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name.trim() || !data.email.trim()) {
      toast({ title: 'Nom et email requis.', variant: 'destructive' });
      return;
    }

    if (editingUser) {
      put(`/utilisateurs-dashboard/${editingUser.id}`, {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    } else {
      post('/utilisateurs-dashboard', {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingUser(null);
  };

  const handleEdit = (user: UserType) => {
    if (userRole === 'admin') {
      setEditingUser(user);
      setData({
        name: user.name,
        email: user.email,
        tel: user.tel,
        role: user.role,
      });
    }
  };

  const openDeleteModal = (id: number) => {
    if (userRole === 'admin') {
      setUserToDelete(id);
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = () => {
    if (userToDelete !== null && userRole === 'admin') {
      router.delete(`/utilisateurs-dashboard/${userToDelete}`, {
        preserveScroll: true,
      });
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  const filteredUsers = utilisateurs.data.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Utilisateurs" />
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {userRole === 'admin' && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editingUser ? 'Modifier' : 'Ajouter'} un utilisateur</CardTitle>
                  <CardDescription>
                    {editingUser
                      ? "Modifiez l'utilisateur"
                      : 'Ajoutez un nouvel utilisateur'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input required
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nom complet"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input required
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Adresse e-mail"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tel">Téléphone</Label>
                      <Input
                        id="tel"
                        value={data.tel}
                        onChange={(e) => setData('tel', e.target.value)}
                        placeholder="Numéro"
                      />
                    </div>
                    {/* <div>
                      <Label htmlFor="role">Rôle</Label>
                      <Input
                        id="role"
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        placeholder="admin / editor / viewer"
                      />
                    </div> */}

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
                                {/* <InputError message={errors.role} /> */}
                              </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        {editingUser ? (
                          <>
                            <Edit className="h-4 w-4 mr-2" />
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Modifier
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter
                          </>
                        )}
                      </Button>
                      {editingUser && (
                        <Button variant="outline" type="button" onClick={resetForm}>
                          Annuler
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Liste des utilisateurs</CardTitle>
                <div className="pt-2">
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {filteredUsers.map((u) => (
                  <li key={u.id} className="flex justify-between items-center py-2">
                  <div>
                    <p>{u.name}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-blue-500 capitalize">{roleLabel[u.role] || u.role}</p>

                  </div>
                  {userRole === 'admin' && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(u)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteModal(u.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </li>

                  ))}
                </ul>

                {filteredUsers.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucun utilisateur trouvé.</p>
                )}

                <div className="flex justify-center gap-2 mt-6">
                  {utilisateurs.links.map((link, idx) => (
                    <Button
                      key={idx}
                      variant={link.active ? 'default' : 'outline'}
                      disabled={!link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      onClick={() => handlePageChange(link.url)}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Supprimer l'utilisateur"
        message="Voulez-vous vraiment supprimer cet utilisateur ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
