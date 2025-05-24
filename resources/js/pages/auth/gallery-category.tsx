import React, {
    // useEffect,
    useState,  useMemo
 } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import { LoaderCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface CategoryType {
  id: number;
  name: string;
}

// type CategoryType = {
//     name: string;
//     id?: number;
//     // [key: string]: any;
//   };

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
  categories: {
    data: CategoryType[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
  flash?: {
    success?: string;
  };
  allCategories: CategoryType[]
  errors?: Record<string, string>;
}

export default function GalleryCategoryManager() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const { auth, categories, flash, errors,
    allCategories
   } = usePage<PageProps>().props;
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [search, setSearch] = useState('');
  const { data, setData, post, put, reset
    // , processing
} = useForm({ name: '' });
//   const { toast } = useToast();
  const userRole = auth.user.role;
     const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
    const [flashError, setFlashError] = useState<string | null>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);
    const hasSearch = search.trim().length > 0;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Catégories', href: '/categories' },
  ];

//   useEffect(() => {
//     if (flash?.success) {
//       toast({ title: flash.success });
//     }
//   }, [flash, toast]);

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

    const list = allCategories ?? categories.data; // ✅ fallback sécurisé

    if (!term) return categories.data;

    return list.filter((p) =>
      p.name.toLowerCase().includes(term)

    );
  }, [search, categories.data, allCategories]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setErrorMessage(null); // reset

    if (!data.name.trim()) {
        setErrorMessage('Veuillez entrer un nom de catégorie');
        setIsSubmitting(false);
        return;
      }


    if (editingCategory) {
      put(`/categories/${editingCategory.id}`, {
        preserveScroll: true,
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
            resetForm();
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
    } else {
      post('/categories', {
        preserveScroll: true,
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
    setEditingCategory(null);
  };

  const handleEdit = (category: CategoryType) => {
    if (userRole === 'admin' || userRole === 'editor') {
      setEditingCategory(category);
      setData('name', category.name);
    }
  };

  const openDeleteModal = (id: number) => {
    if (userRole === 'admin') {
      setCategoryToDelete(id);
      setShowConfirmModal(true);
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete !== null && userRole === 'admin') {
      router.delete(`/categories/${categoryToDelete}`, {
        preserveScroll: true,
      });
      setShowConfirmModal(false);
      setCategoryToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

//   const filteredCategories = categories.data.filter((cat) =>
//     cat.name.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Catégories Galerie" />

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


          {(userRole === 'admin' || userRole === 'editor') && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editingCategory ? 'Modifier' : 'Ajouter'} une catégorie</CardTitle>
                  <CardDescription>
                    {editingCategory ? 'Modifiez la catégorie' : 'Ajoutez une nouvelle catégorie'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ex: Mariage"
                      />
                            {errors?.name && <p className="text-red-500">{errors.name}</p>}

                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                        {editingCategory ? (
                          <><Edit className="h-4 w-4 mr-2" />
                          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                           Modifier</>
                        ) : (
                          <><Plus className="h-4 w-4 mr-2" />
                          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                          Ajouter</>
                        )}
                      </Button>

                      {editingCategory && (
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
                <CardTitle className="flex justify-between items-center">
                  Liste des catégories
                </CardTitle>
                <div className="pt-2">
                  <Input
                    placeholder="Rechercher une catégorie..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {filtered.map((cat) => (
                    <li key={cat.id} className="flex justify-between items-center py-2">
                      <span>{cat.name}</span>
                      {(userRole === 'admin' || userRole === 'editor') && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {userRole === 'admin' && (
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(cat.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {filtered.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucune catégorie trouvée.</p>
                )}
{!hasSearch && (
                <div className="flex justify-center gap-2 mt-6">
                  {categories.links.map((link, idx) => (
                    <Button
                      key={idx}
                      variant={link.active ? 'default' : 'outline'}
                      disabled={!link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      onClick={() => handlePageChange(link.url)}
                    />
                  ))}
                </div>
                  )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Supprimer la catégorie"
        message="Cette action est définitive. Voulez-vous vraiment supprimer cette catégorie ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
