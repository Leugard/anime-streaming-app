import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Anime = {
  id: string;
  title: string;
  thumbnail: string;
  //   genre: string;
  //   rating: string;
};

export type Detail = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  genres: string[];
  rating: number;
  totalEpisode: string;
  episode: { id: string; title: string }[];
};

type FilterParams = {
  page: number;
  type: string;
  order: string;
  status: string;
  genre: string[];
};

type CachedData<T> = {
  data: T;
  timestamp: number;
  params?: FilterParams;
};

type AnimeStore = {
  popularAnime: CachedData<Anime[]> | null;
  newAnime: CachedData<Anime[]> | null;
  filter: CachedData<Anime[]> | null;
  detail: Record<string, CachedData<Detail>>;
  setPopularAnime: (data: Anime[]) => void;
  setNewAnime: (data: Anime[]) => void;
  setFilter: (data: CachedData<Anime[]>) => void;
  setDetail: (id: string, data: Detail) => void;
  clearAnime: () => void;
};

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set) => ({
      popularAnime: null,
      newAnime: null,
      filter: null,
      detail: {},

      setPopularAnime: (data) =>
        set({ popularAnime: { data, timestamp: Date.now() } }),
      setNewAnime: (data) => set({ newAnime: { data, timestamp: Date.now() } }),
      setFilter: (data: CachedData<Anime[]>) => set({ filter: data }),
      setDetail: (id, data) =>
        set((state) => ({
          detail: {
            ...state.detail,
            [id]: { data, timestamp: Date.now() },
          },
        })),
      clearAnime: () =>
        set({ popularAnime: null, newAnime: null, filter: null, detail: {} }),
    }),
    {
      name: "anime-storage",
      storage: {
        getItem: async (name) => {
          const value: any = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
