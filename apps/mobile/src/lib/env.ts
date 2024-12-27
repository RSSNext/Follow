import { getEnvironment } from "../atoms/env"
import { appEndpointMap } from "../constants/env"

export const getApiUrl = () => {
  const env = getEnvironment()
  return appEndpointMap[env].api
}

export const getWebUrl = () => {
  const env = getEnvironment()
  return appEndpointMap[env].web
}
