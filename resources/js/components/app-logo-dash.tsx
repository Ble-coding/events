import { Link } from '@inertiajs/react';

export default function AppLogoDash() {
  return (
    <Link
      href="/"
      className="flex items-center pl-2 transition-opacity hover:opacity-90"
    >
     <div className="flex w-24 h-16 items-center justify-center rounded-md overflow-hidden">
        <img
            src="/logo.png"
            alt="Guil'O Services"
            className="h-14 w-14 object-contain"
        />
      </div>
      {/* <div className="ml-3">
        <span className="block font-playfair text-guilo text-lg font-medium leading-none">
          Guil'O Services
        </span>
      </div> */}
    </Link>
  );
}
