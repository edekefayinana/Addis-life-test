'use client';

import { useState } from 'react';

import { Search, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const properties = [
  {
    id: '1',
    name: 'Vatican site - Three Bedroom Apartment',
    unit: 'A-304',
    location: 'Vatican Site',
    beds: 3,
    baths: 2,
    sqft: 450,
    price: 'ETB 3,300,000',
    status: 'Available',
    image: '/luxury-apartment-exterior.png',
  },
  {
    id: '2',
    name: 'Sunrise Apartments - Two Bedroom',
    unit: 'B-311',
    location: 'Sunrise Apartments',
    beds: 2,
    baths: 1,
    sqft: 320,
    price: 'ETB 2,100,000',
    status: 'Available',
    image: '/modern-apartment-complex.png',
  },
  {
    id: '3',
    name: 'Africa Union Site - One Bedroom',
    unit: 'C-112',
    location: 'Africa Union Site 1',
    beds: 1,
    baths: 1,
    sqft: 180,
    price: 'ETB 1,200,000',
    status: 'Reserved',
    image: '/contemporary-residential-building.jpg',
  },
  {
    id: '4',
    name: 'Sunrise Apartments - Three Bedroom',
    unit: 'A-210',
    location: 'Sunrise Apartments',
    beds: 3,
    baths: 2,
    sqft: 400,
    price: 'ETB 2,800,000',
    status: 'Available',
    image: '/high-rise-residential-property.jpg',
  },
];

interface InventoryListProps {
  onSelectProperty: (id: string) => void;
}

export function InventoryList({ onSelectProperty }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter] = useState('All');
  // setStatusFilter

  const filteredProperties = properties.filter((prop) => {
    const matchesSearch =
      prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.unit.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
        <p className="text-gray-600">Manage all properties and units</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by Unit, Location, or Property Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <ChevronDown size={20} />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => onSelectProperty(property.id)}
              className="cursor-pointer border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Image
                src={property.image || '/placeholder.svg'}
                alt={property.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 text-sm truncate">
                  {property.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{property.unit}</p>
                <div className="flex justify-between text-xs mb-3">
                  <span className="text-gray-600">{property.beds} Beds</span>
                  <span className="text-gray-600">{property.baths} Baths</span>
                  <span className="text-gray-600">{property.sqft} sqft</span>
                </div>
                <p className="font-bold text-teal-900 text-sm mb-2">
                  {property.price}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      property.status === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
