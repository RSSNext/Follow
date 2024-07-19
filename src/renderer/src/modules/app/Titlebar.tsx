import { Logo } from "@renderer/components/icons/logo";
import { tipcClient } from "@renderer/lib/client";
import { useForceUpdate } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const Titlebar = () => {
  const [update] = useForceUpdate();
  const location = useLocation();
  useEffect(() => {
    update();
  }, [location]);
  return (
    <div className="drag-region fixed top-0 z-[99999] flex h-[24px] w-full items-center justify-end rounded-t-[12px] bg-background">
      <div className="absolute left-[90px] right-[90px] top-0 flex h-[24px] items-center gap-2">
        <div className="flex justify-center w-full">
          <span className="text-xs font-bold">{document.title}</span>
        </div>
      </div>
      <button
        className="no-drag-region flex h-[24px] w-[32px] items-center justify-center rounded duration-200 hover:bg-theme-item-active"
        type="button"
        onClick={() => {
          tipcClient?.windowAction({ action: "minimize" });
        }}
      >
        <i className="i-mingcute-minimize-line" />
      </button>

      <button
        type="button"
        className="no-drag-region flex h-[24px] w-[32px] items-center justify-center rounded duration-200 hover:bg-red-500 hover:!text-white"
        onClick={() => {
          tipcClient?.windowAction({ action: "close" });
        }}
      >
        <i className="i-mingcute-close-line" />
      </button>
    </div>
  );
};
