// React
import React, { useEffect, useState } from "react";
// Components
import SpotTableCard from "../Cards/SpotTableCard";
import ActionsSwitcher from "../Switchers/ActionsSwitcher";
// Axios
import axios from "axios";
// Types
import { NetworkType, assetType } from "@/types/Types";
// Wagmi
import { useNetwork } from "wagmi";
// Constants
import {
  assetsArbitrum,
  assetsMainnet,
  assetsPolygon,
  assetsPolygonMumbai,
} from "../../../constants/Constants";
import Loader from "../Loader/Spinner";

export default function SpotTable() {
  const typesMembersTable = ["Portfolio", "All"];
  const [typeMember, setTypeMember] = useState<string>("Portfolio");
  const [assetsArrayCopy, setAssetsArrayCopy] = useState<assetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | null>(
    null
  );

  const { chain } = useNetwork();

  const fetchData = async (sortByNetwork: boolean) => {
    let copy: any[] = [];

    if (!sortByNetwork) {
      if (chain && chain.id === 80001) {
        copy = assetsPolygonMumbai;
      } else if (chain && chain.id === 42161) {
        copy = assetsArbitrum;
      } else if (chain && chain.id === 1) {
        copy = assetsMainnet;
      } else if (chain && chain.id === 137) {
        copy = assetsPolygon;
      }
    } else {
      if (selectedNetwork && selectedNetwork.id === 80001) {
        copy = assetsPolygonMumbai;
      } else if (selectedNetwork && selectedNetwork.id === 42161) {
        copy = assetsArbitrum;
      } else if (selectedNetwork && selectedNetwork.id === 1) {
        copy = assetsMainnet;
      } else if (selectedNetwork && selectedNetwork.id === 137) {
        copy = assetsPolygon;
      }
    }

    const promises = copy.map(async (asset) => {
      try {
        console.log(`Fetching data for ${asset.coingeckoApi}`);
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${asset.coingeckoApi}?x_cg_demo_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API}`
        );
        if (response.status === 200) {
          const data = response.data;
          asset.price = data?.market_data.current_price.usd;
          asset.marketCap = data?.market_data.market_cap.usd;
          asset.volumen24 = data?.market_data.total_volume.usd;
        } else {
          console.log("Error");
        }
      } catch (error) {
        asset.price = 0;
        asset.marketCap = 0;
        asset.volumen24 = 0;
      }
    });

    await Promise.all(promises).then(() => {
      setAssetsArrayCopy(copy);
      setLoading(false);
    });
  };

  useEffect(() => {
    return () => {
      fetchData(false);
    };
  }, []);

  useEffect(() => {
    fetchData(false);
  }, [chain]);

  useEffect(() => {
    fetchData(true);
  }, [selectedNetwork]);

  const getTypeMember = (action: string) => {
    setTypeMember(action);
  };

  return (
    <div className="mt-[20px] w-full h-[574px] pt-[24px] bg-white rounded-lg">
      <div className="grid grid-cols-7 pb-[26px] text-xl font-medium pr-[14px] border-b-1 border-gray-300 flex items-center">
        <div className="text-center col-span-2">Name</div>{" "}
        <div className="text-center">Price</div>{" "}
        <div className="text-center">Market Cap</div>{" "}
        <div className="text-center">Volume (24h)</div>{" "}
        <div className="text-center">Networks</div>
        <ActionsSwitcher
          actions={typesMembersTable}
          actionSelected={typeMember}
          getActionSelected={getTypeMember}
          className="h-[30px] p-[4px] w-[130px] rounded-full grid grid-cols-2 bg-white items-center text-center shadow-input text-xs"
          paddingButton="py-[3px]"
        />
      </div>
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="overflow-auto h-[590px]">
          {assetsArrayCopy.map((asset: assetType, index: number) => (
            <SpotTableCard asset={asset} key={asset.name} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
