import { LoadingCircle } from "@follow/components/ui/loading/index.js"
import { ScrollArea } from "@follow/components/ui/scroll-area/index.js"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@follow/components/ui/select/index.jsx"
import { Tabs, TabsList, TabsTrigger } from "@follow/components/ui/tabs/index.js"
import { cn, isASCII } from "@follow/utils/utils"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useEventCallback } from "usehooks-ts"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"

import { RSSHubCategoryOptions } from "./constants"
import styles from "./recommendations.module.css"
import { RecommendationCard } from "./recommendations-card"

const LanguageOptions = [
  {
    name: "English",
    value: "en",
  },
  {
    name: "简体中文",
    value: "zh-CN",
  },
] as const

type Language = (typeof LanguageOptions)[number]["value"]
type DiscoverCategories = (typeof RSSHubCategoryOptions)[number]["value"]

const fetchRsshubPopular = (category: DiscoverCategories, lang: Language) => {
  return Queries.discover.rsshubCategory({
    category: "popular",
    categories: category === "all" ? "popular" : `popular,${category}`,
    lang,
  })
}
export function Recommendations({
  hideTitle,
  className,
  headerClassName,
}: {
  hideTitle?: boolean
  className?: string
  headerClassName?: string
}) {
  const { t } = useTranslation()
  const lang = useGeneralSettingKey("language")

  const defaultLang = ["zh-CN", "zh-HK", "zh-TW"].includes(lang ?? "") ? "zh-CN" : "en"
  const [category, setCategory] = useState<DiscoverCategories>("all")
  const [selectedLang, setSelectedLang] = useState<Language>(defaultLang)

  const rsshubPopular = useAuthQuery(fetchRsshubPopular(category, selectedLang), {
    meta: {
      persist: true,
    },
    placeholderData: keepPreviousData,
  })

  const { data, isLoading, isFetching } = rsshubPopular

  const keys = useMemo(() => {
    if (!data) {
      return []
    }
    return Object.keys(data).sort((a, b) => {
      const aname = data[a].name
      const bname = data[b].name

      const aRouteName = data[a].routes[Object.keys(data[a].routes)[0]].name
      const bRouteName = data[b].routes[Object.keys(data[b].routes)[0]].name

      const ia = isASCII(aname) && isASCII(aRouteName)
      const ib = isASCII(bname) && isASCII(bRouteName)

      if (ia && ib) {
        return aname.toLowerCase() < bname.toLowerCase() ? -1 : 1
      } else if (ia || ib) {
        return ia > ib ? -1 : 1
      } else {
        return 0
      }
    })
  }, [data])

  const handleCategoryChange = (value: DiscoverCategories) => {
    setCategory(value)
    rsshubPopular.refetch()
  }

  const handleLangChange = (value: string) => {
    setSelectedLang(value as Language)
    rsshubPopular.refetch()
  }

  const tabRef = useRef<HTMLDivElement>(null)
  const handleChangeCategoryAndJumpTo = useEventCallback((category: DiscoverCategories) => {
    handleCategoryChange(category)

    if (tabRef.current) {
      const tab = tabRef.current.querySelector(`[data-value="${category}"]`)
      if (tab) {
        const tabRect = tab.getBoundingClientRect()
        const containerRect = tabRef.current.getBoundingClientRect()
        const scrollLeft =
          tabRect.left -
          containerRect.left +
          tabRef.current.scrollLeft -
          (containerRect.width - tabRect.width) / 2

        tabRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" })
      }
    }
  })

  if (isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <div className={cn(!hideTitle && "mt-8 w-full max-w-[1200px] px-4")}>
      {!hideTitle && (
        <div className="relative text-center text-lg font-bold">
          <span>{t("discover.popular")}</span>

          {isFetching && (
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center gap-8">
              <span className="opacity-0" aria-hidden>
                {t("discover.popular")}
              </span>
              <LoadingCircle size="small" className="center flex" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "z-[9] my-3 flex w-full items-center gap-4 bg-theme-background",
          headerClassName,
        )}
      >
        <ScrollArea.ScrollArea
          ref={tabRef}
          orientation="horizontal"
          rootClassName="grow min-w-0 overflow-visible"
          scrollbarClassName="-mb-3 z-[100]"
        >
          <Tabs value={category} onValueChange={handleCategoryChange}>
            <TabsList>
              {RSSHubCategoryOptions.map((category) => (
                <TabsTrigger
                  data-value={category.value}
                  key={category.value}
                  value={category.value}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollArea.ScrollArea>
        <Select value={selectedLang} onValueChange={handleLangChange}>
          <SelectTrigger size="sm" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {LanguageOptions.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className={cn(styles["recommendations-grid"], "mt-6", className)}>
        {keys.map((key) => (
          <RecommendationCard
            key={key}
            data={data[key]}
            routePrefix={key}
            setCategory={handleChangeCategoryAndJumpTo}
          />
        ))}
      </div>
    </div>
  )
}
