import React, { useEffect, useState } from 'react';
import { generateSequence, checkKeyPress } from './utils';

const Home: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleGameOver();
    }
  }, [timerRunning, timeLeft]);

  const startGame = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeLeft(10);
    setTimerRunning(true);
    highlightCurrent();
  };

  const highlightCurrent = () => {
    console.log(`Pressione a tecla: ${sequence[currentIndex]}`);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!gameOver) {
      const key = event.key.toUpperCase();
      if (checkKeyPress(key, sequence[currentIndex])) {
        if (currentIndex === sequence.length - 1) {
          console.log('Você ganhou!');
          setTimerRunning(false);
          startGame();
        } else {
          setCurrentIndex(currentIndex + 1);
          highlightCurrent();
        }
      } else {
        handleGameOver();
      }
    } else {
      startGame();
    }
  };

  const handleGameOver = () => {
    console.log('Game Over!');
    setGameOver(true);
    setTimerRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="mb-4 text-xl">Pressione as teclas na ordem correta:</div>
      <div className="text-2xl font-bold mb-4">{sequence.join(' ')}</div>
      <div className="text-lg mb-4">Pressione as teclas:</div>
      <div className="flex space-x-4">
        {sequence.map((key, index) => (
          <div
            key={index}
            className={`py-2 px-4 border rounded-lg cursor-pointer ${
              index === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {key}
          </div>
        ))}
      </div>
      <div className="mt-8 text-lg">
        {timerRunning && `Tempo restante: ${timeLeft}s`}
        {gameOver && (
          <p className='text-red-400'>Game Over! Pressione qualquer tecla para iniciar um novo jogo.</p>
        )}
      </div>

      <input
        type="text"
        className="opacity-100 bg-transparent border-none outline-none text-transparent w-0 h-0"
        autoFocus
        onKeyDown={handleKeyPress}
      />
    </div>
  );
};

export default Home;