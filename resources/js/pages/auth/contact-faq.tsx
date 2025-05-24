import React, { useMemo, useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConfirmModal from '@/components/confirm-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-react';

interface FaqType {
  id: number;
  question: string;
  answer: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PageProps {
  faqs: {
    data: FaqType[];
    links: PaginationLink[];
  };
  auth: {
    user: {
      role: 'admin' | 'editor' | 'viewer';
    };
  };
  flash?: {
    success?: string;
  };
  [key: string]: unknown;
  allfaqItems:  FaqType[];
  errors?: Record<string, string>;
}

export default function ContactFaqManager() {
  const { faqs, flash, auth, errors, allfaqItems} = usePage<PageProps>().props;
  const isAdmin = auth.user.role === 'admin';
  const isEditor = auth.user.role === 'editor';
//   const isViewer = auth.user.role === 'viewer';

  const [editing, setEditing] = useState<FaqType | null>(null);
  const [search, setSearch] = useState('');
      const [flashSuccess, setFlashSuccess] = useState<string | null>(null);
      const [flashError, setFlashError] = useState<string | null>(null);
   const [isSubmitting, setIsSubmitting] = useState(false);
      const hasSearch = search.trim().length > 0;

  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { data, setData, post, put, reset
    // , processing
 } = useForm({
    question: '',
    answer: '',
  });
//   const { toast } = useToast();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'FAQ', href: '/contact-dashboard' },
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


 const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const list = allfaqItems ?? faqs.data; // ✅ fallback sécurisé

    if (!term) return faqs.data;

    return list.filter((p) =>
      p.question.toLowerCase().includes(term) ||
      p.answer.toLowerCase().includes(term)

    //   p.url.toLowerCase().includes(term)
    );
  }, [search, faqs.data, allfaqItems]);


  const faqsToDisplay = hasSearch ? filtered : faqs.data;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editing) {
      put(`/contact-dashboard/${editing.id}`, {
        preserveScroll: true,
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
      post('/contact-dashboard', {
        preserveScroll: true,
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
    reset();
    setEditing(null);
  };

  const handleEdit = (faq: FaqType) => {
    setEditing(faq);
    setData({ question: faq.question, answer: faq.answer });
  };

  const confirmDelete = () => {
    if (faqToDelete !== null) {
      router.delete(`/contact-dashboard/${faqToDelete}`, {
        preserveScroll: true,
      });
      setShowConfirmModal(false);
      setFaqToDelete(null);
    }
  };

  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

//   const filteredFaqs = faqs.data.filter((faq) =>
//     faq.question.toLowerCase().includes(search.toLowerCase())
//   );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion FAQ" />

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(isAdmin || isEditor) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{editing ? 'Modifier' : 'Ajouter'} une question</CardTitle>
                  <CardDescription>
                    {editing ? 'Modifiez la FAQ existante' : 'Ajoutez une nouvelle question'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        value={data.question}
                        onChange={(e) => setData('question', e.target.value)}
                        placeholder="Ex: Combien de temps à l'avance dois-je réserver ?"
                      />
                            {errors?.question && <p className="text-red-500">{errors.question}</p>}
                    </div>
                    <div>
                      <Label htmlFor="answer">Réponse</Label>
                      <Input
                        id="answer"
                        value={data.answer}
                        onChange={(e) => setData('answer', e.target.value)}
                        placeholder="Ex: Nous recommandons 3 mois à l'avance..."
                      />
                            {errors?.answer && <p className="text-red-500">{errors.answer}</p>}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {/* <Button type="submit" className="flex-1">
                        {editing ? <><Edit className="h-4 w-4 mr-2" />
                          {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                          Modifier</> : <><Plus className="h-4 w-4 mr-2" />
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Ajouter</>}
                      </Button> */}

                          <Button type="submit" className="flex-1"  disabled={isSubmitting}>
                                              {editing ? (
                                                <><Edit className="h-4 w-4 mr-2" />
                                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                 Modifier</>
                                              ) : (
                                                <><Plus className="h-4 w-4 mr-2" />
                                                {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                                Ajouter</>
                                              )}
                                            </Button>

                      {editing && (
                        <Button variant="outline" type="button" onClick={resetForm}>Annuler</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">Liste des questions</CardTitle>
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
                {faqsToDisplay.map((faq) => (
                    <li key={faq.id} className="flex justify-between items-center py-2">
                      <div>
                        <strong>{faq.question}</strong>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                      {(isAdmin || isEditor) && (
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => {
                              setFaqToDelete(faq.id);
                              setShowConfirmModal(true);
                            }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {faqsToDisplay.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucune question trouvée.</p>
                )}
      {!hasSearch && (
                <div className="flex justify-center gap-2 mt-6">
                  {faqs.links.map((link, idx) => (
                    <Button
                      key={idx}
                      variant={link.active ? 'default' : 'outline'}
                      disabled={!link.url}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                      onClick={() => handlePageChange(link.url)}
                    />
                  ))}
                </div>   )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        title="Supprimer la question"
        message="Voulez-vous vraiment supprimer cette FAQ ?"
        onCancel={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
      />
    </AppLayout>
  );
}
