'use client';

import { useGetLocationById } from '@/api/Location/useLocation';
import { useParams } from 'next/navigation';

export default function LocationDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useGetLocationById(id as string);

    if (isLoading) return <div>Loading location...</div>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>Type: {data.type}</p>
            <p>Dimension: {data.dimension}</p>
        </div>
    );
}
