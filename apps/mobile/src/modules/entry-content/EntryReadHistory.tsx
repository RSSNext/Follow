import { useQuery } from "@tanstack/react-query"
import { router } from "expo-router"
import { Pressable, View } from "react-native"

import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { apiClient } from "@/src/lib/api-fetch"
import { userActions } from "@/src/store/user/store"

export const EntryReadHistory = ({ entryId }: { entryId: string }) => {
  const { data } = useQuery({
    queryKey: ["entry-read-history", entryId],
    queryFn: () => {
      return apiClient.entries["read-histories"][":id"].$get({
        param: {
          id: entryId,
        },
        query: {
          size: 6,
        },
      })
    },
    staleTime: 1000 * 60 * 5,
  })
  if (!data?.data.entryReadHistories) return null
  return (
    <View className="flex-row items-center justify-center">
      {data?.data.entryReadHistories.userIds.map((userId, index) => {
        const user = data.data.users[userId]
        if (!user) return null
        return (
          <Pressable
            onPress={() => {
              userActions.upsertMany([
                {
                  handle: user.handle,
                  id: user.id,
                  name: user.name,
                  image: user.image,
                  isMe: 0,
                  email: null,
                },
              ])

              router.push(`/profile?userId=${user.id}`)
            }}
            className="border-system-background bg-tertiary-system-background overflow-hidden rounded-full border-2"
            key={userId}
            style={{
              transform: [
                {
                  translateX: index * -10,
                },
              ],
            }}
          >
            <UserAvatar size={25} name={user.name!} image={user.image} />
          </Pressable>
        )
      })}
    </View>
  )
}
