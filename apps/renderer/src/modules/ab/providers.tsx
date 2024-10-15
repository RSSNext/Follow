export const FeatureFlagDebugger = () => {
  return null
  // if (IS_DEBUG_ENV) return <DebugToggle />
}

// const DebugToggle = () => {
//   const { present } = useModalStack()
//   return (
//     <RootPortal>
//       <div
//         tabIndex={-1}
//         onClick={() => {
//           present({
//             title: "A/B",
//             content: ABModalContent,
//           })
//         }}
//         className="fixed bottom-5 right-0 flex size-5 items-center justify-center opacity-40 duration-200 hover:opacity-100"
//       >
//         <i className="i-mingcute-switch-line" />
//       </div>
//     </RootPortal>
//   )
// }

// const SwitchInternal = ({ Key }: { Key: FeatureKeys }) => {
//   const enabled = useAtomValue(debugFeaturesAtom)[Key]
//   const setDebugFeatures = useSetAtom(debugFeaturesAtom)
//   return (
//     <Switch
//       checked={enabled}
//       onCheckedChange={(checked) => {
//         setDebugFeatures((prev) => ({ ...prev, [Key]: checked }))
//       }}
//     />
//   )
// }

// const ABModalContent = () => {
//   const features = useAtomValue(debugFeaturesAtom)

//   const enableOverride = useAtomValue(enableDebugOverrideAtom)
//   const setEnableDebugOverride = useSetAtom(enableDebugOverrideAtom)
//   return (
//     <div>
//       <Label className="flex items-center justify-between gap-4">
//         Enable Override A/B
//         <Switch
//           checked={enableOverride}
//           onCheckedChange={(checked) => {
//             setEnableDebugOverride(checked)
//           }}
//         />
//       </Label>

//       <Divider />

//       <div className={enableOverride ? "opacity-100" : "pointer-events-none opacity-40"}>
//         {Object.keys(features).map((key) => {
//           return (
//             <div key={key} className="flex w-full items-center justify-between">
//               <Label className="flex w-full items-center justify-between gap-4 text-sm">
//                 {key}
//                 <SwitchInternal Key={key as any} />
//               </Label>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
