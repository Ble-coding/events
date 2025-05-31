import { Link } from '@inertiajs/react';

export default function AppLogo() {
  return (
<Link
  href="/"
  className="flex items-center pl-2 transition-opacity hover:opacity-90"
>
  <div className="flex w-32 h-20 items-center justify-center rounded-md overflow-hidden">
    <img
      src="/logo.png"
      alt="Guil'O Services"
      className="w-full h-full object-contain"
    />
  </div>
  <div className="ml-3">
  <span className="block font-playfair text-guilo dark:text-black text-xs font-medium leading-none">
    Guil'O Services
  </span>
</div>

</Link>

  );
}
