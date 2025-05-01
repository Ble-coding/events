import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit, Trash2, Film, Image, Upload } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-react';

interface GalleryItemType {
  id: number;
  title: string;
  category_id: number;
  url: string;
  type: 'image' | 'video';
  category: { id: number; name: string };
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  items: {
    data: GalleryItemType[];
    links: PaginationLink[];
  };
  categories: { id: number; name: string }[];
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash: { success?: string };
  [key: string]: unknown;
}

export default function GalleryDashboard() {
  const { toast } = useToast();
  const { items, categories, flash, auth } = usePage<PageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<GalleryItemType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const { data, setData, reset, processing } = useForm({
    title: '',
    category_id: '',
    type: 'image' as 'image' | 'video',
    url: '',
    file: null as File | null,
  });

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
//   const isViewer = auth.user.role === 'viewer';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Galerie', href: '/gallery' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category_id', data.category_id);
    formData.append('type', data.type);
    if (data.file) formData.append('file', data.file);
    if (data.url) formData.append('url', data.url);

    if (editingItem) {
      formData.append('_method', 'PUT');
      router.post(`/gallery/${editingItem.id}`, formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: 'Média modifié avec succès' });
          resetForm();
          router.reload();
        },
      });
    } else {
      router.post('/gallery', formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: `${data.type === 'image' ? 'Image' : 'Vidéo'} ajoutée avec succès` });
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setData({ title: '', category_id: '', type: 'image', url: '', file: null });
    reset();
    setEditingItem(null);
  };

  const handleEdit = (item: GalleryItemType) => {
    setEditingItem(item);
    setData({
      title: item.title,
      category_id: item.category.id.toString(),
      type: item.type,
      url: item.url,
      file: null,
    });
  };

  const openDeleteModal = (id: number) => {
    setItemToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null) {
      router.delete(`/gallery/${itemToDelete}`, {
        onSuccess: () => toast({ title: 'Élément supprimé' }),
      });
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  const filteredItems = items.data.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    // ||
    //   item.category.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.category_id === selectedCategory;
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Galerie" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-end">
          <Input
            placeholder="Rechercher par titre ..."
            className="w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
                <Select
              value={selectedCategory === 'all' ? 'all' : String(selectedCategory)}
              onValueChange={(value) => {
                setSelectedCategory(value === 'all' ? 'all' : Number(value));
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>




            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formulaire */}
            {(isAdmin || isEditor) && (
            <div>
                    <Card>
                        <CardHeader>
                        <CardTitle>{editingItem ? 'Modifier' : 'Ajouter'} un élément</CardTitle>
                        <CardDescription>
                            {editingItem ? 'Modifiez les détails' : 'Ajoutez un élément à la galerie'}
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                            <Label htmlFor="title">Titre</Label>
                            <Input id="title"
                            placeholder="Baby Shower"
                            value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                            </div>
                            <div>
                            <Label>Catégorie</Label>
                            <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                <SelectTrigger><SelectValue placeholder="Choisir une catégorie" /></SelectTrigger>
                                <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </div>
                            <div>
                            <Label>Type</Label>
                            <Select value={data.type} onValueChange={(value) => setData('type', value as 'image' | 'video')}>
                                <SelectTrigger><SelectValue placeholder="Type de média" /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Vidéo</SelectItem>
                                </SelectContent>
                            </Select>
                            </div>
                            <div>
                            <Label htmlFor="file">Fichier</Label>
                            <Input type="file" accept={data.type === 'image' ? 'image/*' : 'video/*'} onChange={(e) => setData('file', e.target.files?.[0] || null)} />
                            </div>
                            <div>
                            <Label htmlFor="url">Ou URL</Label>
                            <Input id="url"
                            placeholder="https://example.com/video.mp4"
                            // type="url"
                            value={data.url} onChange={(e) => setData('url', e.target.value)} />
                            </div>
                            <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1" disabled={processing}>
                                {editingItem ? <><Edit className="h-4 w-4 mr-2" />
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Modifier</> : <><Plus className="h-4 w-4 mr-2" /> {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter</>}
                            </Button>
                            {editingItem && <Button variant="outline" type="button" onClick={resetForm}>Annuler</Button>}
                            </div>
                        </form>
                        </CardContent>
                    </Card>

            </div>
              )}

            {/* Liste des galeries */}
            <div className="md:col-span-2">
                {filteredItems.length === 0 ? (
                <div className="text-center py-10 border rounded-xl">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">Aucun élément</h3>
                    <p className="text-muted-foreground">Commencez par ajouter une image ou une vidéo.</p>
                </div>
                ) : (
                <Card>
                    <CardHeader>
                    <CardTitle>Galerie</CardTitle>
                    <CardDescription>Vos médias ajoutés</CardDescription>

                    </CardHeader>
                    <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="border rounded-lg overflow-hidden bg-white  dark:bg-accent/10 shadow"
                        >
                            <div className="aspect-video relative">
                            {item.type === 'image' ? (
                                <img
                                src={item.url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                src={item.url}
                                controls
                                className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                                {item.type === 'image' ? (
                                <Image className="h-4 w-4" />
                                ) : (
                                <Film className="h-4 w-4" />
                                )}
                            </div>
                            </div>
                            <div className="p-3 flex justify-between items-start">
                            <div>
                                <h3 className="font-medium text-sm">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                {item.category?.name}
                                </p>
                            </div>
                            {(isAdmin || isEditor) && (
                                <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(item)}
                                >
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
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2 mt-6">
                        {items.links.map((link, idx) => (
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
                )}
            </div>
            </div>


        <ConfirmModal
            open={showConfirmModal}
            title="Confirmation"
            message="Êtes-vous sûr de vouloir supprimer cet élément ?"
            onCancel={() => setShowConfirmModal(false)}
            onConfirm={confirmDelete}
        />
        </div>

    </AppLayout>
  );
}
