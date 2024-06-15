import React from 'react';

interface Props {
  scores: { username: string; score: number }[];
  onClose: () => void;
}

const RankingModal: React.FC<Props> = ({ scores, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative bg-white rounded-lg shadow-lg p-8 max-w-md">
        <h2 className="text-xl font-bold mb-4">Ranking Geral</h2>
        <ul>
          {scores.map((user, index) => (
            <li key={index} className="text-lg mb-2">
              {`${user.username}: ${user.score} pontos`}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default RankingModal;
