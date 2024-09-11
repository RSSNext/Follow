export const currentSupportedLanguages = (() => {
  const langsFiles = import.meta.glob("../../../../locales/*.json")

  const langs = [] as string[]
  for (const key in langsFiles) {
    langs.push(key.split("/").pop()?.replace(".json", "") as string)
  }
  return langs
})()
