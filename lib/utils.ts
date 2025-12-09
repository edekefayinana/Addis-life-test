type ClassDictionary = Record<string, boolean | null | undefined>;
type ClassValue =
  | string
  | number
  | ClassValue[]
  | ClassDictionary
  | null
  | undefined
  | boolean;

const toClassName = (value: ClassValue): string => {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number')
    return String(value);
  if (Array.isArray(value))
    return value.map(toClassName).filter(Boolean).join(' ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, present]) => Boolean(present))
      .map(([key]) => key)
      .join(' ');
  }
  return '';
};

export const cn = (...inputs: ClassValue[]): string =>
  inputs.map(toClassName).filter(Boolean).join(' ');
