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

type AnimeStore = {
  popularAnime: Anime[] | null;
  setPopularAnime: (data: Anime[]) => void;
  clearAnime: () => void;
};

export const useAnimeStore = create<AnimeStore>()(
  persist(
    (set) => ({
      popularAnime: null,
      setPopularAnime: (data) => set({ popularAnime: data }),
      clearAnime: () => set({ popularAnime: null }),
    }),
    {
      name: "anime-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
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
