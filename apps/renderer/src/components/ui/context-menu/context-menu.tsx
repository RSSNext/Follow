import { RootPortal } from "@follow/components/ui/portal/index.jsx"
import { cn } from "@follow/utils/utils"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import * as React from "react"

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-menu select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-theme-item-hover focus:text-theme-foreground data-[state=open]:bg-theme-item-hover data-[state=open]:text-theme-foreground",
      inset && "pl-8",
      "center gap-2",
      className,
      props.disabled && "cursor-not-allowed opacity-30",
    )}
    {...props}
  >
    {children}
    <i className="i-mingcute-right-line -mr-1 ml-auto size-3.5" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <RootPortal>
    <ContextMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "min-w-32 overflow-hidden rounded-md border bg-theme-modal-background-opaque p-1 text-theme-foreground/90 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:shadow-zinc-800/60",
        className,
      )}
      {...props}
    />
  </RootPortal>
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <RootPortal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-[60] min-w-32 overflow-hidden rounded-md border border-border bg-theme-modal-background-opaque p-1 text-theme-foreground/90 shadow-lg dark:shadow-zinc-800/60",
        "text-xs",
        className,
      )}
      {...props}
    />
  </RootPortal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-menu select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-theme-item-hover focus:text-theme-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "focus-within:outline-transparent data-[highlighted]:bg-theme-item-hover dark:data-[highlighted]:bg-neutral-800",
      inset && "pl-8",
      className,
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-checkbox select-none items-center rounded-sm px-8 py-1.5 text-sm outline-none focus:bg-theme-item-hover focus:text-theme-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      "focus-within:outline-transparent",
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator asChild>
        <i className="i-mgc-check-filled size-3" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-foreground", inset && "pl-8", className)}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px scale-x-90 bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
}

export { RootPortal as ContextMenuPortal } from "@follow/components/ui/portal/index.jsx"
