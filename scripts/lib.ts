import { execSync } from "node:child_process"

export const getGitHash = () => {
  try {
    execSync("git rev-parse HEAD").toString().trim()
  } catch (e) {
    console.error("Failed to get git hash", e)
  }
}
