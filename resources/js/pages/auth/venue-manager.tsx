import React, {
    // useEffect,
    useState,
useMemo } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ConfirmModal from '@/components/confirm-modal'
import { Edit, Trash2, LoaderCircle, Plus, Film, Image, Upload } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';
import type { BreadcrumbItem } from '@/types';

interface VenueType {
  id: number;
  name: string;
  capacity: number;
  location: string;
  url: string;
  type: 'image' | 'video';
  description: string;
  features?: string[];
  availables?: string[];
  is_active: boolean;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  venues: {
    data: VenueType[];
    links: PaginationLink[];
  };
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash?: { success?: string };
  [key: string]: unknown;
  allvenuItems: VenueType[]
  errors?: Record<string, string>;
}


  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };


export default function VenueManager() {
  const { venues, auth, flash, allvenuItems, errors } = usePage<PageProps>().props;
//   const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
  const [minCapacity, setMinCapacity] = useState<number | ''>('');
  const [maxCapacity, setMaxCapacity] = useState<number | ''>('');
   const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
        const [flashError, setFlashError] = useState<string | null>(null);
     const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const hasSearch = search.trim().length > 0;
  const [editingVenue, setEditingVenue] = useState<VenueType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<number | null>(null);

  const { data, setData,
    // processing,
    reset } = useForm<{
    name: string;
    capacity: number;
    location: string;
    type: 'image' | 'video';
    url: string;
    file: File | null;
    description: string;
    features: string[];
    availables: string[];
    is_active: boolean;
  }>({
    name: '',
    capacity: 0,
    location: '',
    type: 'image',
    url: '',
    file: null,
    description: '',
    features: [],
    availables: [],
    is_active: false,
  });

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Salles', href: '/venues-dashboard' },
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
    formData.append('name', data.name);
    formData.append('capacity', data.capacity.toString());
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('description', data.description);
    formData.append('is_active', data.is_active ? '1' : '0'); // 🔥 snake_case ici aussi
    if (data.file) formData.append('file', data.file);
    if (data.url) formData.append('url', data.url);
    formData.append('features', JSON.stringify(data.features));
    formData.append('availables', JSON.stringify(data.availables)); // 🔥 snake_case aussi ici

    if (editingVenue) {
      formData.append('_method', 'PUT');
      router.post(`/venues-dashboard/${editingVenue.id}`, formData, {
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
      router.post('/venues-dashboard', formData, {
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


  const resetForm = () => {
    setData({
      name: '',
      capacity: 0,
      location: '',
      type: 'image',
      url: '',
      file: null,
      description: '',
      features: [], // ✅ pas null
    availables: [], // ✅ pas null
    is_active: true,
    });
    reset();
    setEditingVenue(null);
  };

  const handleEdit = (venue: VenueType) => {
    setEditingVenue(venue);
    setData({
      name: venue.name,
      capacity: venue.capacity,
      location: venue.location,
      type: venue.type,
      url: venue.url,
      file: null,
      description: venue.description,
      features: venue.features ?? [], // ✅ FORCER un tableau
      availables: venue.availables ?? [],
      is_active: venue.is_active,
    });
  };

  const openDeleteModal = (id: number) => {
    setVenueToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (venueToDelete !== null) {
        router.delete(`/venues-dashboard/${venueToDelete}`, {
        // onSuccess: () => {
        //   toast({ title: 'Salle supprimée' });
        //   setShowConfirmModal(false);
        //   setVenueToDelete(null);
        // },
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
            setShowConfirmModal(false);
            setVenueToDelete(null);
          },
          onError: () => {
            setIsSubmitting(false);
            setShowConfirmModal(false);
            setVenueToDelete(null);
          },
      });
    }
  };
//   const filteredVenues = venues.data.filter((venue) => {
//     const matchesSearch =
//       venue.name.toLowerCase().includes(search.toLowerCase()) ||
//       venue.location.toLowerCase().includes(search.toLowerCase());

//     const matchesMinCapacity = minCapacity === '' || venue.capacity >= minCapacity;
//     const matchesMaxCapacity = maxCapacity === '' || venue.capacity <= maxCapacity;


//     // Ajoute la logique de filtrage par statut
//   const matchesStatusFilter =
//   statusFilter === 'all' ||
//   (statusFilter === 'active' && venue.is_active) ||
//   (statusFilter === 'expired' && !venue.is_active);

// return matchesSearch && matchesMinCapacity && matchesMaxCapacity && matchesStatusFilter;
// });
const venuesToFilter = hasSearch ? allvenuItems : venues.data;
const filteredVenues = useMemo(() => {
    const term = search.trim().toLowerCase();

    return venuesToFilter.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(term) ||
        venue.location.toLowerCase().includes(term);

      const matchesMinCapacity = minCapacity === '' || venue.capacity >= Number(minCapacity);
      const matchesMaxCapacity = maxCapacity === '' || venue.capacity <= Number(maxCapacity);

      const matchesStatusFilter =
        statusFilter === 'all' ||
        (statusFilter === 'active' && venue.is_active) ||
        (statusFilter === 'expired' && !venue.is_active);

      return matchesSearch && matchesMinCapacity && matchesMaxCapacity && matchesStatusFilter;
    });
  }, [venuesToFilter, search, minCapacity, maxCapacity, statusFilter]);
const activeVenuesCount = venues.data.filter((venue) => venue.is_active).length;
const expiredVenuesCount = venues.data.filter((venue) => !venue.is_active).length;
  const addFeature = () => setData('features', [...data.features, '']);
  const removeFeature = (index: number) => {
    const updated = [...data.features];
    updated.splice(index, 1);
    setData('features', updated);
  };
  const updateFeature = (index: number, value: string) => {
    const updated = [...data.features];
    updated[index] = value;
    setData('features', updated);
  };

  const addAvailableService = () => setData('availables', [...data.availables, '']);
  const removeAvailableService = (index: number) => {
    const updated = [...data.availables];
    updated.splice(index, 1);
    setData('availables', updated);
  };
  const updateAvailableService = (index: number, value: string) => {
    const updated = [...data.availables];
    updated[index] = value;
    setData('availables', updated);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion des Salles" />

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
        <div className="flex justify-end mb-4">
          <Input
            placeholder="Rechercher par nom ou lieu..."
            className="w-full max-w-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
            <Input
    type="number"
    placeholder="Capacité min"
    className="w-32"
    value={minCapacity}
    onChange={(e) => setMinCapacity(e.target.value === '' ? '' : Number(e.target.value))}
  />
  <Input
    type="number"
    placeholder="Capacité max"
    className="w-32"
    value={maxCapacity}
    onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
  />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(isAdmin || isEditor) && (
          <Card>
            <CardHeader>
              <CardTitle>{editingVenue ? 'Modifier' : 'Ajouter'} une salle</CardTitle>
              <CardDescription>Complétez les informations</CardDescription>
            </CardHeader>
            <CardContent>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                <Label>Nom</Label>
                <Input
                placeholder="Le Domaine Viticole"
                value={data.name} onChange={(e) => setData('name', e.target.value)}  />

                {errors?.name && <p className="text-red-500">{errors.name}</p>}
                </div>

               <div>
               <Label>Capacité</Label>
                <Input
                  type="number" placeholder="250 personnes"
                  value={data.capacity}
                  onChange={(e) => setData('capacity', Number(e.target.value))}
                  min={0}

                />
 {errors?.capacity && <p className="text-red-500">{errors.capacity}</p>}
               </div>

               <div>
               <Label>Lieu</Label>
                <Input  placeholder='Le Domaine Viticole, 123 Rue de la Vigne, 75000 Paris'
                value={data.location} onChange={(e) => setData('location', e.target.value)}  /> {errors?.location && <p className="text-red-500">{errors.location}</p>}

               </div>


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
                <Input  placeholder="https://example"
                value={data.url} onChange={(e) => setData('url', e.target.value)} />
{errors?.url && <p className="text-red-500">{errors.url}</p>}
</div>

<div>
<Label>Description</Label>
                <Textarea
                placeholder="Un domaine viticole prestigieux offrant un cadre authentique entre vignes et chais historiques. La salle de réception en pierre et bois allie charme rustique et élégance."
                 value={data.description} onChange={(e) => setData('description', e.target.value)} />
{errors?.description && <p className="text-red-500">{errors.description}</p>}
</div>



    {/* FEATURES */}
    <div className="space-y-2 pt-4">
        <Label>Caractéristiques</Label>
        {data.features.length === 0 ? (
            <div className="flex gap-2">
            <Input
                value=""
                placeholder="Capacité d'accueil, équipements disponibles"
                onChange={(e) => updateFeature(0, e.target.value)}
            />
            <Button
                type="button"
                variant="destructive"
                disabled
            >
                X
            </Button>
            </div>
        ) : (
            data.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
                <Input
                value={feature}
                placeholder="Capacité d'accueil, équipements disponibles"
                onChange={(e) => updateFeature(idx, e.target.value)}
                />
                <Button
                type="button"
                variant="destructive"
                onClick={() => removeFeature(idx)}
                disabled={data.features.length === 1}
                >
                X
                </Button>
            </div>
            ))
        )}
        <Button variant="outline" type="button" onClick={addFeature}>
            Ajouter une caractéristique
        </Button>
        </div>


            {/* AVAILABLE SERVICES */}
        <div className="space-y-2 pt-4">
        <Label>Services disponibles</Label>
        {data.availables.length === 0 ? (
            <div className="flex gap-2">
            <Input
                value=""
                placeholder="Location de matériel"
                onChange={(e) => updateAvailableService(0, e.target.value)}
            />
            <Button
                type="button"
                variant="destructive"
                disabled
            >
                X
            </Button>
            </div>
        ) : (
            data.availables.map((service, idx) => (
            <div key={idx} className="flex gap-2">
                <Input
                value={service}
                placeholder="Location de matériel"
                onChange={(e) => updateAvailableService(idx, e.target.value)}
                />
                <Button
                type="button"
                variant="destructive"
                onClick={() => removeAvailableService(idx)}
                disabled={data.availables.length === 1}
                >
                X
                </Button>
            </div>
            ))
        )}
        <Button variant="outline" type="button" onClick={addAvailableService}>
            Ajouter un service disponible
        </Button>
        </div>



                <div className="flex items-center gap-2 pt-4">
                  <Switch id="isActive" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked)} />
                  <Label htmlFor="isActive">Salle active ?</Label>
                </div>

                {/* <Button type="submit" disabled={processing} className="w-full">
                  {processing ? <LoaderCircle className="h-4 w-4 animate-spin mx-auto" /> : editingVenue ? <><Edit className="h-4 w-4 mr-2" />Modifier</> : <><Plus className="h-4 w-4 mr-2" />Ajouter</>}
                   </Button>*/}

                    <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                                              {editingVenue ? (
                                                <><Edit className="h-4 w-4 mr-2" />
                                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                 Modifier</>
                                              ) : (
                                                <><Plus className="h-4 w-4 mr-2" />
                                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Ajouter</>
                                              )}
                                            </Button>

              </form>
            </CardContent>
          </Card>
        )}
          {/* Liste des salles */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Liste des Salles</CardTitle>
                {activeVenuesCount} Disponible{activeVenuesCount > 1 ? 's' : ''} - {expiredVenuesCount} Indisponible{expiredVenuesCount > 1 ? 's' : ''}

              </CardHeader>
              <CardContent>
              <div className="flex gap-2 mb-6">
                <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                >
                Tous
                </Button>
                <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                >
                Disponibles
                </Button>
                <Button
                variant={statusFilter === 'expired' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('expired')}
                >
                Indisponibles
                </Button>
             </div>
                {filteredVenues.length === 0 ? (
                  <div className="text-center py-10">
                    <Upload className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Aucune salle trouvée</h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredVenues.map((venue) => (
                      <div key={venue.id} className="border rounded-lg p-4 shadow">
                         <div className="aspect-video relative">
                            {venue.type === 'image' ? (
                                <img
                                src={venue.url}
                                alt={venue.name}
                                className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                src={venue.url}
                                controls
                                className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                                {venue.type === 'image' ? (
                                <Image className="h-4 w-4" />
                                ) : (
                                <Film className="h-4 w-4" />
                                )}
                            </div>
                            </div>
                        <h3 className="font-bold">{venue.name}</h3>
                        <p className="text-sm text-muted-foreground">Capacité : {venue.capacity}</p>
                        <p className="text-sm text-muted-foreground">{venue.location}</p>
                        <p className="text-xs">{venue.description}</p>

                    {(isAdmin || isEditor) && (
                                           <div className="flex gap-2">
                                             <Button variant="ghost" size="icon" onClick={() => handleEdit(venue)}>
                                               <Edit className="h-4 w-4" />
                                             </Button>
                                             {isAdmin && (
                                               <Button variant="ghost" size="icon" onClick={() => openDeleteModal(venue.id)}>
                                                 <Trash2 className="h-4 w-4" />
                                               </Button>
                                             )}
                                           </div>
                                         )}
                      </div>
                    ))}
                  </div>
                )}
{!hasSearch && (
                               <div className="flex justify-center gap-2 mt-6">
                                      {venues.links.map((link, idx) => (
                                        <Button key={idx} variant={link.active ? 'default' : 'outline'} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} onClick={() => handlePageChange(link.url)} />
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
          message="Êtes-vous sûr de vouloir supprimer cette salle ?"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </AppLayout>
  );
}
