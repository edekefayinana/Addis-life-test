'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export type FilterTab = {
  label: string;
  value: string;
  badge?: string | number;
};

export interface FilterTabsProps {
  tabs: FilterTab[];
  /** Query string key to sync the active tab. Defaults to "tab". */
  queryKey?: string;
  /** Optional default value when no query param is present. Falls back to first tab. */
  defaultValue?: string;
  /** Called whenever the active tab changes. */
  onChange?: (value: string) => void;
  className?: string;
  /** Utility class for underline color; e.g., "bg-orange-500". */
  underlineClassName?: string;
}

export function FilterTabs({
  tabs,
  queryKey = 'tab',
  defaultValue,
  onChange,
  className,
  underlineClassName = 'bg-orange-500',
}: FilterTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeValue = useMemo(() => {
    const fromQuery = searchParams.get(queryKey);
    const hasQueryValue = tabs.some((t) => t.value === fromQuery);
    if (fromQuery && hasQueryValue) return fromQuery;
    if (defaultValue && tabs.some((t) => t.value === defaultValue))
      return defaultValue;
    return tabs[0]?.value ?? '';
  }, [defaultValue, queryKey, searchParams, tabs]);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === defaultValue) {
      params.delete(queryKey);
    } else {
      params.set(queryKey, value);
    }

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.push(href, { scroll: false });
    onChange?.(value);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-6 overflow-x-auto scrollbar-hide border-b border-gray-200 text-sm font-medium text-gray-600',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleSelect(tab.value)}
            className={cn(
              'relative pb-3 whitespace-nowrap transition-colors',
              isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
            )}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                {tab.badge}
              </span>
            )}
            {isActive && (
              <span
                className={cn(
                  'absolute left-0 right-0 -bottom-px h-[3px] rounded-full',
                  underlineClassName
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
