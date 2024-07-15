export const ReactVirtuosoItemPlaceholder = () =>
// NOTE: prevent 0 height element, react virtuoso will not stop render any more
  <div className="h-[0.0000001px]" />
