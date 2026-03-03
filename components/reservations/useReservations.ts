/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { ReservationRow } from './Reservation';

export function useReservations({ all = false, query = '' } = {}) {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    let url = all ? '/api/reservations?all=1' : '/api/reservations';
    if (query) {
      url +=
        (url.includes('?') ? '&' : '?') + `query=${encodeURIComponent(query)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    // Map backend data to ReservationRow
    setReservations(
      data.data.map((r: any) => ({
        id: r.id,
        unit: r.property?.title || r.propertyId,
        project: r.property?.project?.name || 'Unknown Project',
        clientName: r.user?.name || r.userId,
        bedrooms: r.property?.totalBedrooms ?? '-',
        date: new Date(r.createdAt).toLocaleDateString(),
        status: r.status.charAt(0) + r.status.slice(1).toLowerCase(),
        segment: 'clients',
        ...r,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, query]);

  return { reservations, loading, refetch: fetchReservations };
}
