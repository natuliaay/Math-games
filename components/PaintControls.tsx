import React from 'react';
import { ColorType } from '../types';
import { Brush, RefreshCcw, CheckCircle, Save, Download, Signal, SignalMedium, SignalHigh } from 'lucide-react';

interface PaintControlsProps {
  selectedColor: ColorType;
  onColorSelect: (color: ColorType) => void;
  onReset: () => void;
  onCheck: () => void;
  currentLevel: number;
  onLevelChange: (level: number) => void;
  onSave: () => void;
  onLoad: () => void;
  allColored: boolean;
}

export const PaintControls: React.FC<PaintControlsProps> = ({
  selectedColor,
  onColorSelect,
  onReset,
  onCheck,
  currentLevel,
  onLevelChange,
  onSave,
  onLoad,
  allColored
}) => {
  const colors: { id: ColorType; hex: string; name: string; ring: string }[] = [
    { id: 'red', hex: '#ef4444', name: 'Червоний', ring: 'ring-red-500' },
    { id: 'green', hex: '#22c55e', name: 'Зелений', ring: 'ring-green-500' },
    { id: 'blue', hex: '#3b82f6', name: 'Синій', ring: 'ring-blue-500' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Top Bar: System Controls */}
      <div className="flex flex-col gap-3 bg-slate-800/80 p-4 rounded-2xl backdrop-blur-md border border-slate-700">
        <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-1">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Складність</span>
          <div className="flex gap-2">
            <button 
               onClick={() => onLevelChange(4)}
               className={`p-2 rounded-lg transition-all ${currentLevel === 4 ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'text-slate-400 hover:bg-slate-700'}`}
               title="Легкий"
            >
              <Signal size={16} />
            </button>
            <button 
               onClick={() => onLevelChange(6)}
               className={`p-2 rounded-lg transition-all ${currentLevel === 6 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-700'}`}
               title="Середній"
            >
              <SignalMedium size={16} />
            </button>
            <button 
               onClick={() => onLevelChange(8)}
               className={`p-2 rounded-lg transition-all ${currentLevel === 8 ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'text-slate-400 hover:bg-slate-700'}`}
               title="Складний"
            >
              <SignalHigh size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-center">
            <button 
                onClick={onSave}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors text-slate-200"
            >
                <Save size={16} /> Зберегти
            </button>
            <button 
                onClick={onLoad}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors text-slate-200"
            >
                <Download size={16} /> Завантажити
            </button>
        </div>
      </div>

      {/* Main Paint Controls */}
      <div className="flex flex-col items-center gap-6 bg-slate-800/50 p-6 rounded-3xl backdrop-blur-md border border-slate-700">
        <div className="flex gap-8 justify-center w-full">
          {colors.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-2">
              <button
                onClick={() => onColorSelect(c.id)}
                className={`
                  relative w-16 h-20 rounded-lg transition-all duration-300 transform hover:-translate-y-2
                  ${selectedColor === c.id ? `ring-4 ${c.ring} scale-110 shadow-lg shadow-${c.id}-500/50` : 'hover:scale-105'}
                `}
                style={{
                  background: `linear-gradient(to bottom, ${c.hex} 0%, ${c.hex} 70%, #1e293b 70%, #1e293b 100%)`,
                  boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)'
                }}
              >
                {/* Paint Drips */}
                <div 
                  className="absolute top-[70%] left-2 w-2 h-4 rounded-full opacity-80" 
                  style={{ backgroundColor: c.hex }}
                ></div>
                <div 
                  className="absolute top-[70%] right-4 w-3 h-6 rounded-full opacity-80" 
                  style={{ backgroundColor: c.hex }}
                ></div>
                
                {/* Lid/Rim */}
                <div className="absolute -top-1 left-0 right-0 h-2 bg-slate-300 rounded-sm"></div>
                
                {/* Handle */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-6 border-4 border-slate-400 rounded-t-full border-b-0"></div>
              </button>
              <span className="text-xs font-bold tracking-wider text-slate-300">{c.name.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-2 w-full justify-between">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-700 flex-1 justify-center">
            <Brush size={18} className={selectedColor ? `text-${selectedColor}-500` : 'text-slate-400'} />
            <span className="text-sm text-slate-300 whitespace-nowrap">
              {selectedColor ? 'Пензлик готовий!' : 'Обери фарбу'}
            </span>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={onCheck}
              disabled={!allColored}
              className={`p-3 rounded-full text-white transition-all shadow-lg group relative
                ${allColored 
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50 shadow-none'
                }
              `}
              title={allColored ? "Перевірити" : "Спочатку розфарбуй всі вершини"}
            >
              <CheckCircle size={24} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {allColored ? "Перевірити" : "Спочатку розфарбуй все"}
              </span>
            </button>

            <button 
              onClick={onReset}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors group relative"
              title="Очистити"
            >
              <RefreshCcw size={20} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">Скинути</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};