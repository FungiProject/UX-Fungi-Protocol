import useSWR from "swr";
import { getServerUrl } from "../config/backend";
import { ARBITRUM } from "../config/chains";
import { UI_VERSION, isDevelopment } from "../config/env";
import useWallet from "../lib/wallets/useWallet";
import { REQUIRED_UI_VERSION_KEY } from "../config/localStorage";

export function useHasOutdatedUi() {
  const { active } = useWallet();

  const url = getServerUrl(
    ARBITRUM,
    `/ui_version?client_version=${UI_VERSION}&active=${active}`
  );
  const { data, mutate } = useSWR([url], {
    // @ts-ignore
    fetcher: (url) => fetch(url).then((res) => res.text()),
  });

  let hasOutdatedUi = false;

  if (data && parseFloat(data) > parseFloat(UI_VERSION)) {
    hasOutdatedUi = true;
  }

  if (isDevelopment()) {
    const localStorageVersion = localStorage.getItem(REQUIRED_UI_VERSION_KEY);
    hasOutdatedUi = Boolean(
      localStorageVersion &&
        parseFloat(localStorageVersion) > parseFloat(UI_VERSION)
    );
  }

  return { data: hasOutdatedUi, mutate };
}
