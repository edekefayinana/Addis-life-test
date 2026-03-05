'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Download, FileText, Folder, FileArchive } from 'lucide-react';
import { AssetsFilters } from './AssetsFilters';
import { FilterTabs } from '@/components/FilterTabs';
import { usePagination } from '@/lib/hooks/usePagination';
import { PAGE_SIZE } from '@/lib/constants';
import { buildPaginationQuery } from '@/lib/utils/filters';
import { Pagination } from '@/components/inventory/Pagination';

type AssetCategory = 'all' | 'flyer' | 'brochure' | 'image' | 'floor-plan';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Flyers', value: 'flyer' },
  { label: 'Brochures', value: 'brochure' },
  { label: 'Property Images', value: 'image' },
  { label: 'Floor Plans', value: 'floor-plan' },
];

const assets = [
  {
    id: '1',
    name: 'AU1 Site – Sales Brochures',
    project: 'Sunrise Apartments',
    category: 'brochure' as AssetCategory,
    fileType: 'PDF',
    fileSize: '4.2 MB',
    lastUpdated: '3 days ago',
    description: 'Official sales brochure for agent marketing use',
  },
  {
    id: '2',
    name: 'Vatican Site – Marketing Materials Pack',
    project: 'Vatican Site',
    category: 'flyer' as AssetCategory,
    fileType: 'ZIP',
    fileSize: '22.3 MB',
    lastUpdated: '1 week ago',
    description: 'Bundle of promotional flyers and banners.',
  },
  {
    id: '3',
    name: 'Africa Union Site 1 – Virtual Tour Link',
    project: 'Africa Union Site 1',
    category: 'image' as AssetCategory,
    fileType: 'Link',
    fileSize: 'N/A',
    lastUpdated: '2 weeks ago',
    description: '3D virtual walkthrough for online viewing',
  },
  {
    id: '4',
    name: 'Sunrise Apartments – Floor Plans',
    project: 'Sunrise Apartments',
    category: 'floor-plan' as AssetCategory,
    fileType: 'PDF',
    fileSize: '2.1 MB',
    lastUpdated: '5 days ago',
    description: 'Detailed floor layouts and unit configurations',
  },
  {
    id: '5',
    name: 'Vatican Site – High Resolution Images',
    project: 'Vatican Site',
    category: 'image' as AssetCategory,
    fileType: 'ZIP',
    fileSize: '125 MB',
    lastUpdated: '10 days ago',
    description: 'Professional photography collection for listings',
  },
  {
    id: '6',
    name: 'Africa Union 2 Site – Marketing Campaign',
    project: 'Africa Union 2 Site',
    category: 'flyer' as AssetCategory,
    fileType: 'PDF',
    fileSize: '5.6 MB',
    lastUpdated: '3 days ago',
    description: 'Social media and promotional content strategy',
  },
];

interface AssetsListProps {
  onSelectAsset: (id: string) => void;
}

export function AssetsList({ onSelectAsset }: AssetsListProps) {
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const searchParams = useSearchParams();
  const activeCategory =
    (searchParams.get('category') as AssetCategory) ?? 'all';
  const { currentPage } = usePagination();

  const filteredAssets = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesCategory =
        activeCategory === 'all' ? true : asset.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.project.toLowerCase().includes(q) ||
        asset.fileType.toLowerCase().includes(q)
      );
    });
  }, [activeCategory, filters.search]);

  const parseRelativeAge = (label: string): number => {
    const lower = label.toLowerCase().trim();
    const match = lower.match(/(\d+)\s+(day|days|week|weeks)/);
    if (!match) return Number.POSITIVE_INFINITY;
    const value = Number(match[1]);
    const unit = match[2];
    const days = unit.startsWith('week') ? value * 7 : value;
    return days;
  };

  const sortedAssets = useMemo(() => {
    const sorted = [...filteredAssets];
    const isDesc = filters.sortOrder === 'desc';

    sorted.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (filters.sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'date':
          aVal = parseRelativeAge(a.lastUpdated);
          bVal = parseRelativeAge(b.lastUpdated);
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return isDesc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return isDesc ? bVal - aVal : aVal - bVal;
      }

      return 0;
    });

    return sorted;
  }, [filteredAssets, filters.sortBy, filters.sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedAssets.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const { skip, take } = buildPaginationQuery(safePage, PAGE_SIZE);
  const visibleAssets = sortedAssets.slice(skip, skip + take);

  const renderTypeBadge = (fileType: string) => {
    const isPdf = fileType.toLowerCase() === 'pdf';
    const isZip = fileType.toLowerCase() === 'zip';
    const Icon = isPdf ? FileText : isZip ? FileArchive : Folder;
    const bg = isPdf ? 'bg-red-500' : isZip ? 'bg-emerald-500' : 'bg-gray-300';
    const label = isPdf || isZip ? fileType.toUpperCase() : 'FOLDER';
    return (
      <div
        className={`${bg} rounded-lg p-2 inline-flex items-center justify-center`}
      >
        <Icon className="w-5 h-5 text-white" />
        <span className="sr-only">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Marketing Assets Library
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 pt-4">
          <FilterTabs
            tabs={TABS}
            queryKey="category"
            defaultValue="all"
            underlineClassName="bg-orange-500"
          />
        </div>

        <div className="px-6 pb-4 pt-3">
          <AssetsFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {visibleAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelectAsset(asset.id)}
              className="group text-left rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm overflow-hidden border border-gray-200"
            >
              <div className="relative w-full pt-[70%] bg-gray-200">
                <Image
                  src="/marketing-assests.png"
                  alt={asset.name}
                  fill
                  sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute left-3 top-3">
                  {renderTypeBadge(asset.fileType)}
                </div>
              </div>

              <div className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {asset.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {asset.fileSize}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: hook up real download
                    console.log('download', asset.id);
                  }}
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm text-gray-700 hover:bg-gray-50"
                  aria-label="Download asset"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}
        </div>

        <div className="px-6 pb-6">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
