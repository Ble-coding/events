import { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import { Head, usePage, router } from '@inertiajs/react';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/blog-card'; // On suppose que tu as un BlogCard, sinon je peux te le coder aussi !

interface BlogType {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  type: 'image' | 'video';
  url: string;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
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
  [key: string]: unknown;
  allblogItems: BlogType[];
}

export default function Blogs() {
  const { blogs, allblogItems } = usePage<PageProps>().props;

//   const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [search, setSearch] = useState('');

  const hasSearch = search.trim().length > 0 || selectedDate !== '';


  const filteredBlogs = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = allblogItems ?? blogs.data;

    return list.filter((blog) => {
      const matchesSearch = blog.title.toLowerCase().includes(term);
      const matchesDate = !selectedDate || blog.date.startsWith(selectedDate);
      return matchesSearch && matchesDate;
    });
  }, [search, selectedDate, allblogItems, blogs.data]);


  const handlePageChange = (url: string | null) => {
    if (url) router.visit(url, { preserveScroll: true });
  };

  return (
    <AppMenuTemplate>
      <Head title="Nos Blogs" />

      {/* Hero Section */}
      <section className="py-20 md:py-28 text-white">
        <div className="bg-orange-gk container mt-3 p-6">
          <div className="max-w-2xl animate-slide-in">
            <h1 className="text-playfair text-[60px] leading-tight mb-6">Nos Blogs</h1>
            <p className="text-white/90 text-[20px] mb-8">
              Inspiration, conseils et astuces pour vos événements, mariages et bien plus encore.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white dark:bg-white text-black dark:text-black transition-colors duration-300">
  <div className="container">

    {/* Barre de Filtres */}
{/* Barre de filtres */}
<div className="flex flex-col md:flex-row gap-4 mb-6">
  {/* Recherche par titre */}
  <Input
    placeholder="Recherche par titre..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-1/3
      border border-gray-300 text-black placeholder:text-gray-500
      dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500"
  />

  {/* Sélection par date (mois) */}
  <Input
    type="month"
    value={selectedDate}
    onChange={(e) => setSelectedDate(e.target.value)}
    className="w-full md:w-1/4
      border border-gray-300 text-black placeholder:text-gray-500
      dark:border-gray-300 dark:bg-white dark:text-black dark:placeholder:text-gray-500"
  />


</div>

    {/* Résultat des Blogs */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {(hasSearch ? filteredBlogs : blogs.data).length > 0 ? (
(hasSearch ? filteredBlogs : blogs.data).map((blog: BlogType) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            title={blog.title}
            excerpt={blog.excerpt}
            url={blog.url}
            type={blog.type}
            date={blog.date}
            categoryName={blog.category?.name}
          />
        ))
      ) : (
        <div className="text-center col-span-full py-12">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">Aucun blog trouvé</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Essayez d'ajuster votre recherche ou vos filtres.
          </p>
        </div>
      )}
    </div>

    {/* Pagination */}
 {/* Pagination */}
 {!hasSearch && (
          <div className="flex justify-center gap-2 mt-12">
            {blogs.links.map((link, idx) => (
              <Button
              className='bg-gray-100 dark:bg-gray-100
              text-black dark:text-black
             border-gray-150 dark:border-gray-50
             hover:bg-black hover:text-white
              dark:hover:bg-black dark:hover:text-white'
                key={idx}
                variant={link.active ? 'default' : 'outline'}
                disabled={!link.url}
                dangerouslySetInnerHTML={{ __html: link.label }}
                onClick={() => handlePageChange(link.url)}
              />
            ))}
          </div>
  )}

  </div>
</section>

    </AppMenuTemplate>
  );
}
