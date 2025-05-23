import { useEffect, useState } from "react";
import { useAnimeStore } from "@/stores/useAnimeStore";
import axios from "axios";

export const usePopularAnime = () => {
  const { popularAnime, setPopularAnime } = useAnimeStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(popularAnime?.data || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shouldFetch = !popularAnime || isExpired(popularAnime.timestamp, 12);

    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    const fetchAnime = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/anime/order/1/popular"
        );
        if (response.data.success) {
          setPopularAnime(response.data.data.slice(0, 5));
          setData(response.data.data.slice(0, 5));
        }
        setLoading(false);
      } catch (error: any) {
        console.error("error in carousel: ", error.message);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchAnime();
  }, [popularAnime, setPopularAnime]);

  return { loading, data, error };
};

export const useNewAnime = () => {
  const { newAnime, setNewAnime } = useAnimeStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(newAnime?.data || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    const shouldFetch = !newAnime || isExpired(newAnime.timestamp, 12);
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    const fetchAnime = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/anime/order/1/latest"
        );
        if (response.data.success) {
          setNewAnime(response.data.data);
          setData(response.data.data);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("error in carousel: ", error.message);
        setLoading(false);
        setError(error.message);
      }
    };

    fetchAnime();
  }, [newAnime, setNewAnime]);

  return { loading, data, error };
};

const isExpired = (timestamp: number, maxAgeHours: number) => {
  const age = Date.now() - timestamp;
  return age > maxAgeHours * 60 * 60 * 1000;
};
