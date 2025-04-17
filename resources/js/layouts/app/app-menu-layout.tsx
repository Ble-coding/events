import { AppContent } from '@/components/app-content';
import { AppMenu } from '@/components/app-menu';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import Footer from '@/components/footer'; // ✅ ici

export default function AppMenuLayout({ children }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>
            <AppMenu />
            <AppContent>{children}</AppContent>
            <Footer />

        </AppShell>
    );
}
