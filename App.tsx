import React, { useState } from 'react';
import { GamePhase, Player, GameSettings, SecretData, RevealState } from './types';
import { generateSecretWord } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import RevealRoleScreen from './components/RevealRoleScreen';
import GameLoopScreen from './components/GameLoopScreen';

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [settings, setSettings] = useState<GameSettings>({
    imposterCount: 1,
    randomizeImposters: false,
    hintVisible: false,
    customTopic: '',
    language: 'en'
  });
  const [secretData, setSecretData] = useState<SecretData | null>(null);
  const [revealState, setRevealState] = useState<RevealState>({
    currentPlayerIndex: 0,
    isCardFlipped: false
  });
  const [startingPlayerIndex, setStartingPlayerIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [usedWords, setUsedWords] = useState<string[]>([]);

  // Helper to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleStartGame = async (playerList: Player[], gameSettings: GameSettings) => {
    setLoading(true);
    setPhase(GamePhase.LOADING);
    setSettings(gameSettings);

    try {
      // 1. Get Secret Word (pass history and language)
      const secret = await generateSecretWord(
        gameSettings.customTopic, 
        process.env.API_KEY, 
        usedWords,
        gameSettings.language
      );
      
      setSecretData(secret);
      
      // Update history (keep last 20 words)
      setUsedWords(prev => [secret.word, ...prev].slice(0, 20));

      // 2. Assign Roles
      let actualImposterCount = gameSettings.imposterCount;
      if (gameSettings.randomizeImposters) {
        // Random between 0 and N (inclusive)
        actualImposterCount = Math.floor(Math.random() * (gameSettings.imposterCount + 1));
      }

      const shuffledPlayers = shuffleArray(playerList);
      
      // Reset roles first
      shuffledPlayers.forEach(p => p.isImposter = false);

      // Assign imposters to the first N players in the shuffled list
      for (let i = 0; i < actualImposterCount; i++) {
        if (i < shuffledPlayers.length) {
            shuffledPlayers[i].isImposter = true;
        }
      }

      // Shuffle again so position 0 isn't always imposter if we iterate sequentially
      const finalPlayers = shuffleArray(shuffledPlayers);
      setPlayers(finalPlayers);
      
      // Select random starting player
      setStartingPlayerIndex(Math.floor(Math.random() * finalPlayers.length));
      
      // 3. Start Game
      setRevealState({ currentPlayerIndex: 0, isCardFlipped: false });
      setLoading(false);
      setPhase(GamePhase.REVEAL);

    } catch (e) {
      console.error("Failed to start game", e);
      setLoading(false);
      setPhase(GamePhase.SETUP); // Go back on error
      alert("Failed to generate game data. Please try again.");
    }
  };

  const handleNextPlayer = () => {
    const nextIndex = revealState.currentPlayerIndex + 1;
    if (nextIndex >= players.length) {
      setPhase(GamePhase.PLAYING);
    } else {
      setRevealState({
        currentPlayerIndex: nextIndex,
        isCardFlipped: false
      });
    }
  };

  const handleRestart = () => {
    setPhase(GamePhase.SETUP);
    setSecretData(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col items-center">
      <div className="w-full max-w-lg flex-1 flex flex-col">
        
        {phase === GamePhase.SETUP && (
          <SetupScreen 
            onStartGame={handleStartGame} 
            initialPlayerNames={players.length > 0 ? players.map(p => p.name) : undefined}
          />
        )}

        {phase === GamePhase.LOADING && (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-6">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold animate-pulse">Generating Secret...</p>
            <p className="text-slate-400 text-sm">Consulting the AI Oracle</p>
          </div>
        )}

        {phase === GamePhase.REVEAL && secretData && (
          <RevealRoleScreen 
            key={revealState.currentPlayerIndex} // Force re-mount to reset internal flip state
            player={players[revealState.currentPlayerIndex]}
            secretData={secretData}
            hintVisible={settings.hintVisible}
            onNext={handleNextPlayer}
          />
        )}

        {phase === GamePhase.PLAYING && secretData && (
          <GameLoopScreen 
            players={players}
            secretData={secretData}
            startingPlayer={players[startingPlayerIndex]}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
};

export default App;