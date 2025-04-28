import { useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AppMenuTemplate from "@/layouts/app/app-menu-layout";

export default function NotFound() {
  const location = usePage().url;

  useEffect(() => {
    console.error(
      "Erreur 404 : L'utilisateur a tenté d'accéder à une route inexistante :",
      location
    );
  }, [location]);

  return (
    <AppMenuTemplate>
      <Head title="Page non trouvée" />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-6xl font-extrabold text-kroniks-blue mb-4">404</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
            Oups ! La page que vous cherchez n'existe pas.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-kroniks-blue text-white rounded-lg hover:bg-kroniks-blue/80 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </AppMenuTemplate>
  );
}
