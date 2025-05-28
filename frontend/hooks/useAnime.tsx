import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Detail, useAnimeStore } from "@/stores/useAnimeStore";

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
          `http://localhost:5001/api/v1/anime/filter/1?order=popular`
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const isInitialLoad = page === 1;
        if (isInitialLoad) setLoading(true);
        else setLoadingMore(true);

        const response = await axios.get(
          `http://localhost:5001/api/v1/anime/filter/${page}?order=latest`
        );
        if (response.data.success) {
          setNewAnime(page, response.data.data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    const cachedData = newAnime[page];
    const shouldFetch = !cachedData || isExpired(cachedData.timestamp, 6);

    if (shouldFetch) {
      fetchAnime();
    } else {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, setNewAnime, newAnime]);

  const data = Object.values(newAnime).flatMap((pageData) => pageData.data);

  return { loading, data, error, page: setPage, loadingMore };
};

export const useFilter = () => {
  const { filter, setFilter } = useAnimeStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(
    () =>
      filter?.params || {
        type: "",
        order: "title",
        status: "",
        page: 1,
        genre: [] as string[],
      }
  );

  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (params: typeof filters) => {
      if (isFetching.current) return;

      isFetching.current = true;
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/v1/anime/filter/${params.page}`,
          {
            params: {
              type: params.type,
              order: params.order,
              status: params.status,
              genre: params.genre.join(","),
            },
          }
        );

        if (data.success) {
          setFilter({
            data: data.data,
            timestamp: Date.now(),
            params: { ...params },
          });
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [setFilter]
  );

  useEffect(() => {
    const paramsMatch =
      filter?.params &&
      JSON.stringify(filter.params) === JSON.stringify(filters);
    const isFresh = filter?.timestamp && !isExpired(filter.timestamp, 0.5);

    if (paramsMatch && isFresh) {
      setLoading(false);
      return;
    }

    fetchData(filters);
  }, [filters, fetchData, filter?.params, filter?.timestamp]);

  const updateFilter = useCallback((key: keyof typeof filters, value: any) => {
    setFilters((prev) => {
      if (JSON.stringify(prev[key]) === JSON.stringify(value)) return prev;

      return {
        ...prev,
        [key]: value,
        ...(key !== "page" && { page: 1 }),
        ...(key !== "order" && { order: "title" }),
      };
    });
  }, []);

  return {
    loading,
    data: filter?.data,
    error,
    filters,
    updateFilter,
    currentPage: filters.page,
    setPage: (page: number) => updateFilter("page", page),
  };
};

export const useDetail = (id: any) => {
  const { detail, setDetail } = useAnimeStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Detail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimeDetail = useCallback(async () => {
    try {
      const cachedData = detail[id];
      if (cachedData && !isExpired(cachedData.timestamp, 0.5)) {
        setData(cachedData.data);
        return;
      }
      const response = await axios.get(
        `http://localhost:5001/api/v1/anime/detail/${id}`
      );
      if (response.data.success) {
        const detailData = response.data.data;
        setData(detailData);
        setDetail(id, {
          ...detailData,
          totalEpisode: detailData.totalEpisode || 0,
          episode: detailData.episode || [],
        });
      }
    } catch (error: any) {
      console.error("error in carousel: ", error.message);
      setLoading(false);
      setError(error.message || "Failed to fetch anime details");
    } finally {
      setLoading(false);
    }
  }, [id, detail, setDetail]);

  useEffect(() => {
    fetchAnimeDetail();
  }, [id, fetchAnimeDetail]);

  return {
    loading,
    data,
    error,
    refresh: fetchAnimeDetail,
  };
};

export const useSearch = () => {
  const [search, setSearch] = useState("");
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!search) {
      setLoading(false);
      return;
    }

    const fetchSearch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/v1/anime/search/${search}`
        );
        if (res.data.success) {
          setAnime(res.data.data);
        }

        setLoading(false);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchSearch();
  }, [search]);

  return { data: anime, setSearch, search, loading, error };
};

const isExpired = (timestamp: number, maxAgeHours: number) => {
  const age = Date.now() - timestamp;
  return age > maxAgeHours * 60 * 60 * 1000;
};
