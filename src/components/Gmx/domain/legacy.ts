import useWallet from "../lib/wallets/useWallet"

export function useHasOutdatedUi() {
    const { active } = useWallet();
  
    const url = getServerUrl(ARBITRUM, `/ui_version?client_version=${UI_VERSION}&active=${active}`);
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
      hasOutdatedUi = Boolean(localStorageVersion && parseFloat(localStorageVersion) > parseFloat(UI_VERSION));
    }
  
    return { data: hasOutdatedUi, mutate };
  }