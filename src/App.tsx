import React, { useState } from 'react';
import { ScreenType } from './types.ts';
import { PinScreen } from './components/PinScreen.tsx';
import { WishesScreen } from './components/WishesScreen.tsx';
import { CandleScreen } from './components/CandleScreen.tsx';
import { SurpriseMenuScreen } from './components/SurpriseMenuScreen.tsx';
import { MemoriesScreen } from './components/MemoriesScreen.tsx';
import { ReasonsScreen } from './components/ReasonsScreen.tsx';
import { OpenWhenScreen } from './components/OpenWhenScreen.tsx';
import { GiftBoxScreen } from './components/GiftBoxScreen.tsx';
import { FinalLetterScreen } from './components/FinalLetterScreen.tsx';
import { FloatingParticles } from './components/FloatingParticles.tsx';
import { MusicController } from './components/MusicController.tsx';
import { PersonalizeModal } from './components/PersonalizeModal.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('pin');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);

  // Transition handlers
  const handlePinSuccess = () => {
    setIsUnlocked(true);
    setCurrentScreen('wishes');
  };

  const handleWishesContinue = () => {
    setCurrentScreen('candle');
  };

  const handleCandleBlown = () => {
    setCurrentScreen('menu');
  };

  const handleSelectSubScreen = (screen: ScreenType) => {
    setCurrentScreen(screen);
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
  };

  const handleProceedToLetter = () => {
    setCurrentScreen('letter');
  };

  const handleReplayFromStart = () => {
    setCurrentScreen('pin');
  };

  const handleNavigateDirect = (screen: ScreenType) => {
    if (screen !== 'pin') {
      setIsUnlocked(true);
    }
    setCurrentScreen(screen);
  };

  return (
    <div className="relative min-h-screen bg-[#180512] bg-radial from-[#380e22] via-[#200615] to-[#12030d] text-[#fce7f3] overflow-x-hidden">
      {/* Romantic Ambient Particles (Floating Hearts & Stars) */}
      <FloatingParticles />

      {/* Persistent Audio & Personalization Controls */}
      <MusicController
        onPersonalizeClick={() => setShowPersonalizeModal(true)}
      />

      {/* Screen Navigator Modal for Personalization / Quick Preview */}
      <PersonalizeModal
        isOpen={showPersonalizeModal}
        onClose={() => setShowPersonalizeModal(false)}
        onNavigate={handleNavigateDirect}
        currentScreen={currentScreen}
      />

      {/* Screen Views */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-center">
        {currentScreen === 'pin' && (
          <PinScreen onUnlockSuccess={handlePinSuccess} />
        )}

        {currentScreen === 'wishes' && (
          <WishesScreen onContinue={handleWishesContinue} />
        )}

        {currentScreen === 'candle' && (
          <CandleScreen onCandleBlown={handleCandleBlown} />
        )}

        {currentScreen === 'menu' && (
          <SurpriseMenuScreen onSelectScreen={handleSelectSubScreen} />
        )}

        {currentScreen === 'memories' && (
          <MemoriesScreen onBack={handleBackToMenu} />
        )}

        {currentScreen === 'reasons' && (
          <ReasonsScreen onBack={handleBackToMenu} />
        )}

        {currentScreen === 'envelopes' && (
          <OpenWhenScreen onBack={handleBackToMenu} />
        )}

        {currentScreen === 'gift' && (
          <GiftBoxScreen
            onBack={handleBackToMenu}
            onProceedToLetter={handleProceedToLetter}
          />
        )}

        {currentScreen === 'letter' && (
          <FinalLetterScreen
            onBackToMenu={handleBackToMenu}
            onReplayFromStart={handleReplayFromStart}
          />
        )}
      </main>
    </div>
  );
}
