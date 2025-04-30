import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ConfirmModal from '@/components/confirm-modal';
import { Edit, Trash2, LoaderCircle, Plus, Upload, Film, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';
import Editor from '@/components/editor';

interface BlogType {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  type: 'image' | 'video';
  url: string;
  is_active: boolean;
  category_id: number;
  category: { id: number; name: string };
}

// interface Category {
//     id: number;
//     name: string;
//   }


interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  blogs: {
    data: BlogType[];
    links: PaginationLink[];
  };
  categories: { id: number; name: string }[];
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash?: { success?: string };
  [key: string]: unknown;
}

export default function BlogManager() {
  const { blogs, auth, flash, categories } = usePage<PageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const { toast } = useToast();
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);
  const [editorKey, setEditorKey] = useState(0);


  const { data, setData, reset, processing } = useForm<{
    title: string;
    category_id: number;
    excerpt: string;
    content: string;
    date: string;
    type: 'image' | 'video';
    url: string;
    file: File | null;
    is_active: boolean;
  }>({
    title: '',
    category_id: 0,
    excerpt: '',
    content: '',
    date: '',
    type: 'image',
    url: '',
    file: null,
    is_active: true,
  });




  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blogs', href: '/blogs-dashboard' },
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
    formData.append('excerpt', data.excerpt);
    formData.append('content', data.content);
    formData.append('date', data.date);
    formData.append('type', data.type);
    formData.append('is_active', data.is_active ? '1' : '0');
    formData.append('category_id', data.category_id.toString());

    formData.append('type', data.type);
    if (data.file) formData.append('file', data.file);
    if (data.url) formData.append('url', data.url);

    if (editingBlog) {
      formData.append('_method', 'PUT');
      router.post(`/blogs-dashboard/${editingBlog.id}`, formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: 'Blog modifié avec succès' });
          resetForm();
          router.reload();
        },
      });
    } else {
      router.post('/blogs-dashboard', formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: 'Blog ajouté avec succès' });
          resetForm();
        },
      });
    }
  };

  function formatDateToFrench(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }


  const resetForm = () => {
    setData({
      title: '',
      excerpt: '',
      content: '',
      date: '',
      type: 'image',
      url: '',
      file: null,
      is_active: true,
      category_id: 0,
    });
    reset();
    setEditingBlog(null);
    setEditorKey((prev) => prev + 1);
  };

  const handleEdit = (blog: BlogType) => {
    setEditingBlog(blog);

    const formattedDate = blog.date ? blog.date.split('T')[0] : '';

    setData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      date: formattedDate, // 🛠 ici
      type: blog.type,
      url: blog.url,
      file: null,
      is_active: blog.is_active,
      category_id: blog.category?.id ?? 0,
    });
  };


  const openDeleteModal = (id: number) => {
    setBlogToDelete(id);
    setShowConfirmModal(true);
  };

//   const confirmDelete = () => {
//     if (blogToDelete !== null) {
//       router.delete(`/blogs-dashboard/${blogToDelete}`, {
//         onSuccess: () => {
//           toast({ title: 'Blog supprimé' });
//           setShowConfirmModal(false);
//           setBlogToDelete(null);
//           router.visit('/blogs-dashboard');
//         },
//       });
//     }
//   };

    const confirmDelete = () => {
      if (blogToDelete !== null) {
        router.delete(`/blogs-dashboard/${blogToDelete}`, {
          onSuccess: () => toast({ title: 'Blog supprimé avec succès.' }),
        });
        setBlogToDelete(null);
        setShowConfirmModal(false);
      }
    };

  const filteredBlogs = blogs.data.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatusFilter =
      statusFilter === 'all' ||
      (statusFilter === 'active' && blog.is_active) ||
      (statusFilter === 'expired' && !blog.is_active);
    return matchesSearch && matchesStatusFilter;

  }) .filter((event) => {
    if (selectedCategory === 'all') return true;
    return event.category_id === selectedCategory;
  });

  const activeBlogsCount = blogs.data.filter((blog) => blog.is_active).length;
  const expiredBlogsCount = blogs.data.filter((blog) => !blog.is_active).length;

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Blogs" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-end mb-4 gap-2">
          <Input
            placeholder="Rechercher par titre..."
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

        {(isAdmin || isEditor) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{editingBlog ? 'Modifier' : 'Ajouter'} un blog</CardTitle>
                <CardDescription>Complétez les informations</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>  <Label>Titre</Label>
                  <Input value={data.title}
                  placeholder="Comment organiser un mariage éco-responsable"
                  onChange={(e) => setData('title', e.target.value)} required />
</div>

<div>
<Label>Résumé</Label>
                  <Input  placeholder="Guide pratique pour organiser un mariage qui respecte vos valeurs environnementales."
                  value={data.excerpt} onChange={(e) => setData('excerpt', e.target.value)} required />
</div>


<div>
<Label>Contenu</Label>
<Editor
  key={editorKey} // 🔥 ici important
  value={data.content}
  onChange={(value) => setData('content', value)}
/>

                  </div>

<div>  <Label>Date</Label>
<Input type="date" value={data.date} onChange={(e) => setData('date', e.target.value)} required /></div>


<div>
<Label>Type</Label>
                  <Select value={data.type} onValueChange={(val) => setData('type', val as 'image' | 'video')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                    </SelectContent>
                  </Select>
</div>


<div>
<Label>Fichier</Label>
                  <Input
                    type="file"
                    accept={data.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => setData('file', e.target.files?.[0] || null)}
                  />
</div>

<div>

<Label>Ou URL</Label>
                  <Input value={data.url}
                  placeholder='https://example.com/image.jpg'
                  onChange={(e) => setData('url', e.target.value)} />


</div>
<div>
  <Label>Catégorie</Label>
  <Select
    value={String(data.category_id)}
    onValueChange={(val) => setData('category_id', Number(val))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Choisir une catégorie" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((cat) => (
        <SelectItem key={cat.id} value={String(cat.id)}>
          {cat.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

                  <div className="flex items-center gap-2 pt-4">
                    <Switch
                      id="isActive"
                      checked={data.is_active}
                      onCheckedChange={(checked) => setData('is_active', checked)}
                    />
                    <Label htmlFor="isActive">Blog Publié ?</Label>
                  </div>

                  <div className="flex gap-2 pt-2">
                                             <Button type="submit" className="flex-1" disabled={processing}>
                                                 {editingBlog? <><Edit className="h-4 w-4 mr-2" />
                                                 {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Modifier</> : <><Plus className="h-4 w-4 mr-2" /> {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter</>}
                                             </Button>
                                             {editingBlog && <Button variant="outline" type="button" onClick={resetForm}>Annuler</Button>}
                                             </div>
                </form>
              </CardContent>
            </Card>

            {/* Liste Blogs */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Blogs</CardTitle>
                  {activeBlogsCount} Publié{activeBlogsCount > 1 ? 's' : ''} - {expiredBlogsCount} Brouillon{expiredBlogsCount > 1 ? 's' : ''}
                </CardHeader>
                <CardContent>
                <div className="flex gap-2 mb-6">
  <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>
    Tous
  </Button>
  <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>
    Publiés
  </Button>
  <Button variant={statusFilter === 'expired' ? 'default' : 'outline'} onClick={() => setStatusFilter('expired')}>
    Brouillons
  </Button>
</div>

                  {filteredBlogs.length === 0 ? (
                    <div className="text-center py-10">
                      <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Aucun blog trouvé</h3>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="border rounded-lg p-4 shadow">
                                <div className="aspect-video relative">
                                                        {blog.type === 'image' ? (
                                                            <img
                                                            src={blog.url}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <video
                                                            src={blog.url}
                                                            controls
                                                            className="w-full h-full object-cover"
                                                            />
                                                        )}
                                                        <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                                                            {blog.type === 'image' ? (
                                                            <Image className="h-4 w-4" />
                                                            ) : (
                                                            <Film className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        </div>
                          <h3 className="font-bold">{blog.title}</h3>
                          <p className="text-xs text-primary">
                                {blog.category?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{formatDateToFrench(blog.date)}</p>
                          <p className="text-xs" dangerouslySetInnerHTML={{ __html: blog.excerpt }}></p>

                          {(isAdmin || isEditor) && (
                            <div className="flex gap-2 mt-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={() => openDeleteModal(blog.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center gap-2 mt-6">
                    {blogs.links.map((link, idx) => (
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
        )}

        <ConfirmModal
          open={showConfirmModal}
          title="Confirmation"
          message="Êtes-vous sûr de vouloir supprimer ce blog ?"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </AppLayout>
  );
}
