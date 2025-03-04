// Redirects to the home screen when the app is opened with a deep link.
// Test this by running the following command in the terminal:
// pnpx uri-scheme open 'follow://add?id=1' --ios
//
// See https://docs.expo.dev/router/advanced/native-intent/#rewrite-incoming-native-deep-links

export function redirectSystemPath(_options: { path: string; initial: boolean }) {
  const { path } = _options
  if (!_options.path) return
  const parsedUrl = parseUrl(path)
  if (!parsedUrl) return
  const id = parsedUrl.searchParams.get("id")
  if (!id) return
  return `/follow?id=${id}`
}

const parseUrl = (url: string) => {
  try {
    return new URL(url)
  } catch {
    return
  }
}
