import React, { useEffect, useState } from 'react';
import { generateSequence, checkKeyPress } from './utils';
import { toast, ToastContainer } from 'react-toastify';

const Home: React.FC = () => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [usersScores, setUsersScores] = useState<{ username: string; score: number }[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  useEffect(() => {
    const savedScore = localStorage.getItem(`${username}-score`);
    if (savedScore) {
      setScore(parseInt(savedScore, 10));
    }

    const scores = getAllUsersScores();
    setUsersScores(scores);

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setLoggedIn(true);
    }
  }, [username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleGameOver();
    }

    return () => clearTimeout(timer);
  }, [timeLeft, gameOver]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (loggedIn && !gameOver && event.key === 'Escape') {
        if (window.confirm('Deseja sair do usuário?')) {
          handleLogout();
        }
      }
    };

    if (loggedIn) {
      document.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (loggedIn) {
        document.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [loggedIn, gameOver]);
  const createUser = () => {
    if (username.trim() === '' || password.trim() === '') {
      toast.info('Por favor, preencha usuário e senha.');
      return;
    }

    // Verifica se o usuário já existe
    if (localStorage.getItem(username)) {
      toast.error('Este usuário já existe. Por favor, escolha outro nome.');
      return;
    }

    localStorage.setItem(username, password);
    toast.success(`Usuário ${username} criado com sucesso!`);
    setShowCreateModal(false);
  };

  const login = () => {
    const savedPassword = localStorage.getItem(username);

    if (savedPassword === password) {
      toast.done(`Bem-vindo, ${username}!`);
      setLoggedIn(true);
      localStorage.setItem('username', username);
      startGame();
    } else {
      toast.error('Senha incorreta. Tente novamente.');
    }
  };

  const startGame = () => {
    const newSequence = generateSequence();
    setSequence(newSequence);
    setCurrentIndex(0);
    setGameOver(false);
    setTimeLeft(20);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!gameOver) {
      const key = event.key.toUpperCase();
      if (checkKeyPress(key, sequence[currentIndex])) {
        if (currentIndex === sequence.length - 1) {
          handleCorrectSequence();
        } else {
          setCurrentIndex(currentIndex + 1);
        }
      } else {
        handleGameOver();
      }
    } else {
      startGame();
    }
  };

  const handleCorrectSequence = () => {
    const newScore = score + sequence.length;
    setScore(newScore);
    localStorage.setItem(`${username}-score`, String(newScore));

    if (sequence.length < 10) {
      startGame();
    } else {
      toast.success('Muite bem, continue assim!');
      startGame();
    }
  };

  const handleGameOver = () => {
    toast.error('Game Over! Sua pontuação final: ' + score);
    setGameOver(true);
    setScore(0);
  };

  const handleCreateUser = () => {
    setShowCreateModal(true);
  };

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername('');
    setPassword('');
    localStorage.removeItem('username');
    toast.info('Usuário desconectado.');
  };

  const handleShowRanking = () => {
    const sortedScores = [...usersScores].sort((a, b) => b.score - a.score);
    setUsersScores(sortedScores);
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const getAllUsersScores = () => {
    const scores: { username: string; score: number }[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-score')) {
        const username = key.split('-')[0];
        const score = parseInt(localStorage.getItem(key) || '0', 10);
        scores.push({ username, score });
      }
    }
    return scores;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />
      {!loggedIn && (
        <>
          <div className="mb-4 w-full md:w-1/2 flex flex-col items-center justify-center space-y-4">
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 w-full md:w-auto"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 w-full md:w-auto"
            />
            <div className="flex flex-col space-y-4 items-center justify-center">
              <button onClick={handleLogin} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:bg-green-600">
                Login
              </button>
              <p>Não tem uma conta?</p>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                Criar Usuário
              </button>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-4">
            <button onClick={handleShowRanking} className="px-4 py-2 w-full md:w-1/2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600">
              Ver Ranking Geral
            </button>
            <p className="font-semibold text-lg mt-4">Caso queira desconectar da sua conta pressione ESC</p>
          </div>
        </>
      )}
      {loggedIn && (
        <>
          <div className="mb-4 text-xl">Pressione as teclas na ordem correta:</div>
          <div className="text-2xl font-bold">{sequence.join(' ')}</div>
          <div className="text-lg my-8">
            Tempo restante: <span className="font-bold">{timeLeft}</span> segundos
          </div>
          <div className="text-lg my-8">
            Pontuação: <span className="font-bold">{score}</span>
          </div>
          <div className="text-lg my-8">Pressione as teclas:</div>
          <div className="flex space-x-4">
            {sequence.map((key, index) => (
              <div
                key={index}
                className={`py-2 px-4 border rounded-lg cursor-pointer ${index === currentIndex ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {key}
              </div>
            ))}
          </div>
          <div className="mt-8 text-lg text-red-600">
            {gameOver && 'Game Over! Pressione qualquer tecla para iniciar um novo jogo.'}
          </div>
          <input
            type="text"
            className="opacity-100 bg-transparent border-none outline-none text-transparent w-0 h-0"
            autoFocus
            onKeyDown={handleKeyPress}
          />
        </>
      )}

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleCloseModal}></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <div className="w-full flex justify-between mb-4 gap-x-12">
              <h2 className="text-2xl font-bold">Ranking Geral</h2>
              <button onClick={handleCloseModal} className="font-bold border-2 rounded-full px-2 border-black">
                X
              </button>
            </div>
            <ul>
              {usersScores.map((user, index) => (
                <li key={index} className="text-lg mb-2">
                  {user.username}: {user.score} pontos
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
          <div className="absolute w-full h-full bg-gray-900 opacity-50" onClick={handleCloseCreateModal}></div>
          <div className="bg-white p-8 rounded-lg z-10">
            <h2 className="text-2xl font-bold mb-4">Criar Usuário</h2>
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded mr-2 px-3 py-1 mb-2"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded mr-2 px-3 py-1 mb-4"
            />
            <div className="flex justify-end">
              <button onClick={createUser} className="px-4 py-1 bg-blue-500 text-white rounded">
                Criar
              </button>
              <button onClick={handleCloseCreateModal} className="ml-2 px-4 py-1 bg-gray-300 text-black rounded">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default Home;
