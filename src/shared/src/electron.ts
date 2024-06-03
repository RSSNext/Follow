import { DEEPLINK_SCHEME } from "@shared/constants";

const ELECTRON_QUERY_KEY = "__electron";
export interface OpenElectronWindowOptions {
  resizeable?: boolean;
  height?: number;
  width?: number;
}

/**
 * Work electron and browser,
 * if in electron, open a new window, otherwise open a new tab
 */
export const openElectronWindow = async (
  url: string,
  options: OpenElectronWindowOptions = {}
) => {
  if (window.electron) {
    const urlObject = new URL(url);
    const searchParams = urlObject.searchParams;

    searchParams.set(
      ELECTRON_QUERY_KEY,
      encodeURIComponent(JSON.stringify(options))
    );

    window.open(urlObject.toString());
  } else {
    window.open(url.replace(DEEPLINK_SCHEME, `${location.origin}/`));
  }
};

export const extractElectronWindowOptions = (
  url: string
): OpenElectronWindowOptions => {
  try {
    const urlObject = new URL(url);
    const searchParams = urlObject.searchParams;
    const options = searchParams.get(ELECTRON_QUERY_KEY);
    if (options) {
      return JSON.parse(decodeURIComponent(options));
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};
