import { useEffect, useState } from 'react';
import { supabase, BodyPreset } from '../lib/supabase';
import { User } from 'lucide-react';

interface PresetSelectorProps {
  onSelect: (preset: BodyPreset) => void;
}

export default function PresetSelector({ onSelect }: PresetSelectorProps) {
  const [presets, setPresets] = useState<BodyPreset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const { data, error } = await supabase
        .from('body_presets')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;
      setPresets(data || []);
    } catch (error) {
      console.error('Error loading presets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-16">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-slate-600" />
        <h4 className="text-sm font-semibold text-slate-700">Body Presets</h4>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelect(preset)}
            className="px-4 py-3 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600">
                {preset.name}
              </span>
              {preset.is_default && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Default
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
