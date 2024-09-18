export const isElectronBuild = ELECTRON
export const isWebBuild = !ELECTRON

export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
