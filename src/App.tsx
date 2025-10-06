import { useState, useEffect } from 'react';
import { Settings, RotateCcw, Save } from 'lucide-react';
import UnityViewer from './components/UnityViewer';
import BodyControls from './components/BodyControls';
import ClothingSelector from './components/ClothingSelector';
import PresetSelector from './components/PresetSelector';
import { BodyParameters, BodyPreset, ClothingItem } from './lib/supabase';

const defaultBodyParameters: BodyParameters = {
  height: 170,
  chest: 90,
  waist: 75,
  hips: 95,
  shoulders: 40,
  armLength: 60,
  legLength: 85,
};

function App() {
  const [bodyParameters, setBodyParameters] = useState<BodyParameters>(defaultBodyParameters);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | undefined>();
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const savedParams = localStorage.getItem('bodyParameters');
    if (savedParams) {
      try {
        setBodyParameters(JSON.parse(savedParams));
      } catch (error) {
        console.error('Error loading saved parameters:', error);
      }
    }
  }, []);

  const handleBodyParametersChange = (params: BodyParameters) => {
    setBodyParameters(params);
  };

  const handlePresetSelect = (preset: BodyPreset) => {
    setBodyParameters(preset.parameters);
  };

  const handleReset = () => {
    setBodyParameters(defaultBodyParameters);
    localStorage.removeItem('bodyParameters');
  };

  const handleSave = () => {
    localStorage.setItem('bodyParameters', JSON.stringify(bodyParameters));
    alert('Body configuration saved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Virtual Fitting Room</h1>
              <p className="text-sm text-slate-600 mt-1">Visualize clothing on customizable 3D models</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save Config
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={() => setShowControls(!showControls)}
                className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-200px)]">
            <UnityViewer
              bodyParameters={bodyParameters}
              selectedClothingPath={selectedClothing?.model_path}
            />
          </div>

          <div className="space-y-6">
            {showControls && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <PresetSelector onSelect={handlePresetSelect} />
              </div>
            )}

            {showControls && (
              <div className="bg-white rounded-xl shadow-lg p-6 max-h-[calc(100vh-400px)] overflow-y-auto">
                <BodyControls
                  parameters={bodyParameters}
                  onChange={handleBodyParametersChange}
                />
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-6">
              <ClothingSelector
                onSelect={setSelectedClothing}
                selectedItem={selectedClothing}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
