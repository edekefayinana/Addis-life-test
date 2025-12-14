import { useRouter, useSearchParams } from 'next/navigation';

export function usePagination() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page') ?? '1');

  return {
    setPage,
    currentPage,
  };
}
