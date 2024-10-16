// import { createApp } from "../dist/server/index.js"
const { createApp } = require("../dist/server/index.js")

export default async function handler(req: any, res: any) {
  const app = await createApp()
  await app.ready()
  app.server.emit("request", req, res)
}
