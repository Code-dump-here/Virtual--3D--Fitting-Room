import { useEffect, useState } from 'react';
import { supabase, ClothingItem } from '../lib/supabase';
import { ShoppingBag, Heart } from 'lucide-react';

interface ClothingSelectorProps {
  onSelect: (item: ClothingItem) => void;
  selectedItem?: ClothingItem;
}

export default function ClothingSelector({ onSelect, selectedItem }: ClothingSelectorProps) {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadClothingItems();
  }, []);

  const loadClothingItems = async () => {
    try {
      const { data, error } = await supabase
        .from('clothing_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading clothing items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Clothing Items</h3>
        <ShoppingBag className="w-5 h-5 text-slate-600" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative rounded-lg overflow-hidden transition-all ${
              selectedItem?.id === item.id
                ? 'ring-2 ring-blue-600 shadow-lg'
                : 'hover:shadow-md'
            }`}
          >
            <div className="aspect-[3/4] bg-slate-200 overflow-hidden">
              <img
                src={item.thumbnail_url || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
              <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
              <p className="text-xs text-slate-200 line-clamp-1">{item.category}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
