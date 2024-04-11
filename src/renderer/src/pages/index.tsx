import { TypeTab } from '@renderer/components/type-tab'

export function Component() {
  return (
    <div className="flex h-full">
      <div className="w-80 pt-10 border-r shrink-0 flex flex-col">
        <TypeTab />
      </div>
      <div className="w-80 pt-10 px-5 border-r shrink-0">Two</div>
      <div className="flex-1 pt-10 px-5">Three</div>
    </div>
  )
}
