import React, { useMemo, useState } from 'react';
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
// import { useToast } from '@/components/ui/use-toast';
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
  alltestimonialItems: TestimonialType[];
  errors?: Record<string, string>;
  flash?: {
    success?: string;
  };
}

export default function TestimonialSection() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState<number | null>(null);
  const { testimonials, flash, auth,  alltestimonialItems, errors} = usePage<PageProps>().props;
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialType | null>(null);
    const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
      const [flashError, setFlashError] = useState<string | null>(null);

      const [errorMessage, setErrorMessage] = useState<string | null>(null);


    // const hasSearch = search.trim() !== '' || selectedCategory !== 'all';
      const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const hasSearch = search.trim().length > 0;
  const { data, setData, reset
    // , processing
 } = useForm({
    content: '',
    author: '',
    role: '',
    avatar: null as File | null,
  });


//   const { toast } = useToast();

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Témoignages', href: '/testimonials-dashboard' },
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

    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();

      const list = alltestimonialItems ?? testimonials.data; // ✅ fallback sécurisé

      if (!term) return testimonials.data;

      return list.filter((p) =>
        p.content.toLowerCase().includes(term) ||
      p.author.toLowerCase().includes(term) ||
        p.role.toLowerCase().includes(term)

      //   p.url.toLowerCase().includes(term)
      );
    }, [search, testimonials.data, alltestimonialItems]);

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null); // reset


  if (!data.content.trim() || !data.author.trim() || !data.role.trim()) {
    setErrorMessage('Veuillez remplir tous les champs obligatoires.');
    setIsSubmitting(false);
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
            // closeModal();
            setIsSubmitting(false);
            resetForm();
            // router.reload();
          },
          onError: () => {
            setIsSubmitting(false);
          },
        });
      }
       else {
      router.post('/testimonials-dashboard', formData, {
        forceFormData: true,
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
            resetForm();

          },
          onError: () => {
            setIsSubmitting(false);
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

//   const filteredTestimonials = testimonials.data.filter((item) =>
//     item.content.toLowerCase().includes(search.toLowerCase()) ||
//     item.author.toLowerCase().includes(search.toLowerCase()) ||
//     item.role.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Témoignages" />

      <div className="flex flex-col gap-4 p-4">
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

{errorMessage && (
  <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded mb-4">
    {errorMessage}
  </div>
)}
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
                        id="content"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Ex: Service exceptionnel, merci !"
                    />
                          {errors?.content && <p className="text-red-500">{errors.content}</p>}
                    </div>
                    <div>
                      <Label htmlFor="author">Auteur</Label>
                      <Input
                        id="author"
                        value={data.author}
                        onChange={(e) => setData('author', e.target.value)}
                        placeholder="Ex: Jean Dupont"
                      />
                            {errors?.author && <p className="text-red-500">{errors.author}</p>}
                    </div>
                    <div>
                    <Label htmlFor="role">Occasion / Rôle</Label>
                    <Input
                    id="role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value)}
                    placeholder="Ex: Mariés en Juin 2023"
                    />
      {errors?.role && <p className="text-red-500">{errors.role}</p>}
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
                      {errors?.avatar && <p className="text-red-500">{errors.avatar}</p>}
                </div>


                    <div className="flex gap-2 pt-2">

                            <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                                                                    {editingTestimonial ? (
                                                                      <><Edit className="h-4 w-4 mr-2" />
                                                                      {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                                       Modifier</>
                                                                    ) : (
                                                                      <><Plus className="h-4 w-4 mr-2" />
                                                                      {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                                      Ajouter</>
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
                    placeholder="Rechercher par nom ou description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <Card>

  <CardContent>
    <ul className="divide-y">
      {filtered.map((item) => (
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

    {filtered.length === 0 && (
      <p className="text-muted-foreground text-sm pt-4">
        Aucun témoignage trouvé.
      </p>
    )}
{!hasSearch && (
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
    </div>   )}
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
