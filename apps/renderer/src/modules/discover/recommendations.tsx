import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@follow/components/ui/select/index.jsx"
import { cn, isASCII } from "@follow/utils/utils"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { localStorage } from "~/store/utils/helper"

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

const CategoryOptions: {
  name: string
  value: string
}[] = [
  {
    name: "All",
    value: "all",
  },
  {
    name: "Social Media",
    value: "social-media",
  },
  {
    name: "New Media",
    value: "new-media",
  },
  {
    name: "News",
    value: "traditional-media",
  },
  {
    name: "BBS",
    value: "bbs",
  },
  {
    name: "Blog",
    value: "blog",
  },
  {
    name: "Programming",
    value: "programming",
  },
  {
    name: "Design",
    value: "design",
  },
  {
    name: "Live",
    value: "live",
  },
  {
    name: "Multimedia",
    value: "multimedia",
  },
  {
    name: "Picture",
    value: "picture",
  },
  {
    name: "ACG",
    value: "anime",
  },
  {
    name: "Application Updates",
    value: "program-update",
  },
  {
    name: "University",
    value: "university",
  },
  {
    name: "Forecast",
    value: "forecast",
  },
  {
    name: "Travel",
    value: "travel",
  },
  {
    name: "Shopping",
    value: "shopping",
  },
  {
    name: "Gaming",
    value: "game",
  },
  {
    name: "Reading",
    value: "reading",
  },
  {
    name: "Government",
    value: "government",
  },
  {
    name: "Study",
    value: "study",
  },
  {
    name: "Scientific Journal",
    value: "journal",
  },
  {
    name: "Finance",
    value: "finance",
  },
]

type Language = (typeof LanguageOptions)[number]["value"]
type DiscoverCategories = (typeof CategoryOptions)[number]["value"]

export function Recommendations({
  hideTitle,
  className,
}: {
  hideTitle?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const lang = localStorage.getItem("follow:I18N_LOCALE") as string | null
  const defaultLang = ["zh-CN", "zh-HK", "zh-TW"].includes(lang ?? "") ? "zh-CN" : "en"
  const [category, setCategory] = useState<DiscoverCategories>("all")
  const [selectedLang, setSelectedLang] = useState<Language>(defaultLang)

  const fetchRsshubPopular = (category: DiscoverCategories, lang: Language) => {
    return Queries.discover.rsshubCategory({
      category: "popular",
      categories: category === "all" ? "popular" : `popular,${category}`,
      lang,
    })
  }

  const rsshubPopular = useAuthQuery(fetchRsshubPopular(category, selectedLang), {
    meta: {
      persist: true,
    },
  })

  const { data, isLoading } = rsshubPopular

  const keys = useMemo(() => {
    if (data) {
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
    } else {
      return []
    }
  }, [data])

  useEffect(() => {
    rsshubPopular.refetch()
  }, [category, selectedLang, rsshubPopular])

  const handleCategoryChange = (value: DiscoverCategories) => {
    setCategory(value)
  }

  const handleLangChange = (value: string) => {
    setSelectedLang(value as Language)
  }

  if (isLoading) {
    return null
  }

  if (!data) {
    return null
  }

  return (
    <div className={cn(!hideTitle && "mt-8 w-full max-w-[1200px] px-4")}>
      {!hideTitle && <div className="text-center text-lg font-bold">{t("discover.popular")}</div>}

      <div className="my-3 flex justify-end gap-4 px-3">
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger size="sm" className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {CategoryOptions.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      <div className={cn(styles["recommendations-grid"], "mt-4", className)}>
        {keys.map((key) => (
          <RecommendationCard key={key} data={data[key]} routePrefix={key} />
        ))}
      </div>
    </div>
  )
}
