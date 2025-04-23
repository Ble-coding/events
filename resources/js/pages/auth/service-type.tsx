import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

interface ServiceType {
  id: number;
  name: string;
  description?: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps extends InertiaPageProps {
  types: {
    data: ServiceType[];
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

export default function ServiceTypeManager() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const { types, flash, auth } = usePage<PageProps>().props;
  const [editingType, setEditingType] = useState<ServiceType | null>(null);
  const [search, setSearch] = useState('');
  const { data, setData, post, put, reset, processing } = useForm({ name: '', description: '' });
  const { toast } = useToast();

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Types de Services', href: '/service-type' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) {
      toast({ title: 'Veuillez entrer un nom de type de service', variant: 'destructive' });
      return;
    }
    if (editingType) {
      put(`/services-types/${editingType.id}`, {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    } else {
      post('/services-types', {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditingType(null);
  };

  const handleEdit = (type: ServiceType) => {
    setEditingType(type);
    setData({ name: type.name, description: type.description || '' });
  };

  const openDeleteModal = (id: number) => {
    setTypeToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (typeToDelete !== null) {
      router.delete(`/services-types/${typeToDelete}`, { preserveScroll: true });
      setShowConfirmModal(false);
      setTypeToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  const filteredTypes = types.data.filter((type) =>
    type.name.toLowerCase().includes(search.toLowerCase()) ||
    type.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Types de Services" />

      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(isAdmin || isEditor) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editingType ? 'Modifier' : 'Ajouter'} un type de service</CardTitle>
                  <CardDescription>
                    {editingType
                      ? 'Modifiez les informations du type'
                      : 'Ajoutez un nouveau type de service'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name" required autoFocus
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Ex: Organisation de mariages"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Ex: Services haut de gamme pour événements privés"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1">
                        {editingType ? (
                          <><Edit className="h-4 w-4 mr-2" />
                               {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Modifier</>
                        ) : (
                          <><Plus className="h-4 w-4 mr-2" />
                               {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                               Ajouter</>
                        )}
                      </Button>
                      {editingType && (
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
                <CardTitle>Liste des types de services</CardTitle>
                <div className="pt-2">
                  <Input
                    placeholder="Rechercher un type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {filteredTypes.map((type) => (
                    <li key={type.id} className="flex justify-between items-start py-2">
                      <div className="flex-1">
                        <span className="block text-sm font-medium">{type.name}</span>
                        {type.description && (
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        )}
                      </div>
                      {(isAdmin || isEditor) && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(type.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {filteredTypes.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucun type trouvé.</p>
                )}

                <div className="flex justify-center gap-2 mt-6">
                  {types.links.map((link, idx) => (
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
        title="Supprimer le type de service"
        message="Cette action est définitive. Voulez-vous vraiment supprimer ce type de service ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
