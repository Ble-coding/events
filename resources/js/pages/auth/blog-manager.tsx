import React, {
    // useEffect,
    useState,  useMemo
    // useState
 } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ConfirmModal from '@/components/confirm-modal';
import { Edit, Trash2, LoaderCircle, Plus, Upload, Film, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';
// import Editor from '@/components/editor';

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
  errors?: Record<string, string>;
  categories: { id: number; name: string }[];
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash?: { success?: string };
  [key: string]: unknown;
  allblogItems: BlogType[];
}

export default function BlogManager() {
  const { blogs, auth, flash, categories, errors, allblogItems } = usePage<PageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const { toast } = useToast();
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';



//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

    //    const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
      const [flashError, setFlashError] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
    //   const hasSearch = search.trim().length > 0;

      const [searchTitle, setSearchTitle] = useState('');
      const [searchDate, setSearchDate] = useState('');
      const [searchStatus, setSearchStatus] = useState<'all' | 'true' | 'false'>('all');


      const isFiltering =
  searchTitle.trim() !== '' ||
  searchDate.trim() !== '' ||
  searchStatus !== 'all' ||
  selectedCategory !== 'all';



  const { data, setData, reset
    // , processing
} = useForm<{
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





  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blogs', href: '/blogs-dashboard' },
  ];


  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = data.content;
    const selectedText = currentContent.substring(start, end);
    let newContent = '';

    switch (tag) {
      case 'p':
        newContent = `<p>${selectedText || 'Votre paragraphe ici'}</p>`;
        break;
      case 'h2':
        newContent = `<h2>${selectedText || 'Votre titre ici'}</h2>`;
        break;
      case 'ul':
        newContent = `<ul>\n  <li>${selectedText || 'Élément de liste'}</li>\n  <li>Autre élément</li>\n</ul>`;
        break;
      case 'ol':
        newContent = `<ol>\n  <li>${selectedText || 'Premier élément'}</li>\n  <li>Deuxième élément</li>\n</ol>`;
        break;
      case 'blockquote':
        newContent = `<blockquote>${selectedText || 'Votre citation ici'}</blockquote>`;
        break;
      case 'strong':
        newContent = `<strong>${selectedText || 'Texte en gras'}</strong>`;
        break;
      case 'em':
        newContent = `<em>${selectedText || 'Texte en italique'}</em>`;
        break;
      default:
        return;
    }

    const updatedContent =
      currentContent.substring(0, start) +
      newContent +
      currentContent.substring(end);

    setData('content', updatedContent);

    setTimeout(() => {
      textarea.focus();
      const newPosition = start + newContent.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
            // closeModal();
            setIsSubmitting(false);
            resetForm();
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
    } else {
      router.post('/blogs-dashboard', formData, {
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
    // setEditorKey((prev) => prev + 1);
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



    const confirmDelete = () => {
      if (blogToDelete !== null) {
        router.delete(`/blogs-dashboard/${blogToDelete}`, {
          onSuccess: () => toast({ title: 'Blog supprimé avec succès.' }),
        });
        setBlogToDelete(null);
        setShowConfirmModal(false);
      }
    };

    const filtered = useMemo(() => {
        return allblogItems.filter((blog) => {
          const matchesTitle = blog.title.toLowerCase().includes(searchTitle.toLowerCase());
          const matchesDate = searchDate === '' || blog.date.includes(searchDate);
          const matchesStatus =
            searchStatus === 'all' ||
            (searchStatus === 'true' && blog.is_active) ||
            (searchStatus === 'false' && !blog.is_active);
          const matchesCategory =
            selectedCategory === 'all' || blog.category_id === selectedCategory;

          return matchesTitle && matchesDate && matchesStatus && matchesCategory;
        });
      }, [allblogItems, searchTitle, searchDate, searchStatus, selectedCategory]);


  const activeBlogsCount = blogs.data.filter((blog) => blog.is_active).length;
  const expiredBlogsCount = blogs.data.filter((blog) => !blog.is_active).length;

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };


  const blogsToDisplay = isFiltering ? filtered : blogs.data;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Blogs" />

      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-end mb-4 gap-2">
          {/* <Input
            placeholder="Rechercher par titre..."
            className="w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
           {/* <Select
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
                      </Select> */}
        </div>




          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(isAdmin || isEditor) && (
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




<Card>
               <CardHeader className="pb-3">
                 <h3 className="text-lg font-medium">Contenu de l'article</h3>
                 <div className="flex flex-wrap gap-2 mt-2">
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('p')}>Paragraphe</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('h2')}>Titre</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('ul')}>Liste</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('ol')}>Liste numérotée</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('blockquote')}>Citation</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('strong')}>Gras</Button>
                   <Button type="button" variant="outline" size="sm" onClick={() => insertHtmlTag('em')}>Italique</Button>
                 </div>
               </CardHeader>
               <CardContent>
                 <div className="space-y-2">
                   <Label htmlFor="content">Contenu (HTML)</Label>
                   <Textarea
  id="content"
  value={data.content}
  onChange={(e) => setData('content', e.target.value)}
  placeholder="<p>Contenu de l'article en HTML...</p>"
  rows={15}
  className="font-mono text-sm"
/>

                   {errors?.content && <span className="text-red-600">{errors.content}</span>}
                   <p className="text-sm text-gray-500 dark:text-white">
                     Utilisez les boutons ci-dessus pour insérer des balises HTML ou écrivez directement en HTML.
                   </p>
                 </div>
               </CardContent>

             </Card>

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
  value={data.category_id ? String(data.category_id) : ''}
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


                                              <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                                                                     {editingBlog ? (
                                                                       <><Edit className="h-4 w-4 mr-2" />
                                                                       {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                                        Modifier</>
                                                                     ) : (
                                                                       <><Plus className="h-4 w-4 mr-2" />
                                                                       {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                                       Ajouter</>
                                                                     )}
                                                                   </Button>


                                             {editingBlog && <Button variant="outline" type="button" onClick={resetForm}>Annuler</Button>}
                                             </div>
                </form>
              </CardContent>
            </Card>
        )}
            {/* Liste Blogs */}
            <div className="md:col-span-2">
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
              <Card>
                <CardHeader>
                  <CardTitle>Liste des Blogs</CardTitle>
                  {activeBlogsCount} Publié{activeBlogsCount > 1 ? 's' : ''} - {expiredBlogsCount} Brouillon{expiredBlogsCount > 1 ? 's' : ''}
                </CardHeader>
                <CardContent>
                {/* <div className="flex gap-2 mb-6">
  <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')}>
    Tous
  </Button>
  <Button variant={statusFilter === 'active' ? 'default' : 'outline'} onClick={() => setStatusFilter('active')}>
    Publiés
  </Button>
  <Button variant={statusFilter === 'expired' ? 'default' : 'outline'} onClick={() => setStatusFilter('expired')}>
    Brouillons
  </Button>
</div> */}
<div className="flex flex-wrap gap-2 mb-4">
  <Input
    placeholder="Rechercher par titre..."
    className="w-full sm:w-auto"
    value={searchTitle}
    onChange={(e) => setSearchTitle(e.target.value)}
  />

  <Input
    type="date"
    className="w-full sm:w-auto"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
  />

  <Select
    value={searchStatus}
    onValueChange={(val) => setSearchStatus(val as 'all' | 'true' | 'false')}
  >
    <SelectTrigger className="w-[150px]">
      <SelectValue placeholder="Statut" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tous</SelectItem>
      <SelectItem value="true">Publiés</SelectItem>
      <SelectItem value="false">Brouillons</SelectItem>
    </SelectContent>
  </Select>

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


{blogsToDisplay.length === 0 ? (
  <div className="text-center py-10">
    <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
    <h3 className="text-lg font-medium">Aucun blog trouvé</h3>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {blogsToDisplay.map((blog) => (
      <div key={blog.id} className="border rounded-lg p-4 shadow">
        <div className="aspect-video relative">
          {blog.type === 'image' ? (
            <img src={blog.url} alt={blog.title} className="w-full h-full object-cover" />
          ) : (
            <video src={blog.url} controls className="w-full h-full object-cover" />
          )}
          <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
            {blog.type === 'image' ? <Image className="h-4 w-4" /> : <Film className="h-4 w-4" />}
          </div>
        </div>
        <h3 className="font-bold">{blog.title}</h3>
        <p className="text-xs text-primary">{blog.category?.name}</p>
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

{!isFiltering && (
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
)}

                </CardContent>
              </Card>
            </div>
          </div>


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
