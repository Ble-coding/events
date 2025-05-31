import React, {
    useState,
    //  useEffect,
      useMemo
     } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch'; // import du Switch
// import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Upload, LoaderCircle, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface EventType {
  id: number;
  title: string;
  date: string;
  location: string;
  category_id: number;
  url: string;
  type: 'image' | 'video';
  description: string;
  schedule?: string[];
  highlights?: string[];
  isActive: boolean;
  category: { id: number; name: string };
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  events: {
    data: EventType[];
    links: PaginationLink[];
  };
  categories: { id: number; name: string }[];
  auth: { user: { role: 'admin' | 'editor' | 'viewer' } };
  flash: { success?: string };
  [key: string]: unknown;
  alleventItems: EventType[]
  errors?: Record<string, string>;
}

export default function EventManager() {
//   const { toast } = useToast();
  const { events, flash, auth, categories, errors, alleventItems } = usePage<PageProps>().props;
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [openMonths, setOpenMonths] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
      const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
      const [flashError, setFlashError] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [search, setSearch] = useState('');
    //   const hasSearch = search.trim().length > 0;
   const [errorMessage, setErrorMessage] = useState<string | null>(null);
   const hasSearchOrFilter =
   search.trim() !== '' || selectedCategory !== 'all' || statusFilter !== 'all';

  const { data, setData, reset
    // , processing
} = useForm<{
    title: string;
    date: string;
    location: string;
    type: 'image' | 'video';
    category_id: number;
    url: string;
    file: File | null;
    description: string;
    schedule: string[];
    highlights: string[];
    isActive: boolean;
  }>({
    title: '',
    date: '',
    category_id: 0,
    location: '',
    type: 'image',
    url: '',
    file: null,
    description: '',
    schedule: [],
    highlights: [],
    isActive: false, // ✔️ booléen normal
  });

  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Événements', href: '/events-dashboard' },
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
    formData.append('category_id', data.category_id.toString())
    formData.append('date', data.date);
    formData.append('location', data.location);
    formData.append('type', data.type);
    formData.append('description', data.description);
    formData.append('isActive', data.isActive ? '1' : '0'); // 🛠️ correction ici

    if (data.file) formData.append('file', data.file);
    if (data.url) formData.append('url', data.url);
    formData.append('schedule', JSON.stringify(data.schedule));
    formData.append('highlights', JSON.stringify(data.highlights));

    if (editingEvent) {
      formData.append('_method', 'PUT');
      router.post(`/events-dashboard/${editingEvent.id}`, formData, {
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
      router.post('/events-dashboard', formData, {
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
      title: '',
      category_id: 0,
      date: '',
      location: '',
      type: 'image',
      url: '',
      file: null,
      description: '',
      schedule: [],
      highlights: [],
      isActive: true,
    });
    reset();
    setEditingEvent(null);
  };

  const handleEdit = (event: EventType) => {
    setEditingEvent(event);
    setData({
      title: event.title,
      date: event.date,
      category_id: event.category ? event.category.id : 0,
      location: event.location,
      type: event.type,
      url: event.url,
      file: null,
      description: event.description,
      schedule: event.schedule || [],
      highlights: event.highlights || [],
      isActive: event.isActive,
    });
  };

  const openDeleteModal = (id: number) => {
    setEventToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    if (eventToDelete !== null) {
      router.delete(`/events-dashboard/${eventToDelete}`, {
        onSuccess: () => {
            // closeModal();
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
      });
      setShowConfirmModal(false);
      setEventToDelete(null);
    }
  };


  const handleIsActiveChange = (checked: boolean) => {
    setData('isActive', checked);

    const today = new Date();
    const eventDate = new Date(editingEvent?.date || data.date); // 👉 prend la date existante au besoin




    if (checked && eventDate < today) {
        setErrorMessage(null); // reset


            setErrorMessage('La date de l\'événement est déjà passée. L\'événement sera affiché comme expiré.');
            setIsSubmitting(false);

    }
  };

  const isEventCurrentlyActive = (event: EventType) => {
    const today = new Date();
    const eventDate = new Date(event.date);
    return event.isActive && eventDate >= today;
  };



  const isDatePast = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate < today;
  };
  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();

    return alleventItems.filter((event) => {
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.category?.name?.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === 'all' ||
        Number(event.category_id) === Number(selectedCategory);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && isEventCurrentlyActive(event)) ||
        (statusFilter === 'expired' && !isEventCurrentlyActive(event));

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [search, selectedCategory, statusFilter, alleventItems]);


//   const eventsToDisplay = hasSearch ? filteredEvents : events.data;

  const activeEventsCount = events.data.filter((event) => isEventCurrentlyActive(event)).length;
    const expiredEventsCount = events.data.filter((event) => !isEventCurrentlyActive(event)).length;


    const formatMonthYear = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', options); // "Juillet 2024"
      };
    //   const groupedEvents = filteredEvents.reduce<Record<string, EventType[]>>((groups, event) => {
    //     const monthYear = formatMonthYear(event.date);
    //     if (!groups[monthYear]) {
    //       groups[monthYear] = [];
    //     }
    //     groups[monthYear].push(event);
    //     return groups;
    //   }, {});



      const toggleMonth = (monthYear: string) => {
        setOpenMonths((prev) => {
          const isOpening = !prev[monthYear];

          // Si on ouvre et qu'on a une ref valide, scroll doucement
          if (isOpening && monthRefs.current[monthYear]) {
            monthRefs.current[monthYear]?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }

          return {
            ...prev,
            [monthYear]: isOpening,
          };
        });
      };



  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  const addSchedule = () => {
    setData('schedule', [...data.schedule, '']);
  };

  const removeSchedule = (index: number) => {
    const updated = [...data.schedule];
    updated.splice(index, 1);
    setData('schedule', updated);
  };

  const updateSchedule = (index: number, value: string) => {
    const updated = [...data.schedule];
    updated[index] = value;
    setData('schedule', updated);
  };

  const addHighlight = () => {
    setData('highlights', [...data.highlights, '']);
  };

  const removeHighlight = (index: number) => {
    const updated = [...data.highlights];
    updated.splice(index, 1);
    setData('highlights', updated);
  };

  const updateHighlight = (index: number, value: string) => {
    const updated = [...data.highlights];
    updated[index] = value;
    setData('highlights', updated);
  };



const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});

const eventsToDisplay = hasSearchOrFilter ? filteredEvents : events.data;

const groupedEvents = eventsToDisplay.reduce<Record<string, EventType[]>>((groups, event) => {
    const monthYear = formatMonthYear(event.date);
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(event);
    return groups;
  }, {});

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Événements" />

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


{errorMessage && (
  <div className="text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded mb-4">
    {errorMessage}
  </div>
)}
        <div className="flex justify-end">
          <Input
            placeholder="Rechercher par titre ou lieu..."
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
          {(isAdmin || isEditor) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editingEvent ? 'Modifier' : 'Ajouter'} un événement</CardTitle>
                  <CardDescription>Complétez les informations</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label>Titre</Label><Input
                    placeholder="Journée Portes Ouvertes"
                    value={data.title} onChange={(e) => setData('title', e.target.value)}  />
                          {errors?.title && <p className="text-red-500">{errors.title}</p>}</div>
                    <div><Label>Date</Label><Input
                    placeholder="10 Juillet 2024"
                    value={data.date} type="date" onChange={(e) => setData('date', e.target.value)}  />
                          {errors?.date && <p className="text-red-500">{errors.date}</p>}</div>
                    <div><Label>Lieu</Label><Input
                    placeholder="Siège Guil'O Services"
                    value={data.location} onChange={(e) => setData('location', e.target.value)}  />
                          {errors?.location && <p className="text-red-500">{errors.location}</p>}</div>
                    <div>
                      <Label>Type</Label>
                      <Select value={data.type} onValueChange={(value) => setData('type', value as 'image' | 'video')}>
                        <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Vidéo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Fichier</Label><Input type="file"
                    placeholder="Choisir un fichier"
                     accept={data.type === 'image' ? 'image/*' : 'video/*'} onChange={(e) => setData('file', e.target.files?.[0] || null)} /></div>
                    <div><Label>Ou URL</Label><Input
                    placeholder="URL de l'image ou de la vidéo"
                    value={data.url} onChange={(e) => setData('url', e.target.value)} />
                          {errors?.url && <p className="text-red-500">{errors.url}</p>}
                    </div>
                    <div><Label>Description</Label> <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Venez découvrir nos locaux, rencontrer notre équipe et explorer nos services."
                    />
                          {errors?.description && <p className="text-red-500">{errors.description}</p>}
                    </div>

                    <div>
  <Label>Catégorie</Label>
  <Select
  value={data.category_id !== 0 ? String(data.category_id) : ''}
  onValueChange={(value) => setData('category_id', value ? Number(value) : 0)}
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



                    {/* SCHEDULE */}
                <div className="space-y-2 pt-4">
                <Label>Programme</Label>
                {data.schedule.length === 0 ? (
                    <div className="flex gap-2">
                    <Input
                        value=""
                        placeholder="14h00 - Accueil des participants"
                        onChange={(e) => updateSchedule(0, e.target.value)}
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
                    data.schedule.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                        <Input
                        value={item}
                        placeholder="14h00 - Accueil des participants"
                        onChange={(e) => updateSchedule(idx, e.target.value)}
                        />
                        <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeSchedule(idx)}
                        disabled={data.schedule.length === 1} // ❗️ bloquer suppression si 1 seul
                        >
                        X
                        </Button>
                    </div>
                    ))
                )}
                <Button variant="outline" type="button" onClick={addSchedule}>
                    Ajouter un créneau
                </Button>
                </div>


                   {/* HIGHLIGHTS */}
            <div className="space-y-2 pt-4">
            <Label>Points forts</Label>
            {data.highlights.length === 0 ? (
                <div className="flex gap-2">
                <Input
                    value=""
                    placeholder="Rencontre avec l'équipe"
                    onChange={(e) => updateHighlight(0, e.target.value)}
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
                data.highlights.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                    <Input
                    value={item}
                    placeholder="Rencontre avec l'équipe"
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                    />
                    <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeHighlight(idx)}
                    disabled={data.highlights.length === 1}
                    >
                    X
                    </Button>
                </div>
                ))
            )}
            <Button variant="outline" type="button" onClick={addHighlight}>
                Ajouter un point fort
            </Button>
            </div>



<div className="flex items-center gap-2 pt-4">
<Switch
  id="isActive"
  checked={data.isActive}
  onCheckedChange={handleIsActiveChange}
  disabled={isDatePast(data.date)} // 👉 disable automatique si la date est dépassée
/>

  <Label htmlFor="isActive">Événement actif ?</Label>
</div>


<div className="flex gap-2 pt-2">

     <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                            {editingEvent ? (
                              <><Edit className="h-4 w-4 mr-2" />
                              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                               Modifier</>
                            ) : (
                              <><Plus className="h-4 w-4 mr-2" />
                              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                              Ajouter</>
                            )}
                          </Button>

{/* <Button type="submit" className="flex-1" disabled={processing}>
  {processing ? (
    <LoaderCircle className="h-4 w-4 animate-spin mx-auto" />
  ) : editingEvent ? (
    <>
      <Edit className="w-4 h-4 mr-2" /> Modifier
    </>
  ) : (
    <>
      <Plus className="w-4 h-4 mr-2" /> Ajouter
    </>
  )}
</Button> */}

                    </div>



                  </form>
                </CardContent>
              </Card>
            </div>
        )}
            {/* List events */}
            <div className="md:col-span-2">
              {/* {filteredEvents.length === 0 ? ( */}
              {(hasSearchOrFilter ? filteredEvents : events.data).length === 0 ? (
                <div className="text-center py-10 border rounded-xl">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-lg font-medium">Aucun événement</h3>
                </div>
              ) : (
                <Card>
                  <CardHeader><CardTitle>Événements</CardTitle>
                   {/* {activeEventsCount} Actifs - {expiredEventsCount} Expirés */}
                   {activeEventsCount} Actif{activeEventsCount > 1 ? 's' : ''} - {expiredEventsCount} Expiré{expiredEventsCount > 1 ? 's' : ''}

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
    Actifs
  </Button>
  <Button
    variant={statusFilter === 'expired' ? 'default' : 'outline'}
    onClick={() => setStatusFilter('expired')}
  >
    Expirés
  </Button>
</div>
<div className="space-y-10">
  {Object.entries(groupedEvents)
 .sort(([a], [b]) => {
    const parseDate = (monthYear: string) => {
      const [monthName, year] = monthYear.split(' ');
      const months: Record<string, number> = {
        janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
        juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
      };
      return new Date(Number(year), months[monthName.toLowerCase()] ?? 0);
    };
    return parseDate(b).getTime() - parseDate(a).getTime(); // <--- ICI inversé
  })

    .map(([monthYear, events]) => (
      <div
        key={monthYear}
        ref={(el) => {
          monthRefs.current[monthYear] = el;
        }}
        className="space-y-4"
      >
        {/* Titre du mois + bouton ouvrir/fermer */}
        <button
          onClick={() => toggleMonth(monthYear)}
          className="flex justify-between items-center w-full text-left font-bold text-2xl text-primary hover:underline"
        >
          <span>
            {monthYear}{' '}
            <span className="text-sm font-normal text-muted-foreground">
              ({events.length} événement{events.length > 1 ? 's' : ''})
            </span>
          </span>
          <span className="text-sm">{openMonths[monthYear] ? '▼' : '►'}</span>
        </button>

        {/* Contenu (grille des events) avec animation */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            openMonths[monthYear] ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {openMonths[monthYear] &&
            (events.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* {hasSearchOrFilter.map((event: EventType) => ( */}
              {events.map((event: EventType) => (
                  <div key={event.id} className="border rounded-lg overflow-hidden
                   dark:bg-accent/10     bg-white shadow relative">
                    <div className="aspect-video relative">
                      {event.type === 'image' ? (
                        <img src={event.url} alt={event.title} className="w-full h-full object-cover" />
                      ) : (
                        <video src={event.url} controls className="w-full h-full object-cover" />
                      )}

                      {/* Badge actif/expiré à gauche */}
                      <div className={`absolute top-2 left-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-md ${
                        isEventCurrentlyActive(event) ? 'text-green-600 border border-green-600' : 'text-red-600 border border-red-600'
                      }`}>
                        {isEventCurrentlyActive(event) ? 'Actif' : 'Expiré'}
                      </div>

                      {/* Badge date spécifique à droite */}
                      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold shadow-md text-primary border border-primary">
                        {new Date(event.date).toLocaleDateString('fr-FR', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Informations + actions */}
                    <div className="p-3 flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm">{event.title}</h3>
                        <p className="text-xs text-muted-foreground">{event.location}</p>
                      </div>

                      {(isAdmin || isEditor) && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => openDeleteModal(event.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground py-4 text-center">
                Aucun événement ce mois-ci.
              </div>
            ))}
        </div>
      </div>
    ))}
</div>

{!hasSearchOrFilter && (

               <div className="flex justify-center gap-2 mt-6">
                      {events.links.map((link, idx) => (
                        <Button key={idx} variant={link.active ? 'default' : 'outline'} disabled={!link.url} dangerouslySetInnerHTML={{ __html: link.label }} onClick={() => handlePageChange(link.url)} />
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
          message="Êtes-vous sûr de vouloir supprimer cet événement ?"
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </AppLayout>
  );
}
