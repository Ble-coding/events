import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
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
}

export default function ServiceDashboard() {
  const { toast } = useToast();
  const { types, items, flash, auth } = usePage<PageProps>().props;

  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [search, setSearch] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<number | null>(null);
  const [featureList, setFeatureList] = useState<string[]>(['']);

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
  const { data, setData, reset, processing, errors} = useForm({
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

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        onSuccess: resetForm,
      });
    } else {
      router.post('/services-dashboard', formData, {
        forceFormData: true,
        onSuccess: resetForm,
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
        onSuccess: () => toast({ title: 'Service supprimé avec succès.' }),
      });
      setToDeleteId(null);
      setShowConfirmModal(false);
    }
  };

  const filteredItems = items.data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description?.toLowerCase().includes(search.toLowerCase()) ||
    item.type.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Services" />

      <div className="flex flex-col gap-4 p-4">


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
                      <Input value={data.title} required onChange={(e) => setData('title', e.target.value)}
                      placeholder="Coffrets cadeaux" />

                    </div>
                    <div>
                      <Label>Description</Label>
                      {/* <Input value={data.description} required onChange={(e) => setData('description', e.target.value)} />
                        */}

                       <Textarea
                        id="description" required
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Offrez des coffrets élégants"
                    />

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
        Supprimer
      </Button>
    </div>
  ))}
  <Button type="button" onClick={handleAddFeature}>
    Ajouter une fonctionnalité
  </Button>
</div>


                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="flex-1" disabled={processing}>
                        {editing ? <><Edit className="w-4 h-4 mr-2" />
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Modifier</> : <><Plus className="w-4 h-4 mr-2" />
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />} Ajouter</>}
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
                  {filteredItems.map((item) => (
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
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
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
            </div>
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
