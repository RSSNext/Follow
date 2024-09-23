import "dotenv/config"

import { readFileSync, writeFileSync } from "node:fs"
import path, { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { inspect } from "node:util"

import { ofetch } from "ofetch"

const { POSTHOG_TOKEN } = process.env

if (!POSTHOG_TOKEN) {
  throw new Error("POSTHOG_TOKEN is not set")
}
// https://posthog.com/docs/api/feature-flags#post-api-organizations-parent_lookup_organization_id-feature_flags-copy_flags
const listRes: ListRes = await ofetch(
  `https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/feature_flags/?limit=9999`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${POSTHOG_TOKEN}`,
    },
  },
)

interface ListRes {
  count: number
  next: null
  previous: null
  results: ResultsItem[]
}
interface ResultsItem {
  id: number
  name: string
  key: string
  filters: any[]
  deleted: boolean
  active: boolean
  created_by: any[]
  created_at: string
  is_simple_flag: boolean
  rollout_percentage: number
  ensure_experience_continuity: boolean
  experiment_set: any[]
  surveys: any[]
  features: any[]
  rollback_conditions: any[]
  performed_rollback: boolean
  can_edit: boolean
  usage_dashboard: number
  analytics_dashboards: any[]
  has_enriched_analytics: boolean
  tags: any[]
}

const existFlags = {} as Record<string, boolean>

listRes.results.forEach((flag) => (existFlags[flag.key] = true))

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)))
const localFlagsString = readFileSync(path.join(__dirname, "../constants/flags.json"), "utf8")
const localFlags = JSON.parse(localFlagsString as string) as Record<string, boolean>

const updateToRmoteFlags = {} as Record<string, boolean>

// If remote key has but local not has, add to Local
for (const key in existFlags) {
  if (!(key in localFlags)) {
    localFlags[key] = existFlags[key]
  }
}

// Write to local flags
writeFileSync(path.join(__dirname, "../constants/flags.json"), JSON.stringify(localFlags, null, 2))

console.info("update local flags", inspect(localFlags))

// Local first
for (const key in localFlags) {
  // existFlags[key] = localFlags[key]
  if (existFlags[key] !== localFlags[key]) {
    updateToRmoteFlags[key] = localFlags[key]
  }
}

if (Object.keys(updateToRmoteFlags).length > 0) {
  await Promise.allSettled(
    Object.entries(updateToRmoteFlags).map(([key, flag]) => {
      return fetch(
        `https://app.posthog.com/api/projects/${process.env.POSTHOG_PROJECT_ID}/feature_flags/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.POSTHOG_PRIVATE_KEY}`,
          },
          body: JSON.stringify({
            key,
            active: flag,
          }),
        },
      )
    }),
  )

  console.info("update flags", inspect(updateToRmoteFlags))
}
