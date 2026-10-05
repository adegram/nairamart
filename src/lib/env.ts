/** Returns true when every listed server env var has a value. */
export function hasEnv(...names: string[]): boolean {
  return names.every((n) => Boolean(process.env[n]));
}
