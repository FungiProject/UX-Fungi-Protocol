import { useState, useEffect } from "react";
import axios from "axios";

type UseCoinGeckoDataProps = {
  coinId: string;
};

export default function useCoinGeckoData({ coinId }: UseCoinGeckoDataProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [coinData, setCoinData] = useState<any | null>(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}`
        );
        const data = response.data;

        setCoinData(data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar datos de CoinGecko");
        setLoading(false);
      }
    };

    fetchCoinData();
  }, [coinId]);

  return { loading, error, coinData };
}
