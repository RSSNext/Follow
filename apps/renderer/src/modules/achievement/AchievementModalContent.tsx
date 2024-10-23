import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { SingletonRefObject } from "foxact/use-singleton"
import { useSingleton } from "foxact/use-singleton"
import type { PrimitiveAtom } from "jotai"
import { atom, useStore } from "jotai"
import { nanoid } from "nanoid"
import type { FC, ReactNode } from "react"
import { useEffect, useId, useMemo, useRef } from "react"
import { Trans, useTranslation } from "react-i18next"

import { useServerConfigs } from "~/atoms/server-configs"
import { Button } from "~/components/ui/button"
import { styledButtonVariant } from "~/components/ui/button/variants"
import { Input } from "~/components/ui/input"
import { LoadingCircle, LoadingWithIcon } from "~/components/ui/loading"
import { useCurrentModal, useModalStack } from "~/components/ui/modal"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { useI18n } from "~/hooks/common"
import { apiClient } from "~/lib/api-fetch"
import { Chain } from "~/lib/chain"
import { cn } from "~/lib/utils"
import achievementAnimationUri from "~/lottie/achievement.lottie?url"

const absoluteachievementAnimationUri = new URL(achievementAnimationUri, import.meta.url).href
enum AchievementsActionIdMap {
  FIRST_CLAIM_FEED = 0,
  FIRST_CREATE_LIST = 1,
  LIST_SUBSCRIBE_50 = 2,
  LIST_SUBSCRIBE_100 = 3,
  LIST_SUBSCRIBE_500 = 4,
  PRODUCT_HUNT_VOTE = 5,
  // TODO
  // FOLLOW_SPECIAL_FEED = 6,
  ALPHA_TESTER = 7,
}

const achievementActionIdCopyMap: Record<
  AchievementsActionIdMap,
  { title: I18nKeys; description: I18nKeys }
> = {
  [AchievementsActionIdMap.FIRST_CLAIM_FEED]: {
    title: "achievement.first_claim_feed",
    description: "achievement.first_claim_feed_description",
  },
  [AchievementsActionIdMap.FIRST_CREATE_LIST]: {
    title: "achievement.first_create_list",
    description: "achievement.first_create_list_description",
  },
  [AchievementsActionIdMap.LIST_SUBSCRIBE_50]: {
    title: "achievement.list_subscribe_50",
    description: "achievement.list_subscribe_50_description",
  },
  [AchievementsActionIdMap.LIST_SUBSCRIBE_100]: {
    title: "achievement.list_subscribe_100",
    description: "achievement.list_subscribe_100_description",
  },
  [AchievementsActionIdMap.LIST_SUBSCRIBE_500]: {
    title: "achievement.list_subscribe_500",
    description: "achievement.list_subscribe_500_description",
  },
  [AchievementsActionIdMap.PRODUCT_HUNT_VOTE]: {
    title: "achievement.product_hunt_vote",
    description: "achievement.product_hunt_vote_description",
  },
  // [AchievementsActionIdMap.FOLLOW_SPECIAL_FEED]: {
  //   title: "achievement.follow_special_feed",
  //   description: "achievement.follow_special_feed_description",
  // },
  [AchievementsActionIdMap.ALPHA_TESTER]: {
    title: "achievement.alpha_tester",
    description: "achievement.alpha_tester_description",
  },
}
const _achievementType = apiClient.achievement.$get({
  query: {
    type: "all",
  },
})
type Achievement = Awaited<typeof _achievementType>["data"]
export const AchievementModalContent: FC = () => {
  const jotaiStore = useStore()

  const defaultAchievements = useSingleton(buildDefaultAchievements)

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
    if (isLoading) return
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
  }, [achievements, isLoading, refetch])

  const achievementsDataAtom = useSingleton(() => atom<typeof achievements>())

  const t = useI18n()

  const sortedAchievements = useMemo(() => {
    return achievements?.sort((a, b) => {
      if (a.type === "received") return 1
      if (b.type === "received") return -1
      return 0
    })
  }, [achievements])

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
          sortedAchievements?.map((achievement) => {
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
                        <i className="i-mgc-power scale-95 text-sm text-accent" />
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
                  <IncompleteButton achievement={achievement} refetch={refetch} />
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

                {achievement.type === "audit" && (
                  <div
                    className={styledButtonVariant({
                      variant: "outline",
                      className:
                        "relative cursor-not-allowed !bg-zinc-100/50 gap-1 border-zinc-200 text-zinc-800 dark:text-foreground dark:!bg-zinc-100/5 dark:border-zinc-200/20",
                    })}
                  >
                    Validating...
                  </div>
                )}
                {achievement.type === "completed" && (
                  <MintButton
                    achievementsDataAtom={achievementsDataAtom}
                    achievement={achievement}
                  />
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
  return Object.keys(achievementActionIdCopyMap).map((key) => {
    return {
      id: nanoid(),
      actionId: Number(key),
      type: "checking",
    }
  })
}

const MintButton: FC<{
  achievementsDataAtom: SingletonRefObject<PrimitiveAtom<Achievement | undefined>>
  achievement: Achievement[number]
}> = ({ achievementsDataAtom, achievement }) => {
  const { mutateAsync: mintAchievement, isPending: isMinting } = useMutation({
    mutationFn: async (actionId: number) => {
      return apiClient.achievement.$put({
        json: {
          actionId,
        },
      })
    },
  })

  const jotaiStore = useStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  return (
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
  )
}

const IncompleteButton: FC<{
  achievement: Achievement[number]
  refetch: () => void
}> = ({ achievement, refetch }) => {
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

  const { present } = useModalStack()
  let Content: ReactNode

  const { PRODUCT_HUNT_VOTE_URL } = useServerConfigs() || {}

  switch (achievement.actionId) {
    case AchievementsActionIdMap.PRODUCT_HUNT_VOTE: {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!PRODUCT_HUNT_VOTE_URL}
              onClick={() => {
                present({
                  title: "Validate Your Vote",
                  content: () => <VoteValidateModalContent refetch={refetch} />,
                })
              }}
            >
              Validate
            </Button>
          </TooltipTrigger>
          {!PRODUCT_HUNT_VOTE_URL && (
            <TooltipContent>Product Hunk Vote is not ready, We'll see.</TooltipContent>
          )}
        </Tooltip>
      )
    }
    default: {
      Content = (
        <>
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
        </>
      )
    }
  }

  return (
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
      {Content}
    </button>
  )
}
const VoteValidateModalContent: FC<{ refetch: () => void }> = ({ refetch }) => {
  const ref = useRef<HTMLInputElement>(null)
  const { dismiss } = useCurrentModal()
  const { present } = useModalStack()
  const { mutateAsync: audit, isPending } = useMutation({
    mutationFn: (username: string) => {
      return apiClient.achievement.audit.$post({
        json: {
          actionId: AchievementsActionIdMap.PRODUCT_HUNT_VOTE,
          payload: {
            username,
          },
        },
      })
    },
    onSuccess: () => {
      dismiss()

      refetch()
      present({
        title: "Thank you!",
        content: () => <div>Thank you for your vote. Please wait for our verification.</div>,
        clickOutsideToDismiss: true,
      })
    },
  })
  const { PRODUCT_HUNT_VOTE_URL } = useServerConfigs() || {}
  const id = useId()

  const openOnceRef = useRef(false)
  useEffect(() => {
    if (openOnceRef.current) return
    if (PRODUCT_HUNT_VOTE_URL) {
      window.open(PRODUCT_HUNT_VOTE_URL, "_blank")
      openOnceRef.current = true
    }
  }, [PRODUCT_HUNT_VOTE_URL])

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        if (!ref.current?.value) return
        audit(ref.current.value)
      }}
    >
      <label className="text-sm" htmlFor={id}>
        Please vote for {APP_NAME} on{" "}
        <a
          href={PRODUCT_HUNT_VOTE_URL}
          className="follow-link--underline"
          target="_blank"
          rel="noreferrer"
        >
          Product Hunk!
        </a>{" "}
        Then fill in your username here.
      </label>
      <div>
        <Input ref={ref} autoFocus id={id} placeholder="Your Product Hunt username" />
      </div>

      <div className="mt-2 flex justify-end">
        <Button isLoading={isPending} type="submit">
          Validate
        </Button>
      </div>
    </form>
  )
}
