import { useEffect, useState } from "react";
import { useAnimeStore } from "@/stores/useAnimeStore";
import axios from "axios";

const usePopularAnime = () => {
  const { popularAnime, setPopularAnime } = useAnimeStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      if (popularAnime && popularAnime.length > 0) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5001/api/v1/anime/order/1/popular"
        );
        if (response.data.success) {
          setPopularAnime(response.data.data.slice(0, 5));
        }
        setLoading(false);
      } catch (error: any) {
        console.error("error in carousel: ", error.message);
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  return { loading, data: popularAnime };
};

export default usePopularAnime;
