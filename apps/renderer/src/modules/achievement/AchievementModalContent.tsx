import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSingleton } from "foxact/use-singleton"
import { atom, useStore } from "jotai"
import { nanoid } from "nanoid"
import type { FC } from "react"
import { useEffect } from "react"
import { Trans } from "react-i18next"

import { Button } from "~/components/ui/button"
import { styledButtonVariant } from "~/components/ui/button/variants"
import { LoadingCircle, LoadingWithIcon } from "~/components/ui/loading"
import { useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { Chain } from "~/lib/chain"
import { cn } from "~/lib/utils"
import achievementAnimationUri from "~/lottie/achievement.lottie?url"

const absoluteachievementAnimationUri = new URL(achievementAnimationUri, import.meta.url).href
enum AchievementsActionIdMap {
  FIRST_CLAIM_FEED = 0,
}

const achievementActionIdCopyMap: Record<
  AchievementsActionIdMap,
  { title: I18nKeys; description: I18nKeys }
> = {
  [AchievementsActionIdMap.FIRST_CLAIM_FEED]: {
    title: "achievement.first_claim_feed",
    description: "achievement.first_claim_feed_description",
  },
}

export const AchievementModalContent: FC = () => {
  const jotaiStore = useStore()
  const queryClient = useQueryClient()

  const defaultAchievements = useSingleton(buildDefaultAchievements)

  const _achievementType = apiClient.achievement.$get({
    query: {
      type: "all",
    },
  })
  type Achievement = Awaited<typeof _achievementType>["data"]
  const {
    data: achievements,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["achievements"],
    meta: {
      persist: true,
    },
    queryFn: async () => {
      const res = await apiClient.achievement.$get({
        query: {
          type: "all",
        },
      })

      jotaiStore.set(achievementsDataAtom.current, res.data)
      return res.data
    },
    initialData: defaultAchievements.current as Achievement,
  })

  useEffect(() => {
    if (!achievements) return
    let shouldPolling = false
    const pollingChain = new Chain()
    for (const achievement of achievements) {
      if (achievement.type === "checking") {
        shouldPolling = true
        break
      }
    }

    if (shouldPolling) {
      pollingChain.wait(2000).next(() => {
        refetch()
      })
    }

    return () => {
      pollingChain.abort()
    }
  }, [achievements, refetch])

  const { mutateAsync: mintAchievement, isPending: isMinting } = useMutation({
    mutationFn: async (actionId: number) => {
      return apiClient.achievement.$put({
        json: {
          actionId,
        },
      })
    },
  })
  const achievementsDataAtom = useSingleton(() => atom<typeof achievements>())
  const { mutateAsync: checkAchievement, isPending: checkPending } = useMutation({
    mutationFn: async (actionId: number) => {
      return apiClient.achievement.check.$post({
        json: {
          actionId,
        },
      })
    },
    onSuccess: () => {
      refetch()
    },
  })
  const t = useI18n()

  return (
    <div className="relative flex w-full grow flex-col items-center">
      <DotLottieReact
        className="mt-12 size-[100px]"
        autoplay
        speed={2}
        src={absoluteachievementAnimationUri}
        loop={false}
      />

      <div className="mt-4 text-xl font-bold">{t("words.achievement")}</div>

      <small className="center mt-1 gap-1 text-theme-vibrancyFg">
        <Trans
          i18nKey={"achievement.mint_more_power"}
          components={{
            power: (
              <span className="center gap-0.5 font-semibold">
                <span>{t("words.power")}</span>
                <i className="i-mgc-power text-accent" />
              </span>
            ),
          }}
        />
      </small>

      <ul className="mt-10 flex w-full grow flex-col gap-2">
        {isLoading ? (
          <div className="center pointer-events-none grow -translate-y-16">
            <LoadingWithIcon icon={<i className="i-mgc-trophy-cute-re" />} size="large" />
          </div>
        ) : (
          achievements?.map((achievement) => {
            const copy = achievementActionIdCopyMap[achievement.actionId]
            if (!copy) return null

            return (
              <li key={achievement.id} className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold">
                    {t(copy.title)}

                    {achievement.power && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-xs font-normal">
                        <span className="font-medium opacity-80">{achievement.power}</span>
                        <i className="i-mgc-power text-sm text-accent" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {t(copy.description)}
                  </div>
                </div>

                {achievement.type === "checking" && (
                  <div
                    className={styledButtonVariant({
                      variant: "outline",
                      className: "relative border-0 pointer-events-none",
                    })}
                  >
                    <LoadingCircle size="small" className="center absolute inset-0" />
                    <span className="select-none opacity-0">{t("words.mint")}</span>
                  </div>
                )}

                {achievement.type === "incomplete" && (
                  <button
                    type="button"
                    className={styledButtonVariant({
                      variant: "ghost",
                      className: "relative hover:bg-transparent group cursor-pointer",
                    })}
                    onClick={() => {
                      checkAchievement(achievement.actionId)
                    }}
                  >
                    <div className="center absolute z-[1] opacity-0 duration-200 group-hover:opacity-100">
                      <i
                        className={cn(
                          "i-mgc-refresh-2-cute-re size-5 text-accent",
                          checkPending && "animate-spin",
                        )}
                      />
                    </div>
                    <div className="duration-200 group-hover:opacity-30">
                      <span className="center relative ml-2 inline-flex w-24 -translate-y-1 flex-col *:!m-0">
                        <small className="shrink-0 text-xs leading-tight text-muted-foreground">
                          {achievement.progress} / {achievement.progressMax}
                        </small>
                        <span className="relative h-1 w-full overflow-hidden rounded-full bg-accent/10">
                          <span
                            className="absolute -left-3 top-0 inline-block h-1 rounded-full bg-accent"
                            style={{
                              width: `calc(${Math.min(
                                (achievement.progress / achievement.progressMax) * 100,
                                100,
                              )}% + 0.75rem)`,
                            }}
                          />
                        </span>
                      </span>
                    </div>
                  </button>
                )}

                {achievement.type === "received" && (
                  <div
                    className={styledButtonVariant({
                      variant: "outline",
                      className:
                        "relative !bg-green-100/50 gap-1 border-green-200 text-green-800 dark:text-foreground dark:!bg-green-100/5 dark:border-green-200/20",
                    })}
                  >
                    <i className="i-mgc-check-filled" />
                    {t("achievement.all_done")}
                  </div>
                )}
                {achievement.type === "completed" && (
                  <Button
                    isLoading={isMinting}
                    variant="primary"
                    onClick={async () => {
                      const res = await mintAchievement(achievement.actionId)

                      const currentData = jotaiStore.get(achievementsDataAtom.current)
                      if (!currentData) return
                      let shouldInvalidate = false
                      const newData = currentData.map((item) => {
                        if (item.id === achievement.id && res.data.result) {
                          shouldInvalidate = true
                          return {
                            ...item,
                            done: true,
                            doneAt: new Date().toISOString(),
                            type: "received",
                          } as const
                        }
                        return item
                      })
                      jotaiStore.set(achievementsDataAtom.current, newData)

                      if (shouldInvalidate) {
                        queryClient.invalidateQueries({ queryKey: ["achievements"] })
                      }
                    }}
                  >
                    {t("words.mint")}
                  </Button>
                )}
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

const buildDefaultAchievements = () => {
  return [
    {
      id: nanoid(),
      actionId: AchievementsActionIdMap.FIRST_CLAIM_FEED,
      type: "checking",
      progress: 0,
      progressMax: 0,
    },
  ]
}
