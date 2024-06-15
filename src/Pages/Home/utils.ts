// Arquivo utils.ts

// Função para gerar uma sequência aleatória de letras de A a Z
export const generateSequence = (): string[] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = Math.floor(Math.random() * 10) + 5; // Gera uma sequência de 5 a 14 letras
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    sequence.push(alphabet[randomIndex]);
  }
  return sequence;
};

// Função para verificar se a tecla pressionada está correta
export const checkKeyPress = (pressedKey: string, expectedKey: string): boolean => {
  return pressedKey === expectedKey;
};

interface ScoreEntry {
  name: string;
  score: number;
}

export const saveScore = (name: string, score: number): void => {
  const existingScores = getRanking();
  const updatedScores = [...existingScores.filter(entry => entry.name !== name), { name, score }];
  localStorage.setItem('ranking', JSON.stringify(updatedScores));
};

export const getRanking = (): ScoreEntry[] => {
  const rankingData = localStorage.getItem('ranking');
  if (!rankingData) {
    return [];
  }

  const scores: ScoreEntry[] = JSON.parse(rankingData);
  const uniqueScores: ScoreEntry[] = [];

  scores.forEach((score) => {
    const existingEntry = uniqueScores.find((entry) => entry.name === score.name);
    if (!existingEntry || score.score > existingEntry.score) {
      uniqueScores.push(score);
    }
  });

  return uniqueScores.sort((a, b) => b.score - a.score);
};
