export function withId<T extends Record<string, unknown>>(
  doc: T,
): T & { id: string } {
  return { ...doc, id: String(doc._id) } as T & { id: string };
}

export function withIds<T extends Record<string, unknown>>(
  docs: T[],
): (T & { id: string })[] {
  return docs.map((doc) => withId(doc));
}
