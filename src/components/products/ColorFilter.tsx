import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ColorFilterProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
}

const colors = [
  { name: 'Black', value: 'black', class: 'bg-black' },
  { name: 'Navy', value: 'navy', class: 'bg-navy-600' },
  { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
  { name: 'Charcoal', value: 'charcoal', class: 'bg-charcoal-600' },
  { name: 'Burgundy', value: 'burgundy', class: 'bg-burgundy-600' },
  { name: 'Tan', value: 'tan', class: 'bg-[#D2B48C]' },
  { name: 'Brown', value: 'brown', class: 'bg-[#8B4513]' },
  { name: 'Blue', value: 'blue', class: 'bg-blue-600' },
  { name: 'White', value: 'white', class: 'bg-white border border-gray-200' },
  { name: 'Beige', value: 'beige', class: 'bg-[#F5F5DC]' },
];

export function ColorFilter({ selectedColors, onColorChange }: ColorFilterProps) {
  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter(c => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  return (
    <div className="py-6">
      <h3 className="text-lg font-medium text-gray-900">Colors</h3>
      <div className="mt-4 flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => toggleColor(color.value)}
            className={cn(
              'group relative h-8 w-8 rounded-full ring-offset-2 transition-transform hover:scale-110',
              selectedColors.includes(color.value) ? 'ring-2 ring-indigo-500' : ''
            )}
            title={color.name}
          >
            <span className={cn(
              'absolute inset-0 rounded-full',
              color.class
            )} />
            <span className="sr-only">{color.name}</span>
            
            {/* Color name tooltip */}
            <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}