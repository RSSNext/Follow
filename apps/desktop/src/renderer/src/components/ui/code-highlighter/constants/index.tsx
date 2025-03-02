import {
  MdiLanguageCss3,
  MdiLanguageHtml5,
  MdiLanguageJavascript,
  MdiLanguageTypescript,
  RiMarkdownFill,
  UilReact,
} from "@follow/components/icons/Language.jsx"

const LanguageAlias = {
  ts: "typescript",
  js: "javascript",

  tsx: "typescriptreact",
  jsx: "javascriptreact",
  md: "markdown",
}
const LanguageToColorMap = {
  "c#": "#178600",
  "c++": "#f34b7d",
  "objective-c": "#438eff",
  "objective-c++": "#6866fb",
  c: "#555555",
  cpp: "#f34b7d",
  csharp: "#178600",
  css: "#563d7c",
  dart: "#00B4AB",
  dockerfile: "#384d54",
  go: "#00add8",
  html: "#e34c26",
  java: "#b07219",
  javascript: "#f1e05a",
  javascriptreact: "#f1e05a",
  json: "#292929",
  kotlin: "#F18E33",
  lisp: "#3fb68b",
  lua: "#000080",
  markdown: "#083fa1",
  matlab: "#e16737",
  perl: "#0298c3",
  php: "#4f5d95",
  python: "#3572a5",
  r: "#198ce7",
  ruby: "#701516",
  rust: "#dea584",
  scala: "#c22d40",
  shell: "#89e051",
  sql: "#e38c00",
  swift: "#ffac45",
  typescript: "#2b7489",
  typescriptreact: "#2b7489",
  vimscript: "#199f4b",
  vue: "#2c3e50",
  yaml: "#cb171e",
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
