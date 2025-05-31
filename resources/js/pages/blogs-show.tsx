import { Head, usePage, Link } from '@inertiajs/react';
import { Calendar, Film } from 'lucide-react';
import AppMenuTemplate from '@/layouts/app/app-menu-layout';
// import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlogType {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  type: 'image' | 'video';
  url: string;
  is_active: boolean;
  category?: { id: number; name: string };
}

interface OtherBlogType {
    id: number;
    title: string;
    date: string; // ✅ On précise bien que `date` existe !
    status: boolean;
    category?: { id: number; name: string };
  }


interface PageProps {
  blog: BlogType;
  otherBlogs: OtherBlogType[];
  [key: string]: unknown;
}





export default function BlogShow() {
  const { blog, otherBlogs } = usePage<PageProps>().props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => setIsLoaded(true);
  const handleImageError = () => {
    setIsLoaded(true);
    setHasError(true);
  };

  const formatDateToFrench = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return !isNaN(date.getTime())
      ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
      : 'Date inconnue';
  };

  return (
    <AppMenuTemplate>
      <Head title={blog.title} />

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Partie principale */}
            <div className="lg:col-span-2 space-y-8">

              {/* Media */}
              <div className="rounded-xl overflow-hidden h-[400px]">
                {blog.type === 'image' ? (
                  <img
                    src={blog.url}
                    alt={blog.title}
                    className={cn(
                      "object-cover w-full h-full transition-all duration-500",
                      isLoaded && !hasError ? "opacity-100" : "opacity-0",
                      "group-hover:scale-105 transition-transform duration-700"
                    )}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={blog.url}
                      className={cn(
                        "object-cover w-full h-full",
                        isLoaded ? "opacity-100" : "opacity-0"
                      )}
                      onLoadedData={handleImageLoad}
                      onError={handleImageError}
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <Film className="w-10 h-10 text-white dark:text-white opacity-50" />
                    </div>
                  </div>
                )}
              </div>

              {/* Détails */}
              <div className="space-y-6">
                <h1 className="text-4xl
                text-black dark:text-black font-bold">{blog.title}</h1>

                {/* Badge Publication */}
                {/* {blog.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Publié
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Non publié
                  </span>
                )} */}

                {/* Infos */}
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mt-4">
                  <span className="inline-flex paragraph items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {formatDateToFrench(blog.date)}
                  </span>
               {/* Catégorie */}
{blog.category ? (
  <div className="flex items-center gap-2 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-md">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2.003 5.884L10 9.882l7.997-3.998A1 1 0 0017 5H3a1 1 0 00-.997.884z" />
      <path d="M18 8.118l-8 4-8-4V14a1 1 0 001 1h14a1 1 0 001-1V8.118z" />
    </svg>
    <span>{blog.category.name}</span>
  </div>
) : (
  <span className="text-sm text-red-500 italic">Catégorie introuvable</span>
)}

                </div>

                {/* Excerpt */}
                {/* <p className="text-gray-600 dark:text-gray-300 text-lg">{blog.excerpt}</p> */}

                {/* Bouton Retour Blogs */}
                {/* {blog.is_active && (
                  <Button asChild variant="outline" className="bg-orange-gk text-white mt-4">
                    <Link href="/blogs">Retour aux Blogs</Link>
                  </Button>
                )} */}
              </div>

              {/* Contenu complet */}
              <div className="bg-white dark:bg-white
              text-black dark:text-black rounded-xl p-8 mt-16 prose dark:prose-invert max-w-full">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

            </div>

                {/* Aside */}
            <aside className="lg:col-span-1">
            <div className="sticky top-28
            space-y-4">

                <h2 className="text-lg text-black dark:text-black font-semibold mb-4">Articles récents</h2>
                {otherBlogs.length > 0 ? (
                otherBlogs
                    .filter(otherBlog => otherBlog.id !== blog.id)
                    .map(otherBlog => (
                    <div key={otherBlog.id} className="p-4 border rounded-lg bg-white
                    dark:border-gray-100 dark:bg-white ">
                        <Link
                        href={`/blogs/${otherBlog.id}`}
                        className="block hover:text-guilo-orange transition-colors"
                        >
                        <h3 className="font-medium text-black dark:text-black  line-clamp-2 mb-2">
                            {otherBlog.title}
                        </h3>
                        <p className="text-sm paragraph">
                            {formatDateToFrench(otherBlog.date)}
                        </p>
                        </Link>
                    </div>
                    ))
                ) : (
                <p className="paragraph text-sm">Pas d'autres articles pour l'instant.</p>
                )}
            </div>
            </aside>


          </div>
        </div>
      </div>
    </AppMenuTemplate>
  );
}
