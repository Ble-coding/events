import React, { useEffect, useState } from 'react';
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
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface CategoryType {
  id: number;
  name: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps extends InertiaPageProps {
  categories: {
    data: CategoryType[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };
  flash?: {
    success?: string;
  };
}

export default function GalleryCategoryManager() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const { categories, flash } = usePage<PageProps>().props;
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [search, setSearch] = useState('');
  const { data, setData, post, put, reset } = useForm({ name: '' });
  const { toast } = useToast();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Catégories', href: '/categories' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name.trim()) {
      toast({ title: 'Veuillez entrer un nom de catégorie', variant: 'destructive' });
      return;
    }

    if (editingCategory) {
      put(`/categories/${editingCategory.id}`, {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    } else {
      post('/categories', {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingCategory(null);
  };

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setData('name', category.name);
  };

  const openDeleteModal = (id: number) => {
    setCategoryToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete !== null) {
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

  const filteredCategories = categories.data.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Catégories Galerie" />

      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">
                      {editingCategory ? (
                        <><Edit className="h-4 w-4 mr-2" /> Modifier</>
                      ) : (
                        <><Plus className="h-4 w-4 mr-2" /> Ajouter</>
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
                  {filteredCategories.map((cat) => (
                    <li key={cat.id} className="flex justify-between items-center py-2">
                      <span>{cat.name}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteModal(cat.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                {filteredCategories.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucune catégorie trouvée.</p>
                )}

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
