export type Item = { id: string; title: string; url: string };

export type Source = { id: string; name: string; read: () => Promise<Item[]> };
