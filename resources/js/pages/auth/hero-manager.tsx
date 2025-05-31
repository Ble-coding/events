import React, {
    // useEffect,
    useState, useMemo } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import ConfirmModal from '@/components/confirm-modal';
import { Edit, Plus, Trash2, LoaderCircle } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';

interface Slide {
  id: number;
  title: string;
  description: string;
  url: string;
  button1_text: string;
  button1_href: string;
  button2_text: string;
  button2_href: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }


interface PageProps {
//   slides: Slide[];
  slides: {
    data: Slide[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
  };

  flash?: {
    success?: string;
  };
  allSlides?: Slide[];
  errors?: Record<string, string>;
  [key: string]: unknown;
}

 const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };


export default function HeroManager() {
  const { slides, flash, errors, allSlides } = usePage<PageProps>().props;
//   const { toast } = useToast();
const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
    const [flashError, setFlashError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

   const hasSearch = search.trim().length > 0;


    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();

      const list = Array.isArray(allSlides) ? allSlides : slides.data;


      if (!term) return slides.data;

      return list.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }, [search, slides.data, allSlides]);

  const [editing, setEditing] = useState<Slide | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [toDelete, setToDelete] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, reset
    // , processing
 } = useForm({
    title: '',
    description: '',
    url: '',
    button1_text: '',
    button1_href: '',
    button2_text: '',
    button2_href: '',
    file: null as File | null,
  });

   const breadcrumbs: BreadcrumbItem[] = [
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Nos Slides', href: '/heroes-dashboard' },
        ];


//   useEffect(() => {
//     if (flash?.success) {
//       toast({ title: flash.success });
//     }
//     // if (flash?.error) {
//     //   toast({ title: flash.error, variant: 'destructive' });
//     // }
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

  const openModal = (slide?: Slide) => {
    if (slide) {
      setEditing(slide);
      setData({
        title: slide.title,
        description: slide.description,
        url: slide.url,
        button1_text: slide.button1_text,
        button1_href: slide.button1_href,
        button2_text: slide.button2_text,
        button2_href: slide.button2_href,
        file: null,
      });
    } else {
      reset();
      setEditing(null);
    }
    setShowFormModal(true);
  };

  const closeModal = () => {
    reset();
    setEditing(null);
    setShowFormModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const isEditing = !!editing;
    const url = isEditing ? `/heroes-dashboard/${editing.id}` : '/heroes-dashboard';

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('button1_text', data.button1_text);
    formData.append('button1_href', data.button1_href);
    formData.append('button2_text', data.button2_text);
    formData.append('button2_href', data.button2_href);
    if (data.file) formData.append('file', data.file);
    if (data.url) formData.append('url', data.url);
    if (isEditing) formData.append('_method', 'put');

    router.post(url, formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        closeModal();
        setIsSubmitting(false);
      },
      onError: () => {
        setIsSubmitting(false);
      },
    });
  };

  const confirmDelete = () => {
    if (toDelete !== null) {
      router.delete(`/heroes-dashboard/${toDelete}`, {
        preserveScroll: true,
      });
      setShowConfirmModal(false);
      setToDelete(null);
    }
  };

//   const filtered = slides.filter((s) =>
//     s.title.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Slides" />

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Slides du Hero</h1>
          <Button className="bg-[#EA7A0B] text-white hover:dark:bg-[#EA3A0C]" onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" /> Ajouter
          </Button>
        </div>

        <Input
          placeholder="Rechercher un titre"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Liste des Slides</CardTitle>
            <CardDescription>Gérez les slides affichés dans le hero de la page d'accueil.</CardDescription>
          </CardHeader>
          <CardContent>
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

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border bg-[#EA7A0B] text-white px-2 py-1">Titre</th>
                    <th className="border bg-[#EA7A0B] text-white px-2 py-1">Description</th>
                    <th className="border bg-[#EA7A0B] text-white px-2 py-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="border px-2 py-1 font-medium">{s.title}</td>
                      <td className="border px-2 py-1">{s.description}</td>
                      <td className="border px-2 py-1">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openModal(s)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setToDelete(s.id);
                            setShowConfirmModal(true);
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                    {filtered.length === 0 && (
                        <tr>
                        <td colSpan={3} className="text-center py-4">
                            Aucun résultat trouvé.
                        </td>
                        </tr>
                    )}
                </tbody>
              </table>
              {!hasSearch && (
  <div className="flex justify-center gap-2 mt-6">
    {slides.links.map((link, idx) => (
      <Button
        key={idx}
        variant={link.active ? 'default' : 'outline'}
        disabled={!link.url}
        dangerouslySetInnerHTML={{ __html: link.label }}
        onClick={() => handlePageChange(link.url)}
      />
    ))}
  </div>
)} {/* ✅ fermeture ici */}

            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent className="overflow-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{editing ? 'Modifier' : 'Ajouter'} un Slide</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
          <div>
          <Label>Titre</Label>
          <Input value={data.title}
          placeholder='Titre du slide'
          onChange={(e) => setData('title', e.target.value)} />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>
            <div>
            <Label>Description</Label>
            <Textarea value={data.description}
            placeholder="Description du slide"
            onChange={(e) => setData('description', e.target.value)} />
            {errors.description && <p className="text-red-500">{errors.description}</p>}
            </div>
            <div>
            <Label>Image (Fichier)</Label>
            <Input type="file" accept="image/*" onChange={(e) => setData('file', e.target.files?.[0] || null)} />
            {errors.file && <p className="text-red-500">{errors.file}</p>}
            </div>
            <div>
            <Label>Ou URL de l'image</Label>
            <Input  placeholder='https://example.com/image.jpg'
            value={data.url} onChange={(e) => setData('url', e.target.value)} />
            {errors.url && <p className="text-red-500">{errors.url}</p>}
            </div>
            <div>
            <Label>Bouton 1 - Texte</Label>
            <Input
            placeholder='Texte du bouton 1'
             value={data.button1_text} onChange={(e) => setData('button1_text', e.target.value)} />
            {errors.button1_text && <p className="text-red-500">{errors.button1_text}</p>}
            </div>
            <div>

            <Label>Bouton 1 - Lien</Label>
            <Input
            placeholder='https://example.com'
            value={data.button1_href} onChange={(e) => setData('button1_href', e.target.value)} />
            {errors.button1_href && <p className="text-red-500">{errors.button1_href}</p>}
            </div>
            <div>

            <Label>Bouton 2 - Texte</Label>
            <Input
              placeholder='Texte du bouton 2'
              value={data.button2_text} onChange={(e) => setData('button2_text', e.target.value)} />
            {errors.button2_text && <p className="text-red-500">{errors.button2_text}</p>}
            </div>
            <div>

            <Label>Bouton 2 - Lien</Label>
            <Input
              placeholder='https://example.com'
               value={data.button2_href} onChange={(e) => setData('button2_href', e.target.value)} />
            {errors.button2_href && <p className="text-red-500">{errors.button2_href}</p>}
            </div>


            <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="bg-[#EA7A0B] text-white dark:text-white hover:bg-[#EA3A0C]">
  {isSubmitting && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
  {editing ? 'Modifier' : 'Ajouter'}
</Button>

              {/* <Button type="submit" disabled={processing} className="bg-[hsl(var(--color-snci-green))]
               text-white dark:text-white hover:bg-[#EA7A0B]">
                {processing && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />} {editing ? 'Modifier' : 'Ajouter'}
              </Button> */}
              <Button type="button" variant="outline" onClick={closeModal}>Annuler</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={showConfirmModal}
        title="Confirmer la suppression"
        message="Voulez-vous vraiment supprimer ce slide ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
