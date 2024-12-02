import type { CapacitorConfig } from "@capacitor/cli"

// <key>CFBundleURLTypes</key>
// <array>
//   <dict>
//     <key>CFBundleURLName</key>
//     <string>com.example.app</string>
//     <key>CFBundleURLSchemes</key>
//     <array>
//       <string>follow</string>
//     </array>
//   </dict>
// </array>
// <key>WKAppBoundDomains</key>
// <array>
//   <string>app.follow.is</string>
//   <string>api.follow.is</string>
// </array>

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "Follow",
  webDir: "out/web",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
