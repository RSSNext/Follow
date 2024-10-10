import { Divider } from "~/components/ui/divider"

import { MyWalletSection } from "./my-wallet-section"
import { TransactionsSection } from "./transaction-section"

export const PowerModalContent = () => {
  // const [tab, setTab] = useState<"power" | "transaction">("power")
  return (
    <div className="flex h-0 w-full grow flex-col">
      <div className="motion-preset-shake center -mt-3 mb-6 h-24 text-accent motion-delay-500">
        <i className="i-mgc-power size-20" />
      </div>

      <MyWalletSection />
      <Divider className="my-8" />

      <TransactionsSection className="h-0 grow overflow-auto pb-5" />

      {/* {tab === "power" && <MyWalletSection />}
            {tab === "transaction" && <TransactionsSection />} */}

      {/* <div className="absolute bottom-0 inset-x-0 flex center">
              <Button variant="ghost" onClick={() => setTab(tab === "power" ? "transaction" : "power")}>
                {tab === "power" ? "Transactions" : "Power"}
              </Button>
            </div> */}
    </div>
  )
}
