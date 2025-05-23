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

type CachedData<T> = {
  data: T;
  timestamp: number; // in ms
};

type AnimeStore = {
  popularAnime: CachedData<Anime[]> | null;
  newAnime: CachedData<Anime[]> | null;
  setPopularAnime: (data: Anime[]) => void;
  setNewAnime: (data: Anime[]) => void;
  clearAnime: () => void;
};

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set) => ({
      popularAnime: null,
      newAnime: null,

      setPopularAnime: (data) =>
        set({ popularAnime: { data, timestamp: Date.now() } }),
      setNewAnime: (data) => set({ newAnime: { data, timestamp: Date.now() } }),
      clearAnime: () => set({ popularAnime: null, newAnime: null }),
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
