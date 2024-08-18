import { AnimatePresence, m } from "framer-motion"

export const IconScaleTransition = ({
  icon1,
  icon2,
  status,
}: {
  status: "init" | "done"

  icon1: string
  icon2: string
}) => (
  <AnimatePresence mode="popLayout">
    {status === "init" ? (
      <m.i
        className={icon1}
        key="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      />
    ) : (
      <m.i
        className={icon2}
        key="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      />
    )}
  </AnimatePresence>
)
