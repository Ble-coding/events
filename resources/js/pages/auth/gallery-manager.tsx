import React, {
    // useEffect,
    useState, useMemo } from 'react';
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
// import { useToast } from '@/components/ui/use-toast';
import {
    Plus,
     Edit, Trash2, Film, Image, Upload } from 'lucide-react';
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
  allgalleryItems: GalleryItemType[];
  categories: { id: number; name: string }[];
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash: { success?: string };
  [key: string]: unknown;
  errors?: Record<string, string>;
}

export default function GalleryDashboard() {
//   const { toast } = useToast();
  const { items, categories, flash, auth, allgalleryItems,
    errors,
   } = usePage<PageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editingItem, setEditingItem] = useState<GalleryItemType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
  const [flashError, setFlashError] = useState<string | null>(null);


  const hasSearch = search.trim().length > 0;
// const hasSearch = search.trim() !== '' || selectedCategory !== 'all';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, reset,
    // processing
} = useForm({
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

//   useEffect(() => {
//     if (flash?.success) {
//       toast({ title: flash.success });
//     }
//   }, [flash, toast]);
const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allgalleryItems.filter((item) => {
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.category?.name?.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === 'all' ||
        Number(item.category_id) === Number(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, allgalleryItems]);



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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
        // onSuccess: () => {
        //   toast({ title: 'Média modifié avec succès' });
        //   resetForm();
        //   router.reload();
        // },
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
    } else {
      router.post('/gallery', formData, {
        forceFormData: true,
        // onSuccess: () => {
        //   toast({ title: `${data.type === 'image' ? 'Image' : 'Vidéo'} ajoutée avec succès` });
        //   resetForm();
        // },
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
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
      setShowConfirmModal(false);
      setItemToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

//   const filteredItems = items.data.filter(
//     (item) =>
//       item.title.toLowerCase().includes(search.toLowerCase())
//   )
//   .filter((event) => {
//     if (selectedCategory === 'all') return true;
//     return event.category_id === selectedCategory;
//   });

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
                                  {errors?.title && <p className="text-red-500">{errors.title}</p>}
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
                            {/* {errors?.category_id && <p className="text-red-500">{errors.category_id}</p>} */}
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
                                  {errors?.url && <p className="text-red-500">{errors.url}</p>}
                            </div>
                            <div className="flex gap-2 pt-2">
                            <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                        {editingItem ? (
                          <><Edit className="h-4 w-4 mr-2" />
                          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                           Modifier</>
                        ) : (
                          <><Plus className="h-4 w-4 mr-2" />
                          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                          Ajouter</>
                        )}
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
            {(hasSearch ? filtered : items.data).length === 0 ? (
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
        {(hasSearch ? filtered : items.data).map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden bg-white dark:bg-accent/10 shadow"
          >
            <div className="aspect-video relative">
              {item.type === 'image' ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <video src={item.url} controls className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                {item.type === 'image' ? <Image className="h-4 w-4" /> : <Film className="h-4 w-4" />}
              </div>
            </div>
            <div className="p-3 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.category?.name}</p>
              </div>
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
            </div>
          </div>
        ))}
      </div>

      {/* Pagination uniquement si pas de recherche */}
      {!hasSearch && (
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
      )}
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
