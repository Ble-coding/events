import React, { useMemo, useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import { Textarea } from '@/components/ui/textarea';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-react';

interface ServiceType {
  id: number;
  name: string;
}

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  image?: string;
  type: ServiceType;
  features?: string[]; // ✅ Ajouté ici
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  types: ServiceType[];
  items: {
    data: ServiceItem[];
    links: PaginationLink[];
  };
  auth: {
    user: {
      role: 'admin' | 'editor' | 'viewer';
    };
  };
  [key: string]: unknown;
  flash?: {
    success?: string;
  };
  allserviceItems:  ServiceItem[];
  errors?: Record<string, string>;
}

export default function ServiceDashboard() {
//   const { toast } = useToast();
  const { types, items, flash, allserviceItems, errors , auth } = usePage<PageProps>().props;

  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [search, setSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [featureList, setFeatureList] = useState<string[]>(['']);
   const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
      const [flashError, setFlashError] = useState<string | null>(null);


      const hasSearch = search.trim().length > 0;
      const [isSubmitting, setIsSubmitting] = useState(false);


const handleAddFeature = () => setFeatureList([...featureList, '']);

const handleRemoveFeature = (index: number) => {
    const newList = [...featureList];
    newList.splice(index, 1);
    setFeatureList(newList);
  };

  const handleChangeFeature = (index: number, value: string) => {
    const newList = [...featureList];
    newList[index] = value;
    setFeatureList(newList);
  };
  const { data, setData, reset,
    // processing,
    // errors
} = useForm({
    title: '',
    description: '',
    type_id: '',
    image: null as File | null,
    features: [] as string[], // 👈 ajouter ceci
  });

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
//   const isViewer = auth.user.role === 'viewer';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Services', href: '/services-dashboard' },
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


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type_id', data.type_id);

    if (data.image) {
      formData.append('image', data.image);
    }

    // On envoie chaque élément de features individuellement
    featureList.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });

    if (editing) {
      formData.append('_method', 'PUT'); // Laravel comprend PUT via POST + _method
      router.post(`/services-dashboard/${editing.id}`, formData, {
        forceFormData: true,
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
    } else {
      router.post('/services-dashboard', formData, {
        forceFormData: true,
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
    }
  };


  const resetForm = () => {
    reset();
    setEditing(null);
    setFeatureList(['']);
  };


  const handleEdit = (item: ServiceItem) => {
    setEditing(item);
    setData({
      title: item.title,
      description: item.description,
      type_id: item.type.id.toString(),
      image: null,
      features: item.features || [], // ✅ Ajouté ici
    });
    setFeatureList(item.features && item.features.length > 0 ? item.features : ['']);
  };


  const confirmDelete = () => {
    if (toDeleteId !== null) {
      router.delete(`/services-dashboard/${toDeleteId}`, {
         onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
      setToDeleteId(null);
      setShowConfirmModal(false);
    }
  };


    const filtered = useMemo(() => {
      const term = search.trim().toLowerCase();

      const list = allserviceItems ?? items.data; // ✅ fallback sécurisé

      if (!term) return items.data;

      return list.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.type.name.toLowerCase().includes(search.toLowerCase())

      //   p.url.toLowerCase().includes(term)
      );
    }, [search, items.data, allserviceItems]);

//   const filteredItems = items.data.filter((item) =>
//     item.title.toLowerCase().includes(search.toLowerCase()) ||
//     item.description?.toLowerCase().includes(search.toLowerCase()) ||
//     item.type.name.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services" />

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(isAdmin || isEditor) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editing ? 'Modifier' : 'Ajouter'} un service</CardTitle>
                  <CardDescription>
                    {editing ? 'Modifier les infos du service' : 'Créer un nouveau service'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                      <Label>Titre</Label>
                      <Input value={data.title}  onChange={(e) => setData('title', e.target.value)}
                      placeholder="Coffrets cadeaux" />
{errors?.title && <p className="text-red-500">{errors.title}</p>}
                    </div>
                    <div>
                      <Label>Description</Label>
                      {/* <Input value={data.description}  onChange={(e) => setData('description', e.target.value)} />
                        */}

                       <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Offrez des coffrets élégants"
                    />
{errors?.description && <p className="text-red-500">{errors.description}</p>}
                    </div>
                    <div>
                      <Label>Type</Label>
                      <Select value={data.type_id} onValueChange={(value) => setData('type_id', value)}>
                        <SelectTrigger><SelectValue placeholder="Choisir un type" /></SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                        {errors.type_id && <p className="text-sm text-red-500 mt-1">{errors.type_id}</p>}
                    </div>
                    <div>
                      <Label>Image</Label>
                      <Input type="file" accept="image/*" onChange={(e) => setData('image', e.target.files?.[0] || null)} />
                        {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
                    </div>
                    <div>
  <Label>Fonctionnalités (features)</Label>
  {featureList.map((feature, index) => (
    <div key={index} className="flex gap-2 mb-2">
      <Input
        value={feature}
        onChange={(e) => handleChangeFeature(index, e.target.value)}
        placeholder="Ex: Coordination avec les lieux de culte"
      />
      <Button
        type="button"
        variant="destructive"
        onClick={() => handleRemoveFeature(index)}
        disabled={featureList.length === 1} // empêcher suppression si 1 seul champ
      >
        X
      </Button>
    </div>
  ))}
  <Button type="button" variant="outline" onClick={handleAddFeature}>
    Ajouter une fonctionnalité
  </Button>
</div>


                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {editing ? <><Edit className="w-4 h-4 mr-2" />
                        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Modifier</> : <><Plus className="w-4 h-4 mr-2" />
                        {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter</>}
                      </Button>


                      {editing && (
                        <Button variant="outline" onClick={resetForm}>Annuler</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Liste des services</CardTitle>

                {/* <div className="flex justify-end">
          <Input
            placeholder="Rechercher un service..."
            className="w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div> */}
                <div className="pt-2">
                                  <Input
                                    placeholder="Rechercher une question..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                  />
                                </div>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {filtered.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        <p className="text-xs italic text-primary">{item.type.name}</p>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-32 h-20 object-cover mt-2 rounded"
                          />
                        )}
                        {item.features && item.features.length > 0 && (
                        <ul className="text-xs mt-2 list-disc list-inside text-muted-foreground">
                            {item.features.map((f, idx) => (
                            <li key={idx}>{f}</li>
                            ))}
                        </ul>
                        )}

                      </div>
                      {(isAdmin || isEditor) && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => {
                              setToDeleteId(item.id);
                              setShowConfirmModal(true);
                            }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {!hasSearch && (    <div className="flex justify-center mt-6 gap-2 flex-wrap">
              {items.links.map((link, index) => (
                <Button
                  key={index}
                  variant={link.active ? 'default' : 'outline'}
                  disabled={!link.url}
                  onClick={() => {
                    if (link.url) router.get(link.url);
                  }}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className="min-w-[36px]"
                />
              ))}
            </div>  )}
          </div>
        </div>

        <ConfirmModal
          open={showConfirmModal}
          title="Confirmation"
          message="Supprimer ce service ?"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </AppLayout>
  );
}
