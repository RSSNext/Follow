import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useSingleton } from "foxact/use-singleton"
import { atom, useStore } from "jotai"
import type { LottieRef } from "lottie-react"
import Lottie from "lottie-react"
import { nanoid } from "nanoid"
import type { FC } from "react"
import { useCallback, useEffect, useRef } from "react"

import { Button } from "~/components/ui/button"
import { styledButtonVariant } from "~/components/ui/button/variants"
import { LoadingCircle, LoadingWithIcon } from "~/components/ui/loading"
import { useModalStack } from "~/components/ui/modal"
import { SlideUpModal } from "~/components/ui/modal/stacked/custom-modal"
import { apiClient } from "~/lib/api-fetch"
import { Chain } from "~/lib/chain"
import achievementAnimation from "~/lottie/achievement.json"

enum AchievementsActionIdMap {
  FIRST_CLAIM_FEED = 0,
}

const achievementActionIdCopyMap = {
  [AchievementsActionIdMap.FIRST_CLAIM_FEED]: {
    title: "First Claim Feed",
    description: "Claim your first feed",
  },
}

export const useAchievementModal = () => {
  const { present } = useModalStack()

  return useCallback(() => {
    present({
      id: "achievement",
      title: "Achievement",
      content: AchievementModalContent,
      CustomModalComponent: SlideUpModal,
    })
  }, [present])
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
export const AchievementModalContent: FC = () => {
  const lottieRef: LottieRef = useRef(null)
  useEffect(() => {
    lottieRef.current?.setSpeed(2)
  }, [])

  const jotaiStore = useStore()
  const queryClient = useQueryClient()
  const pollingChain = useSingleton(() => new Chain())
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

      let shouldPolling = false
      for (const achievement of res.data) {
        if (achievement.type === "checking") {
          shouldPolling = true
          break
        }
      }

      if (shouldPolling) {
        pollingChain.current.wait(2000).next(() => {
          refetch()
        })
      }
      jotaiStore.set(achievementsDataAtom.current, res.data)
      return res.data
    },
    initialData: defaultAchievements.current as Achievement,
  })

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

  return (
    <div className="relative flex w-full grow flex-col items-center">
      <Lottie lottieRef={lottieRef} animationData={achievementAnimation} loop={false} />

      <div className="mt-4 text-xl font-bold">Achievement</div>

      <small className="center gap-1">
        Mint more{" "}
        <span className="center gap-0.5 font-semibold">
          Power
          <i className="i-mgc-power text-accent" />
        </span>{" "}
        by completing achievements.
      </small>

      <ul className="mt-8 flex w-full grow flex-col gap-2">
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
                    {copy.title}

                    {achievement.power && (
                      <span className="ml-2 inline-flex items-center gap-0.5 text-xs font-normal">
                        <span className="font-medium opacity-80">{achievement.power}</span>
                        <i className="i-mgc-power text-sm text-accent" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {copy.description}
                  </div>
                </div>

                {achievement.type === "checking" && (
                  <div
                    className={styledButtonVariant({
                      variant: "outline",
                      status: "disabled",
                      className: "relative",
                    })}
                  >
                    <LoadingCircle size="small" className="center absolute inset-0" />
                    <span className="select-none opacity-0">Mint</span>
                  </div>
                )}
                {achievement.type === "incomplete" && (
                  <div
                    className={styledButtonVariant({
                      variant: "ghost",
                      className: "relative hover:bg-transparent",
                    })}
                  >
                    <span className="center relative ml-2 inline-flex w-24 -translate-y-1 flex-col *:!m-0">
                      <small className="shrink-0 text-xs leading-tight text-muted-foreground">
                        {achievement.progress} / {achievement.progressMax}
                      </small>
                      <span className="h-1 w-full rounded-full bg-accent">
                        <span
                          className="h-full max-w-full rounded-full bg-accent"
                          style={{
                            width: `${Math.min(
                              (achievement.progress / achievement.progressMax) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </span>
                    </span>
                  </div>
                )}

                {achievement.type === "received" && (
                  <div
                    className={styledButtonVariant({
                      variant: "outline",
                      className:
                        "relative !bg-green-100/50 border-green-200 text-green-800 dark:text-foreground dark:!bg-green-100/5 dark:border-green-200/20",
                    })}
                  >
                    <i className="i-mgc-check-filled" />
                    All done!
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
                    Mint
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
