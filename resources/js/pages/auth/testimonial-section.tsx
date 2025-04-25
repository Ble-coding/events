import React, { useEffect, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { Textarea } from '@/components/ui/textarea'; // assure-toi de l'importer
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import { LoaderCircle, Edit, Trash2, Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

interface TestimonialType {
  id: number;
  content: string;
  author: string;
  role: string;
  avatar: File | string | null;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps extends InertiaPageProps {
  testimonials: {
    data: TestimonialType[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
  auth: {
    user: {
      role: 'admin' | 'editor' | 'viewer';
    };
  };
  flash?: {
    success?: string;
  };
}

export default function TestimonialSection() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);
  const { testimonials, flash, auth } = usePage<PageProps>().props;
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialType | null>(null);
  const [search, setSearch] = useState('');
  const { data, setData, reset, processing } = useForm({
    content: '',
    author: '',
    role: '',
    avatar: null as File | null,
  });


  const { toast } = useToast();

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Témoignages', href: '/testimonials-dashboard' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


  // ✅ Validation simple côté client
  if (!data.content.trim() || !data.author.trim() || !data.role.trim()) {
    toast({
      title: 'Veuillez remplir tous les champs obligatoires.',
      variant: 'destructive',
    });
    return;
  }

    const formData = new FormData();
    formData.append('author', data.author);
    formData.append('role', data.role);
    formData.append('content', data.content); // <-- AJOUTE CECI

    if (data.avatar) {
        formData.append('avatar', data.avatar);
      }
      if (editingTestimonial) {
        formData.append('_method', 'PUT');
        router.post(`/testimonials-dashboard/${editingTestimonial.id}`, formData, {
          forceFormData: true,
          onSuccess: () => {
            toast({ title: 'Témoignage mis à jour !' });
            resetForm();
            router.reload();
          },
        });
      }
       else {
      router.post('/testimonials-dashboard', formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: `ajoutée avec succès` });
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingTestimonial(null);
  };

  const handleEdit = (item: TestimonialType) => {
    setEditingTestimonial(item);
    setData({
      content: item.content,
      author: item.author,
      role: item.role,
      avatar: null,
    });
  };


  const openDeleteModal = (id: number) => {
    setTestimonialToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (testimonialToDelete !== null) {
      router.delete(`/testimonials-dashboard/${testimonialToDelete}`, { preserveScroll: true });
      setShowConfirmModal(false);
      setTestimonialToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  const filteredTestimonials = testimonials.data.filter((item) =>
    item.content.toLowerCase().includes(search.toLowerCase()) ||
    item.author.toLowerCase().includes(search.toLowerCase()) ||
    item.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Témoignages" />

      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(isAdmin || isEditor) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editingTestimonial ? 'Modifier' : 'Ajouter'} un témoignage</CardTitle>
                  <CardDescription>
                    {editingTestimonial ? 'Modifiez les détails du témoignage' : 'Ajoutez un nouveau témoignage'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="content">Témoignage</Label>
                    <Textarea
                        id="content" required
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Ex: Service exceptionnel, merci !"
                    />
                    </div>
                    <div>
                      <Label htmlFor="author">Auteur</Label>
                      <Input
                        id="author"   required
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                        placeholder="Ex: Jean Dupont"
                      />
                    </div>
                    <div>
                    <Label htmlFor="role">Occasion / Rôle</Label>
                    <Input
                    id="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    placeholder="Ex: Mariés en Juin 2023"
                    />

                    </div>

                    <div>
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                    id="avatar"
                    type="file"
                    onChange={(e) => setData('avatar', e.target.files?.[0] ?? null)}
                    accept="image/*"
                    placeholder="Sélectionner une image"
                />
                </div>


                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        {editingTestimonial ? (
                          <><Edit className="h-4 w-4 mr-2" />{processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Modifier</>
                        ) : (
                          <><Plus className="h-4 w-4 mr-2" />{processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter</>
                        )}
                      </Button>
                      {editingTestimonial && (
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
                <CardTitle>Liste des témoignages</CardTitle>
                <div className="pt-2">
                  <Input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <Card>

  <CardContent>
    <ul className="divide-y">
      {filteredTestimonials.map((item) => (
        <li key={item.id} className="flex justify-between items-start py-2 gap-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center text-white font-bold text-sm shrink-0">
            {item.avatar ? (
        <img
        src={
          typeof item.avatar === 'string'
            ? `/storage/${item.avatar}` // Ajoute /storage ici
            : item.avatar instanceof File
              ? URL.createObjectURL(item.avatar)
              : '/images/avatar-4.png'
        }
        alt={item.author}
        className="w-10 h-10 rounded-full object-cover"
      />


            ) : item.author ? (
              <span className="text-xl font-bold">
                {item.author.charAt(0).toUpperCase()}
              </span>
            ) : (
              <img
                src="/images/avatar-4.png"
                alt="Avatar par défaut"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Contenu */}
          <div className="flex-1">
            <span className="block text-sm font-medium">{item.content}</span>
            <p className="text-xs text-muted-foreground">
              {item.author} - {item.role}
            </p>
          </div>

          {/* Actions */}
          {(isAdmin || isEditor) && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDeleteModal(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>

    {filteredTestimonials.length === 0 && (
      <p className="text-muted-foreground text-sm pt-4">
        Aucun témoignage trouvé.
      </p>
    )}

    <div className="flex justify-center gap-2 mt-6">
      {testimonials.links.map((link, idx) => (
        <Button
          key={idx}
          variant={link.active ? "default" : "outline"}
          disabled={!link.url}
          dangerouslySetInnerHTML={{ __html: link.label }}
          onClick={() => handlePageChange(link.url)}
        />
      ))}
    </div>
  </CardContent>
</Card>

            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Supprimer le témoignage"
        message="Cette action est définitive. Voulez-vous vraiment supprimer ce témoignage ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
