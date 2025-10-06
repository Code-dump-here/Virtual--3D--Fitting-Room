import { BodyParameters } from '../lib/supabase';

interface BodyControlsProps {
  parameters: BodyParameters;
  onChange: (parameters: BodyParameters) => void;
}

export default function BodyControls({ parameters, onChange }: BodyControlsProps) {
  const handleChange = (key: keyof BodyParameters, value: number) => {
    onChange({ ...parameters, [key]: value });
  };

  const controls = [
    { key: 'height' as const, label: 'Height', min: 140, max: 200, unit: 'cm' },
    { key: 'chest' as const, label: 'Chest', min: 70, max: 130, unit: 'cm' },
    { key: 'waist' as const, label: 'Waist', min: 60, max: 120, unit: 'cm' },
    { key: 'hips' as const, label: 'Hips', min: 75, max: 135, unit: 'cm' },
    { key: 'shoulders' as const, label: 'Shoulders', min: 30, max: 55, unit: 'cm' },
    { key: 'armLength' as const, label: 'Arm Length', min: 50, max: 70, unit: 'cm' },
    { key: 'legLength' as const, label: 'Leg Length', min: 70, max: 100, unit: 'cm' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-800">Body Adjustments</h3>
      <div className="space-y-5">
        {controls.map(({ key, label, min, max, unit }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-3 py-1 rounded-full">
                {parameters[key]} {unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={parameters[key]}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-colors"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
