export enum GamePhase {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  REVEAL = 'REVEAL',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED'
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  hasSeenRole: boolean;
}

export type Language = 'en' | 'cs';

export interface GameSettings {
  imposterCount: number;
  randomizeImposters: boolean;
  hintVisible: boolean;
  customTopic: string;
  language: Language;
}

export interface SecretData {
  word: string;
  category: string;
}

export interface RevealState {
  currentPlayerIndex: number;
  isCardFlipped: boolean;
}