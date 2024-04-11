import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@renderer/components/ui/tabs"

export function TypeTab() {
  return (
    <TooltipProvider delayDuration={300}>
      <Tabs defaultValue="articles">
        <TabsList className="w-full justify-around text-xl my-2">
          <TabsTrigger value="articles" className="data-[state=active]:text-indigo-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-news-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Articles</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="social-media" className="data-[state=active]:text-sky-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-twitter-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Social Media</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="pictures" className="data-[state=active]:text-green-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-pic-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Pictures</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:text-red-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-youtube-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Videos</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="audios" className="data-[state=active]:text-purple-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-headphone-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Audios</TooltipContent>
            </Tooltip>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:text-yellow-600">
            <Tooltip>
              <TooltipTrigger><i className="i-mingcute-notification-fill" /></TooltipTrigger>
              <TooltipContent side="bottom">Notifications</TooltipContent>
            </Tooltip>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="articles">Articles</TabsContent>
        <TabsContent value="social-media">Social Media</TabsContent>
        <TabsContent value="pictures">Pictures</TabsContent>
        <TabsContent value="videos">Videos</TabsContent>
        <TabsContent value="audios">Audios</TabsContent>
        <TabsContent value="notifications">Notifications</TabsContent>
      </Tabs>
    </TooltipProvider>
  )
}
