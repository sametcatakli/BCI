'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * RootLayout is a component that serves as the root layout for the application,
 * ensuring that unauthenticated users are redirected to the login page.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The children components to be rendered within the layout.
 * @return {JSX.Element} The root layout structure containing the children components.
 */
export default function RootLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user && window.location.pathname !== '/login') {
            router.push('/login');
        }
    }, [router]);

    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
