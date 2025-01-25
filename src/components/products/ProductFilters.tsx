import { useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  selectedColors: string[];
  onColorChange: (colors: string[]) => void;
  selectedPriceRange?: [number, number];
  onPriceRangeChange?: (range: [number, number]) => void;
  selectedMaterials?: string[];
  onMaterialChange?: (materials: string[]) => void;
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

const materials = [
  'Wool',
  'Cotton',
  'Linen',
  'Silk',
  'Polyester',
  'Velvet',
  'Tweed',
];

const priceRanges = [
  { label: 'Under $100', range: [0, 100] },
  { label: '$100 - $200', range: [100, 200] },
  { label: '$200 - $500', range: [200, 500] },
  { label: '$500+', range: [500, Infinity] },
];

export function ProductFilters({
  selectedColors,
  onColorChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedMaterials,
  onMaterialChange,
}: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>(selectedPriceRange || [0, Infinity]);
  const [materials, setMaterials] = useState<string[]>(selectedMaterials || []);

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorChange(selectedColors.filter(c => c !== color));
    } else {
      onColorChange([...selectedColors, color]);
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    onPriceRangeChange?.(range);
  };

  const toggleMaterial = (material: string) => {
    const newMaterials = materials.includes(material)
      ? materials.filter(m => m !== material)
      : [...materials, material];
    setMaterials(newMaterials);
    onMaterialChange?.(newMaterials);
  };

  return (
    <div className="space-y-8">
      {/* Color Filter */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
            <Disclosure.Button className="flex w-full items-center justify-between text-gray-900">
              <span className="text-sm font-medium">Color</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-gray-500',
                  open ? 'rotate-180 transform' : ''
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="mt-4">
              <div className="grid grid-cols-5 gap-3">
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
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* Price Range Filter */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
            <Disclosure.Button className="flex w-full items-center justify-between text-gray-900">
              <span className="text-sm font-medium">Price Range</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-gray-500',
                  open ? 'rotate-180 transform' : ''
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="mt-4">
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      checked={priceRange[0] === range.range[0] && priceRange[1] === range.range[1]}
                      onChange={() => handlePriceRangeChange(range.range as [number, number])}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{range.label}</span>
                  </label>
                ))}
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* Material Filter */}
      <Disclosure defaultOpen>
        {({ open }) => (
          <div>
            <Disclosure.Button className="flex w-full items-center justify-between text-gray-900">
              <span className="text-sm font-medium">Material</span>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-gray-500',
                  open ? 'rotate-180 transform' : ''
                )}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="mt-4">
              <div className="space-y-2">
                {materials.map((material) => (
                  <label
                    key={material}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={materials.includes(material)}
                      onChange={() => toggleMaterial(material)}
                      className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{material}</span>
                  </label>
                ))}
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>

      {/* Clear All Filters */}
      {(selectedColors.length > 0 || materials.length > 0 || priceRange[0] !== 0 || priceRange[1] !== Infinity) && (
        <button
          onClick={() => {
            onColorChange([]);
            setMaterials([]);
            onMaterialChange?.([]);
            setPriceRange([0, Infinity]);
            onPriceRangeChange?.([0, Infinity]);
          }}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}