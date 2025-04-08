export const knexUnwrapCount = (result: any) => {
  for (const [_, count] of Object.entries(result)) {
    return count as number;
  }

  throw new Error("Unreachable");
};
