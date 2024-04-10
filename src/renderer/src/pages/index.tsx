import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@renderer/components/ui/resizable"

export function Component() {
  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
