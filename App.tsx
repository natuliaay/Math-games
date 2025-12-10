import React, { useState, useEffect, useMemo } from 'react';
import { generateGrid, checkBoard } from './utils/geometry';
import { Node, Triangle, ColorType, CheckResult } from './types';
import { TriangleBoard } from './components/TriangleBoard';
import { PaintControls } from './components/PaintControls';
import { Alien } from './components/Alien';
import { askAlien } from './services/alienService';

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Record<string, Node>>({});
  const [triangles, setTriangles] = useState<Triangle[]>([]);
  const [selectedColor, setSelectedColor] = useState<ColorType>(null);
  const [checkResult, setCheckResult] = useState<CheckResult>({ valid: true, invalidTriangles: [] });
  const [alienMessage, setAlienMessage] = useState<string>("Привіт! Допоможи мені розфарбувати цей щит.");
  const [alienMood, setAlienMood] = useState<'happy' | 'neutral' | 'concerned'>('neutral');
  const [isThinking, setIsThinking] = useState(false);
  const [level, setLevel] = useState(4);

  // Derived state to check if board is full
  const allColored = useMemo(() => {
    const nodeList = Object.values(nodes) as Node[];
    return nodeList.length > 0 && nodeList.every(n => n.color !== null);
  }, [nodes]);

  // Initialize Logic
  const initGame = (rows: number, savedColors?: Record<string, ColorType>) => {
    const { nodes: newNodes, triangles: newTriangles } = generateGrid(rows);
    
    if (savedColors) {
      Object.keys(newNodes).forEach(key => {
        if (savedColors[key] && newNodes[key]) {
          newNodes[key].color = savedColors[key];
        }
      });
    }

    setNodes(newNodes);
    setTriangles(newTriangles);
    setLevel(rows);
    setCheckResult({ valid: true, invalidTriangles: [] });
    // Don't reset message if loading, but if new game...
    if (!savedColors) {
       setAlienMessage("Новий рівень! Почнемо?");
       setAlienMood("neutral");
    }
  };

  // Initial mount
  useEffect(() => {
    initGame(4);
  }, []);

  // Handle Coloring
  const handleNodeClick = (id: string) => {
    if (!selectedColor) {
      setAlienMessage("Будь ласка, спочатку обери колір у баночці!");
      setAlienMood("neutral");
      return;
    }

    const newNodes = { ...nodes };
    newNodes[id] = { ...newNodes[id], color: selectedColor };
    setNodes(newNodes);

    // Reset previous errors if any, to allow user to retry without seeing old red lines
    if (!checkResult.valid) {
        setCheckResult({ valid: true, invalidTriangles: [] });
        setAlienMood('neutral');
        setAlienMessage("Так краще? Продовжуй.");
    }
  };

  const handleReset = () => {
    initGame(level);
    setAlienMessage("Почнемо спочатку!");
    setAlienMood("neutral");
  };

  const handleLevelChange = (newLevel: number) => {
    if (newLevel === level) return;
    initGame(newLevel);
    setAlienMessage(`Рівень змінено на ${newLevel === 4 ? 'Легкий' : newLevel === 6 ? 'Середній' : 'Складний'}!`);
  };

  const handleSave = () => {
    const saveData = {
        level,
        colors: Object.values(nodes).reduce((acc, node: Node) => {
            if (node.color) acc[node.id] = node.color;
            return acc;
        }, {} as Record<string, ColorType>)
    };
    try {
        localStorage.setItem('space-triangle-save', JSON.stringify(saveData));
        setAlienMessage("Прогрес збережено в бортовий журнал!");
        setAlienMood("happy");
    } catch (e) {
        setAlienMessage("Помилка збереження.");
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem('space-triangle-save');
    if (!saved) {
        setAlienMessage("Немає збережених ігор.");
        setAlienMood("concerned");
        return;
    }
    try {
        const data = JSON.parse(saved);
        if (data.level && data.colors) {
            initGame(data.level, data.colors);
            setAlienMessage("Гру відновлено!");
            setAlienMood("happy");
        }
    } catch (e) {
        console.error(e);
        setAlienMessage("Файл збереження пошкоджено.");
    }
  };

  const handleManualCheck = async () => {
    if (!allColored) {
        // Should be disabled in UI, but safe guard
        setAlienMessage("Спочатку розфарбуй усі вершини!");
        return;
    }

    setIsThinking(true);
    setAlienMessage("Хмм... аналізую...");
    
    // Perform standard logic check
    const result = checkBoard(nodes, triangles);
    setCheckResult(result);
    
    if (!result.valid) {
        setAlienMood("concerned");
    } else if ((Object.values(nodes) as Node[]).every(n => n.color !== null)) {
        setAlienMood("happy");
    } else {
        setAlienMood("neutral");
    }

    // Call Gemini for a flavored response
    const msg = await askAlien(nodes, triangles, result.invalidTriangles);
    setAlienMessage(msg);
    setIsThinking(false);
  };

  return (
    <div className="min-h-screen bg-space-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#1a1c2e] to-black text-white flex flex-col items-center py-8 px-4 overflow-hidden relative">
      
      {/* Background Stars (Simple CSS representation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(20)].map((_, i) => (
             <div 
                key={i} 
                className="absolute bg-white rounded-full opacity-70 animate-pulse"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3}px`,
                    height: `${Math.random() * 3}px`,
                    animationDelay: `${Math.random() * 2}s`
                }}
             />
         ))}
      </div>

      {/* Header / Task Description */}
      <header className="z-10 max-w-4xl w-full text-center mb-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-purple-400 to-neon-red drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          Космічна Пригода
        </h1>
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-xl">
           <p className="text-lg md:text-xl leading-relaxed text-slate-200">
             Великий трикутник складається з маленьких рівносторонніх трикутників. 
             <span className="text-neon-green font-bold mx-1">Розфарбуй</span> 
             в три кольори (червоний, синій, зелений) вершини маленьких трикутників так, 
             щоб не утворювалось <span className="text-neon-red font-bold underline decoration-wavy">жодного однокольорового</span> рівностороннього трикутника.
           </p>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="z-10 flex flex-col lg:flex-row items-center justify-center w-full gap-8 max-w-6xl">
        
        {/* Left: The Board */}
        <div className="flex-1 w-full flex justify-center order-2 lg:order-1">
          <TriangleBoard 
            nodes={nodes}
            triangles={triangles}
            invalidTriangles={checkResult.invalidTriangles}
            onNodeClick={handleNodeClick}
            selectedColor={selectedColor}
          />
        </div>

        {/* Right: Controls & Alien */}
        <div className="flex flex-col items-center gap-8 order-1 lg:order-2 w-full max-w-md">
            <Alien mood={alienMood} message={isThinking ? "Думаю..." : alienMessage} />
            
            <PaintControls 
              selectedColor={selectedColor}
              onColorSelect={setSelectedColor}
              onReset={handleReset}
              onCheck={handleManualCheck}
              currentLevel={level}
              onLevelChange={handleLevelChange}
              onSave={handleSave}
              onLoad={handleLoad}
              allColored={allColored}
            />
        </div>
      </main>

    </div>
  );
};

export default App;