import React, { useEffect, useState } from 'react';
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
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

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
  [key: string]: unknown;
  flash?: {
    success?: string;
  };
}

export default function ContactFaqManager() {
  const { faqs, flash } = usePage<PageProps>().props;
  const [editing, setEditing] = useState<FaqType | null>(null);
  const [search, setSearch] = useState('');
  const [faqToDelete, setFaqToDelete] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { data, setData, post, put, reset } = useForm({
    question: '',
    answer: '',
  });
  const { toast } = useToast();

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'FAQ', href: '/contact-dashboard' },
  ];

  useEffect(() => {
    if (flash?.success) {
      toast({ title: flash.success });
    }
  }, [flash, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      put(`/contact-dashboard/${editing.id}`, {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    } else {
      post('/contact-dashboard', {
        preserveScroll: true,
        onSuccess: () => resetForm(),
      });
    }
  };

  const resetForm = () => {
    reset();
    setEditing(null);
  };

  const handleEdit = (faq: FaqType) => {
    setEditing(faq);
    setData({
      question: faq.question,
      answer: faq.answer,
    });
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

  const filteredFaqs = faqs.data.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestion FAQ" />

      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  </div>
                  <div>
                    <Label htmlFor="answer">Réponse</Label>
                    <Input
                      id="answer"
                      value={data.answer}
                      onChange={(e) => setData('answer', e.target.value)}
                      placeholder="Ex: Nous recommandons 3 mois à l'avance..."
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="flex-1">
                      {editing ? <><Edit className="h-4 w-4 mr-2" /> Modifier</> : <><Plus className="h-4 w-4 mr-2" /> Ajouter</>}
                    </Button>
                    {editing && (
                      <Button variant="outline" type="button" onClick={resetForm}>
                        Annuler
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Liste des questions
                </CardTitle>
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
                  {filteredFaqs.map((faq) => (
                    <li key={faq.id} className="flex justify-between items-center py-2">
                      <div>
                        <strong>{faq.question}</strong>
                        <p className="text-muted-foreground text-sm">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          setFaqToDelete(faq.id);
                          setShowConfirmModal(true);
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>

                {filteredFaqs.length === 0 && (
                  <p className="text-muted-foreground text-sm pt-4">Aucune question trouvée.</p>
                )}

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
                                </div>
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
