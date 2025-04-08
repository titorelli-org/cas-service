export const splitIntoChunks = <T>(arr: T[], chunkSize: number) => {
  if (chunkSize <= 0) throw new Error("Chunk size must be positive");

  const chunks: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }

  return chunks;
};
