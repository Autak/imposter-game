import React, { useState, useEffect } from 'react';
import { GameSettings, Player } from '../types';
import { Icons, MIN_PLAYERS, MAX_PLAYERS } from '../constants';
import Button from './Button';
import Input from './Input';

interface SetupScreenProps {
  onStartGame: (players: Player[], settings: GameSettings) => void;
  initialPlayerNames?: string[];
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, initialPlayerNames = [] }) => {
  const [names, setNames] = useState<string[]>(['', '', '']);
  const [settings, setSettings] = useState<GameSettings>({
    imposterCount: 1,
    randomizeImposters: false,
    hintVisible: false,
    customTopic: '',
    language: 'en'
  });

  // Initialize with previous names if available, ensuring at least 3 fields
  useEffect(() => {
    if (initialPlayerNames.length > 0) {
      const newNames = [...initialPlayerNames];
      while (newNames.length < 3) {
        newNames.push('');
      }
      setNames(newNames);
    }
  }, [initialPlayerNames]);

  const validNamesCount = names.filter(n => n.trim().length > 0).length;

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const addPlayer = () => {
    if (names.length < MAX_PLAYERS) {
      setNames([...names, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (names.length > MIN_PLAYERS) {
      const newNames = names.filter((_, i) => i !== index);
      setNames(newNames);
    }
  };

  const handleStart = () => {
    // Filter out empty names
    const validNames = names.map(n => n.trim()).filter(n => n.length > 0);
    
    if (validNames.length < MIN_PLAYERS) {
      alert(`You need at least ${MIN_PLAYERS} players to start.`);
      return;
    }

    const players: Player[] = validNames.map((name, i) => ({
      id: `p-${i}-${Date.now()}`,
      name,
      isImposter: false, // will be set by app
      hasSeenRole: false
    }));

    onStartGame(players, settings);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in">
      {/* Logo Header */}
      <div className="flex flex-col items-center justify-center pt-4 pb-2">
        <div className="flex items-start relative">
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none select-none">
            IES
          </h1>
          <div className="w-3 h-3 bg-indigo-500 mt-2 ml-1"></div>
        </div>
        
        <h2 className="text-2xl font-black tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-1 ml-1 select-none">
          IMPOSTER
        </h2>
        
        <p className="text-slate-400 text-sm mt-4">Trust no one. Hint carefully.</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Icons.Users /> Players ({names.length})
          </h2>
          {names.length < MAX_PLAYERS && (
            <button 
              onClick={addPlayer}
              className="text-indigo-400 text-sm font-semibold hover:text-indigo-300"
            >
              + Add Player
            </button>
          )}
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto p-1 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {names.map((name, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder={`Player ${index + 1} Name`}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                autoFocus={index === names.length - 1 && index > 2}
              />
              {names.length > MIN_PLAYERS && (
                <button 
                  onClick={() => removePlayer(index)}
                  className="p-3 text-slate-500 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
        <h2 className="text-lg font-bold text-white border-b border-slate-700 pb-2">Game Settings</h2>

        {/* Language Selection */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-slate-300">
            <Icons.Globe /> Language
          </span>
          <div className="flex bg-slate-700 rounded-lg p-1">
             <button 
               className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${settings.language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setSettings({...settings, language: 'en'})}
             >
               EN
             </button>
             <button 
               className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${settings.language === 'cs' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
               onClick={() => setSettings({...settings, language: 'cs'})}
             >
               CS
             </button>
          </div>
        </div>

        {/* Imposter Count Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">Imposters</span>
            <span className="font-bold text-indigo-400">{settings.imposterCount}</span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, Math.floor((names.length - 1) / 2))} 
            value={settings.imposterCount}
            onChange={(e) => setSettings({...settings, imposterCount: parseInt(e.target.value)})}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-xs text-slate-500">Max imposters is half the player count minus one.</p>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
                <Icons.Shuffle /> Randomize Count
              </span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.randomizeImposters}
                  onChange={(e) => setSettings({...settings, randomizeImposters: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
            </label>
            <p className="text-xs text-slate-500 -mt-2">If enabled, actual imposters will be 0 to {settings.imposterCount}.</p>

            <label className="flex items-center justify-between cursor-pointer group pt-2">
              <span className="flex items-center gap-2 text-slate-300 group-hover:text-white transition-colors">
                <Icons.Eye /> Hint Visible
              </span>
              <div className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.hintVisible}
                  onChange={(e) => setSettings({...settings, hintVisible: e.target.checked})}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
            </label>
            <p className="text-xs text-slate-500 -mt-2">Imposters will see the category/hint too.</p>
        </div>

        {/* Custom Topic */}
        <div className="pt-2">
           <Input
             label="Custom Topic (Optional)"
             placeholder="e.g. 90s Movies, Tech, Fruits"
             value={settings.customTopic}
             onChange={(e) => setSettings({...settings, customTopic: e.target.value})}
           />
        </div>
      </div>

      <Button fullWidth onClick={handleStart} disabled={validNamesCount < MIN_PLAYERS}>
        Start Game
      </Button>
    </div>
  );
};

export default SetupScreen;