function toPgVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export default toPgVector;
