import React, { useState } from 'react';
import { Player, SecretData } from '../types';
import { Icons } from '../constants';
import Button from './Button';

interface GameLoopScreenProps {
  players: Player[];
  secretData: SecretData;
  startingPlayer: Player;
  onRestart: () => void;
}

const GameLoopScreen: React.FC<GameLoopScreenProps> = ({ players, secretData, startingPlayer, onRestart }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="max-w-md mx-auto p-6 space-y-8 animate-fade-in pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Discuss & Vote</h2>
        <p className="text-slate-400">Give hints about the object. Catch the Imposter!</p>
      </div>

      {!revealed ? (
        <>
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 text-center space-y-4">
             <div className="w-16 h-16 bg-indigo-600/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icons.User />
             </div>
             
             <div className="pb-4 border-b border-slate-700">
                <p className="text-slate-400 text-xs uppercase font-bold mb-1">Who starts?</p>
                <p className="text-xl font-bold text-white animate-pulse">
                   {startingPlayer.name}
                </p>
                <p className="text-slate-400 text-sm mt-1">should give the first hint.</p>
             </div>

             <p className="text-slate-300 text-sm pt-2">
               Then go around the circle.
               <br/>
               <span className="font-bold text-white">Imposter:</span> Blend in.
               <br/>
               <span className="font-bold text-white">Citizens:</span> Prove you know it.
             </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase">Players</h3>
            <div className="grid grid-cols-2 gap-3">
              {players.map(p => (
                <div key={p.id} className={`p-3 rounded-lg text-center border ${p.id === startingPlayer.id ? 'bg-indigo-900/30 border-indigo-500/50 ring-1 ring-indigo-500/30' : 'bg-slate-800 border-slate-700'}`}>
                   <span className={`font-medium truncate block ${p.id === startingPlayer.id ? 'text-indigo-300' : 'text-slate-200'}`}>
                     {p.name} {p.id === startingPlayer.id && '★'}
                   </span>
                </div>
              ))}
            </div>
          </div>

          <div className="fixed bottom-6 left-6 right-6">
             <Button fullWidth variant="danger" onClick={() => setRevealed(true)}>
               Reveal Identities
             </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center bg-slate-800 p-6 rounded-2xl border border-indigo-500/30">
            <p className="text-sm text-slate-400 uppercase font-bold mb-2">The Secret Word Was</p>
            <h1 className="text-4xl font-black text-white mb-2">{secretData.word}</h1>
            <p className="text-indigo-300">{secretData.category}</p>
          </div>

          <div className="space-y-3">
             <h3 className="text-sm font-bold text-slate-500 uppercase">Results</h3>
             {players.map(p => (
               <div 
                key={p.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  p.isImposter 
                    ? 'bg-red-900/20 border-red-500/30' 
                    : 'bg-slate-800 border-slate-700'
                }`}
               >
                 <span className="font-bold text-white">{p.name}</span>
                 {p.isImposter ? (
                   <span className="flex items-center gap-2 text-red-400 font-bold text-sm">
                     <Icons.Mask /> IMPOSTER
                   </span>
                 ) : (
                   <span className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                     <Icons.User /> Citizen
                   </span>
                 )}
               </div>
             ))}
          </div>

          <div className="fixed bottom-6 left-6 right-6">
             <Button fullWidth onClick={onRestart}>
               <div className="flex items-center justify-center gap-2">
                 <Icons.Refresh /> Play Again
               </div>
             </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameLoopScreen;