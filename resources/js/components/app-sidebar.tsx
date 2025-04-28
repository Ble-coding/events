// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Home,
    Folder, HelpCircle,
     LayoutGrid, Book, User, Calendar,
     QuoteIcon, Handshake, Building2,
     PhoneCall} from 'lucide-react';
import AppLogoDash from './app-logo-dash';

const mainNavItems: NavItem[] = [
    {
        title: 'Tableau de Bord',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Galerie',
        href: '/gallery',
        icon: Folder,
    },
    {
        title: 'Catégories',
        href: '/categories',
        icon: BookOpen,
    },
    {
        title: 'Evénements',
        href: '/events-dashboard',
        icon: Calendar,
    },
    {
        title: 'Salles',
        href: '/venues-dashboard',
        icon: Building2,
    },

    {
        title: 'Services',
        href: '/services-dashboard',
        icon: Book,
    },
    {
        title: 'Types de Services',
        href: '/services-types',
        icon: Handshake,
    },
    {
        title: 'Faqs',
        href: '/contact-dashboard',
        icon: HelpCircle,
    },
    {
        title: 'Témoignages',
        href: '/testimonials-dashboard',
        icon: QuoteIcon,
    },
    {
        title: 'Utilisateurs',
        href: '/utilisateurs-dashboard',
        icon: User,
    },
    {
        title: 'Infos de Contact',
        href: '/contact-infos',
        icon: PhoneCall,
    },
    {
        title: 'Guilo\'s Services',
        href: '/',
        icon: Home,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogoDash />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
