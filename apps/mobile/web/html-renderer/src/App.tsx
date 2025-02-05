import { HTML } from "./HTML"
import Test from "./test.txt?raw"

export const App = () => {
  return <HTML children={Test} />
}
