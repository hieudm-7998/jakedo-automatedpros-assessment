'use client';

import { useGetLocations } from '@/api/Location/useLocation';
import Link from 'next/link';

export default function LocationsPage() {
    const { data, isLoading } = useGetLocations(1);

    if (isLoading) return <div>Loading locations...</div>;

    return (
        <div>
            <h1>Locations</h1>
            <ul>
                {data?.results.map((loc: any) => (
                    <li key={loc.id}>
                        <Link href={`/locations/${loc.id}`}>
                            {loc.name} - {loc.type}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
