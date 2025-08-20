'use client';

import {
    QueryClient as ClientQuery,
    QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(() => new ClientQuery());

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
