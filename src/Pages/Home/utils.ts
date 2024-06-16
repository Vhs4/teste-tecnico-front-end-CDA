export const generateSequence = (): string[] => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = Math.floor(Math.random() * 10) + 5;
  const sequence: string[] = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    sequence.push(alphabet[randomIndex]);
  }
  return sequence;
};

export const checkKeyPress = (pressedKey: string, expectedKey: string): boolean => {
  return pressedKey === expectedKey;
};