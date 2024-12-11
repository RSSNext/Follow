export const styles = tw`relative h-0 grow`
export const animationStyles = tw`delay-100 duration-200 ease-in-out animate-in fade-in slide-in-from-bottom-24 f-motion-reduce:fade-in-0 f-motion-reduce:slide-in-from-bottom-0`

export interface EntryColumnWrapperProps extends ComponentType {
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
  onPullToRefresh?: () => Promise<any>
}
