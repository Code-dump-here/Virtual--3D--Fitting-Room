import { useEffect, useRef } from 'react';
import { BodyParameters } from '../lib/supabase';

interface UnityViewerProps {
  bodyParameters: BodyParameters;
  selectedClothingPath?: string;
  onUnityReady?: () => void;
}

declare global {
  interface Window {
    unityInstance?: any;
    sendMessageToUnity?: (objectName: string, methodName: string, value: string) => void;
  }
}

export default function UnityViewer({ bodyParameters, selectedClothingPath, onUnityReady }: UnityViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.unityInstance && bodyParameters) {
      window.sendMessageToUnity?.('BodyController', 'UpdateBodyParameters', JSON.stringify(bodyParameters));
    }
  }, [bodyParameters]);

  useEffect(() => {
    if (window.unityInstance && selectedClothingPath) {
      window.sendMessageToUnity?.('ClothingController', 'LoadClothing', selectedClothingPath);
    }
  }, [selectedClothingPath]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
      <div ref={containerRef} id="unity-container" className="w-full h-full">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white px-6">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Unity WebGL Integration</h3>
              <p className="text-slate-300 mb-4">
                Place your Unity WebGL build files in the public folder and configure the loader script
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-left text-sm max-w-md mx-auto">
              <p className="font-mono text-slate-400 mb-2">Setup Instructions:</p>
              <ol className="space-y-2 text-slate-300">
                <li>1. Build your Unity project for WebGL</li>
                <li>2. Copy build files to <span className="font-mono bg-slate-700 px-1 rounded">/public/Build/</span></li>
                <li>3. Add Unity loader script to index.html</li>
                <li>4. Initialize Unity with body and clothing controllers</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
