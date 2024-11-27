import type { CapacitorConfig } from "@capacitor/cli"

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
