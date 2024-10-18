import { Readable } from "node:stream"

import type { FastifyInstance } from "fastify"
import React from "react"
import uniqolor from "uniqolor"

import { createApiClient, getTokenFromCookie } from "~/lib/api-client"
import { renderToImage } from "~/lib/og/render-to-image"

export const ogRoute = (app: FastifyInstance) => {
  app.get("/og/:type/:id", async (req, reply) => {
    const { type, id } = req.params as Record<string, string>

    const token = getTokenFromCookie(req.headers.cookie || "")
    const apiClient = createApiClient(token)

    switch (type) {
      case "feed": {
        const feed = await apiClient.feeds.$get({ query: { id } }).catch(() => null)

        if (!feed?.data.feed) {
          return reply.code(404).send("Not found")
        }

        const { title, description, image } = feed.data.feed
        const imageBase64 = await getImageBase64(image)
        const [bgAccent, bgAccentLight, bgAccentUltraLight] = getBackgroundGradient(title!)

        try {
          const imageRes = await renderToImage(
            <div
              style={{
                // background: "#ff760a",
                // backgroundImage: `linear-gradient(120deg, ${bgAccent} 0%, #ff760a 100%)`,
                background: `linear-gradient(37deg, ${bgAccent} 27.82%, ${bgAccentLight} 79.68%, ${bgAccentUltraLight} 100%)`,
                width: "100%",
                height: "100%",
                display: "flex",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 50,
                  left: 50,
                  right: 50,
                  bottom: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "white",
                  borderRadius: 24,
                  gap: "2rem",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 24,
                    bottom: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                    transformOrigin: "bottom right",
                    transform: `scale(0.7)`,
                  }}
                >
                  <FollowIcon />
                  <span style={{ fontSize: "2.5rem", color: "#FF5C02", fontWeight: 600 }}>
                    Follow
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {imageBase64 ? (
                    <img
                      src={imageBase64}
                      style={{ width: 256, height: 256, borderRadius: "50%" }}
                    />
                  ) : null}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    flexDirection: "column",
                    overflow: "hidden",
                    // alignItems: "start",
                    justifyContent: "center",
                  }}
                >
                  <h3
                    style={{
                      color: "#000000",
                      fontSize: "3.5rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {title}
                  </h3>
                  <p
                    style={{
                      fontSize: "1.8rem",
                      height: "5.2rem",
                      overflow: "hidden",
                      lineClamp: 2,
                      color: "#000000",
                    }}
                  >
                    {description}
                  </p>

                  <p
                    style={{
                      fontSize: "1.5rem",
                      color: "#000000",
                      fontWeight: 500,
                    }}
                  >
                    {feed.data.subscriptionCount} followers with {feed.data.readCount} recent reads
                    on Follow
                  </p>
                </div>
              </div>
            </div>,
            {
              width: 1200,
              height: 600,
            },
          )

          const stream = new Readable({
            read() {
              this.push(imageRes.image)
              this.push(null)
            },
          })

          reply.type(imageRes.contentType).headers({
            "Cache-Control": "max-age=3600, s-maxage=3600, stale-while-revalidate=600",
            "Cloudflare-CDN-Cache-Control":
              "max-age=3600, s-maxage=3600, stale-while-revalidate=600",
            "CDN-Cache-Control": "max-age=3600, s-maxage=3600, stale-while-revalidate=600",
          })
          return reply.send(stream)
        } catch (err) {
          console.error(err)
          return reply.code(500).send({ error: "Internal server error" })
        }

        break
      }
      default: {
        return reply.code(404).send("Not found")
      }
    }
  })
}

const getBackgroundGradient = (seed?: Nullable<string>) => {
  const nextSeed = seed ?? Math.random().toString(36).slice(7)

  const bgAccent = uniqolor(nextSeed, {
    saturation: [30, 35],
    lightness: [60, 70],
  }).color

  const bgAccentLight = uniqolor(nextSeed, {
    saturation: [30, 35],
    lightness: [80, 90],
  }).color

  const bgAccentUltraLight = uniqolor(nextSeed, {
    saturation: [30, 35],
    lightness: [95, 96],
  }).color

  return [bgAccent, bgAccentLight, bgAccentUltraLight]
}

async function getImageBase64(image: string | null | undefined) {
  if (!image) {
    return null
  }

  const url = new URL(image)
  return await fetch(image, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Referer: url.origin,
    },
  }).then(async (res) => {
    const isImage = res.headers.get("content-type")?.startsWith("image/")
    if (isImage) {
      const arrayBuffer = await res.arrayBuffer()

      return `data:${res.headers.get("content-type")};base64,${Buffer.from(arrayBuffer).toString("base64")}`
    }
    return null
  })
}

function FollowIcon() {
  return (
    <svg
      width="65.52"
      height="64.08"
      viewBox="0 0 91 89"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="91" height="89" rx="26" fill="#FF5C02" />
      <path
        d="M69.0242 22.0703H37.1962C33.3473 22.0703 30.2272 25.1785 30.2272 29.0126C30.2272 32.8468 33.3473 35.955 37.1962 35.955H69.0242C72.8731 35.955 75.9933 32.8468 75.9933 29.0126C75.9933 25.1785 72.8731 22.0703 69.0242 22.0703Z"
        fill="white"
      />
      <path
        d="M50.6595 40.1356H26.7962C22.9473 40.1356 19.8271 43.2438 19.8271 47.0779C19.8271 50.9121 22.9473 54.0202 26.7962 54.0202H50.6595C54.5084 54.0202 57.6286 50.9121 57.6286 47.0779C57.6286 43.2438 54.5084 40.1356 50.6595 40.1356Z"
        fill="white"
      />
      <path
        d="M51.1344 65.128C51.1344 61.2938 48.0142 58.1857 44.1653 58.1857C40.3164 58.1857 37.1962 61.2938 37.1962 65.128C37.1962 68.9621 40.3164 72.0703 44.1653 72.0703C48.0142 72.0703 51.1344 68.9621 51.1344 65.128Z"
        fill="white"
      />
    </svg>
  )
}
