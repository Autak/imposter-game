import React, { useState } from 'react';
import { Player, SecretData } from '../types';
import { Icons } from '../constants';
import Button from './Button';

interface RevealRoleScreenProps {
  player: Player;
  secretData: SecretData;
  hintVisible: boolean;
  onNext: () => void;
}

const RevealRoleScreen: React.FC<RevealRoleScreenProps> = ({ 
  player, 
  secretData, 
  hintVisible,
  onNext 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="max-w-md mx-auto min-h-[400px] flex flex-col justify-center p-6 pb-12">
      
      {!isFlipped ? (
        <div className="text-center space-y-8 animate-fade-in py-10">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
              <Icons.User />
            </div>
            <h2 className="text-3xl font-bold">Pass to {player.name}</h2>
            <p className="text-slate-400">Keep the screen hidden from others.</p>
          </div>
          
          <Button 
            onClick={() => setIsFlipped(true)} 
            className="w-full py-8 text-xl"
          >
            Tap to Reveal Identity
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in flex flex-col items-center">
          {/* Card Container - using flex layout instead of absolute/aspect-ratio to prevent overlaps */}
          <div className={`w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl transition-all duration-500 border-2 min-h-[420px] ${
                player.isImposter 
                  ? 'bg-gradient-to-br from-red-900 to-slate-900 border-red-500/50' 
                  : 'bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/50'
              }`}
            >
              <div className="mb-6 mt-4">
                {player.isImposter ? (
                  <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto">
                    <Icons.Mask />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
                    <Icons.Eye />
                  </div>
                )}
              </div>

              <h3 className={`text-xl font-bold tracking-widest uppercase mb-2 ${player.isImposter ? 'text-red-400' : 'text-indigo-400'}`}>
                You are {player.isImposter ? 'an' : 'a'}
              </h3>
              
              <h1 className="text-4xl font-black text-white mb-8 tracking-tight">
                {player.isImposter ? 'IMPOSTER' : 'CITIZEN'}
              </h1>

              {player.isImposter ? (
                <div className="space-y-4 bg-black/30 p-5 rounded-xl w-full mb-4">
                  <p className="text-slate-300 text-sm">Blend in. Don't let them know you don't know the word.</p>
                  {hintVisible && (
                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs uppercase text-slate-500 font-bold mb-1">Category Hint</p>
                      <p className="text-yellow-400 font-bold text-lg">{secretData.category}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 bg-black/30 p-5 rounded-xl w-full mb-4">
                  <div>
                    <p className="text-xs uppercase text-slate-500 font-bold mb-1">Secret Word</p>
                    <p className="text-3xl font-black text-white">{secretData.word}</p>
                  </div>
                   <div className="pt-3 border-t border-white/10">
                       <p className="text-xs uppercase text-slate-500 font-bold mb-1">Category</p>
                       <p className="text-indigo-200 text-lg font-bold">{secretData.category}</p>
                     </div>
                </div>
              )}
            </div>

          <div className="w-full">
            <Button fullWidth onClick={onNext} variant="secondary">
              I Understand
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevealRoleScreen;