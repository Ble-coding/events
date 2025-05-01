import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
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
}


  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };


export default function VenueManager() {
  const { venues, auth, flash } = usePage<PageProps>().props;
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
  const [minCapacity, setMinCapacity] = useState<number | ''>('');
  const [maxCapacity, setMaxCapacity] = useState<number | ''>('');

  const [search, setSearch] = useState('');
  const [editingVenue, setEditingVenue] = useState<VenueType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<number | null>(null);

  const { data, setData, processing, reset } = useForm<{
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

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
          toast({ title: 'Salle modifiée avec succès' });
          resetForm();
          router.reload();
        },
      });
    } else {
      router.post('/venues-dashboard', formData, {
        forceFormData: true,
        onSuccess: () => {
          toast({ title: 'Salle ajoutée avec succès' });
          resetForm();
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
        onSuccess: () => {
          toast({ title: 'Salle supprimée' });
          setShowConfirmModal(false);
          setVenueToDelete(null);
        },
      });
    }
  };
  const filteredVenues = venues.data.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(search.toLowerCase()) ||
      venue.location.toLowerCase().includes(search.toLowerCase());

    const matchesMinCapacity = minCapacity === '' || venue.capacity >= minCapacity;
    const matchesMaxCapacity = maxCapacity === '' || venue.capacity <= maxCapacity;


    // Ajoute la logique de filtrage par statut
  const matchesStatusFilter =
  statusFilter === 'all' ||
  (statusFilter === 'active' && venue.is_active) ||
  (statusFilter === 'expired' && !venue.is_active);

return matchesSearch && matchesMinCapacity && matchesMaxCapacity && matchesStatusFilter;
});

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
                <Label>Nom</Label>
                <Input
                placeholder="Le Domaine Viticole"
                value={data.name} onChange={(e) => setData('name', e.target.value)} required />

                <Label>Capacité</Label>
                <Input
                  type="number" placeholder="250 personnes"
                  value={data.capacity}
                  onChange={(e) => setData('capacity', Number(e.target.value))}
                  min={0}
                  required
                />

                <Label>Lieu</Label>
                <Input  placeholder='Le Domaine Viticole, 123 Rue de la Vigne, 75000 Paris'
                value={data.location} onChange={(e) => setData('location', e.target.value)} required />

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

                <Label>Fichier</Label>
                <Input
                  type="file"
                  accept={data.type === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setData('file', e.target.files?.[0] || null)}
                />

                <Label>Ou URL</Label>
                <Input  placeholder="https://example"
                value={data.url} onChange={(e) => setData('url', e.target.value)} />

                <Label>Description</Label>
                <Textarea
                placeholder="Un domaine viticole prestigieux offrant un cadre authentique entre vignes et chais historiques. La salle de réception en pierre et bois allie charme rustique et élégance."
                 value={data.description} onChange={(e) => setData('description', e.target.value)} />


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

                <Button type="submit" disabled={processing} className="w-full">
                  {processing ? <LoaderCircle className="h-4 w-4 animate-spin mx-auto" /> : editingVenue ? <><Edit className="h-4 w-4 mr-2" />Modifier</> : <><Plus className="h-4 w-4 mr-2" />Ajouter</>}
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

                               <div className="flex justify-center gap-2 mt-6">
                                      {venues.links.map((link, idx) => (
                                        <Button key={idx} variant={link.active ? 'default' : 'outline'} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} onClick={() => handlePageChange(link.url)} />
                                      ))}
                                    </div>
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
