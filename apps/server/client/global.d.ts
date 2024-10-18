// data hydrate

// e.g. window.__HYDRATE__['feeds.$get,query:id=41223694984583197']
declare global {
  interface Window {
    __HYDRATE__: Record<string, any>
  }
}

export {}
