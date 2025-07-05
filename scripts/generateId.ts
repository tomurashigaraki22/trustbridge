export function generateRandom9DigitInteger(): number {
  return Math.floor(100000000 + Math.random() * 900000000);
}
