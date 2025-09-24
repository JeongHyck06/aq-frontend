'use client';

import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    showFooter = true,
}) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 md:ml-0">
                    {children}
                </main>
            </div>
            {showFooter && <Footer />}
        </div>
    );
};
