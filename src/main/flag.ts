let shouldAppDoHide = process.platform === "darwin"

export const getShouldAppDoHide = () => shouldAppDoHide
export const setShouldAppDoHide = (value: boolean) => {
  shouldAppDoHide = value
}
