import {
  MdiLanguageCss3,
  MdiLanguageHtml5,
  MdiLanguageJavascript,
  MdiLanguageTypescript,
  RiMarkdownFill,
  UilReact,
} from "~/components/icons/Language"

const LanguageAlias = {
  ts: "typescript",
  js: "javascript",

  tsx: "typescriptreact",
  jsx: "javascriptreact",
  md: "markdown",
}
const LanguageToColorMap = {
  typescript: "#2b7489",
  javascript: "#f1e05a",
  javascriptreact: "#f1e05a",
  typescriptreact: "#2b7489",
  html: "#e34c26",
  java: "#b07219",
  go: "#00add8",
  vue: "#2c3e50",
  css: "#563d7c",
  yaml: "#cb171e",
  json: "#292929",
  markdown: "#083fa1",
  csharp: "#178600",
  "c#": "#178600",
  c: "#555555",
  cpp: "#f34b7d",
  "c++": "#f34b7d",
  python: "#3572a5",
  lua: "#000080",
  vimscript: "#199f4b",
  shell: "#89e051",
  dockerfile: "#384d54",
  ruby: "#701516",
  php: "#4f5d95",
  lisp: "#3fb68b",
  kotlin: "#F18E33",
  rust: "#dea584",
  dart: "#00B4AB",
  swift: "#ffac45",
  "objective-c": "#438eff",
  "objective-c++": "#6866fb",
  r: "#198ce7",
  matlab: "#e16737",
  scala: "#c22d40",
  sql: "#e38c00",
  perl: "#0298c3",
}
const languageToIconMap = {
  javascriptreact: <UilReact />,
  typescriptreact: <UilReact />,
  javascript: <MdiLanguageJavascript />,
  typescript: <MdiLanguageTypescript />,
  html: <MdiLanguageHtml5 />,
  css: <MdiLanguageCss3 />,
  markdown: <RiMarkdownFill />,
}
export const getLanguageColor = (language?: string) => {
  if (!language) return

  const alias = LanguageAlias[language]
  if (alias) {
    return LanguageToColorMap[alias]
  }
  return LanguageToColorMap[language]
}

export const getLanguageIcon = (language?: string) => {
  if (!language) return null

  const alias = LanguageAlias[language]
  if (alias) {
    return languageToIconMap[alias]
  }

  return languageToIconMap[language]
}
