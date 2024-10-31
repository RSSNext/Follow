import { readFileSync, renameSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const changelogDir = join(__dirname, "..", "changelog")

const nextFile = join(changelogDir, "next.md")

const new_version = process.argv[2]

const nextContent = readFileSync(nextFile, "utf-8")
writeFileSync(nextFile, nextContent.replaceAll("NEXT_VERSION", new_version))

// Rename the next.md to the new version
renameSync(nextFile, join(changelogDir, `${new_version}.md`))
// Replace the NEXT_VERSION in the next.md file with the new version

// Create the new next.md file
writeFileSync(resolve(changelogDir, "next.md"), `# NEXT_VERSION Changelog`)
