import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

// Hook personalizado para realizar peticiones HTTP y manejar estados de carga y error.
export const useFetch = (url, options = {}, auto = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi(url, options);
      setData(res);
    } catch (err) {
      setError("Error al cargar los datos.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auto) fetchData();
    // eslint-disable-next-line
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};