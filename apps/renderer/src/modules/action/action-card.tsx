import { Button } from "@follow/components/ui/button/index.js"
import { Card, CardContent, CardHeader } from "@follow/components/ui/card/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { Switch } from "@follow/components/ui/switch/index.jsx"
import { useTranslation } from "react-i18next"

import { actionActions, useActionByIndex } from "~/store/action"

import { FeedFilter } from "./feed-filter"
import { TargetActionList } from "./target-action-list"

export const ActionCard = ({ index }: { index: number }) => {
  return (
    <Card>
      <CardHeader>
        <ActionCardToolbar index={index} />
      </CardHeader>
      <CardContent className="flex flex-wrap justify-between gap-x-10 gap-y-5">
        <FeedFilter index={index} />
        <TargetActionList index={index} />
      </CardContent>
    </Card>
  )
}

const ActionCardToolbar = ({ index }: { index: number }) => {
  const { t } = useTranslation("settings")

  const name = useActionByIndex(index, (a) => a.name)
  const disabled = useActionByIndex(index, (a) => a.result.disabled)

  const onChange = actionActions.updateByIndex.bind(null, index)
  return (
    <div className="flex w-full items-center gap-2">
      <Button
        variant="ghost"
        onClick={() => {
          actionActions.removeByIndex(index)
        }}
      >
        <i className="i-mgc-delete-2-cute-re text-zinc-600" />
      </Button>
      <p className="shrink-0 font-medium text-zinc-500">{t("actions.action_card.name")}</p>
      <Input
        value={name}
        className="h-8 max-w-64"
        onChange={(e) => {
          onChange((data) => {
            data.name = e.target.value
          })
        }}
      />
      <div className="grow" />

      <Switch
        checked={!disabled}
        onCheckedChange={(checked) => {
          onChange((data) => {
            data.result.disabled = !checked
          })
        }}
      />
    </div>
  )
}
