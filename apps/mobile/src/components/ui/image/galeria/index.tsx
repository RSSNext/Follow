import type { Galeria as GaleriaInterface } from "./index.ios"

const Galeria: typeof GaleriaInterface = Object.assign(
  {},
  {
    Image: () => null,
  },
) as unknown as typeof GaleriaInterface

export { Galeria }
