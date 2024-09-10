<div align="center">
  <a href="https://github.com/PlayCover/PlayCover">
    <img src="https://github.com/RSSNext/follow/assets/41265413/c6c02ad5-cddc-46f5-8420-a47afe1c82fe" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Follow</h3>

  <p align="center">
    Next generation information browser.
    <br />
    <br />
    <a href="https://discord.gg/xHCVQZ6wmZ">Discord</a>
    ·
    <a href="https://x.com/intent/follow?screen_name=follow_app_">Twitter</a>
    ·
    <a href="https://github.com/RSSNext/Follow/releases">Releases</a>
  </p>
</div>

## Introduction

Welcome to Follow! This software is all about allowing you to follow your favorite websites, blogs, social media accounts, podcasts and notifications in one place. It is designed as a modern, fast, and convenient all-in-one information center.

AI: Follow leverages advanced AI to assist your operations. Beyond basic AI translation, summarization, and recommendations, it provides twice-daily AI reports to highlight key information from your subscriptions. Additionally, it offers a personalized AI knowledge base built from your subscriptions.

Blockchain: Follow uses blockchain technology as an incentive mechanism for active users and outstanding creators. Users can obtain more services and benefits by holding and using Power Token. Creators can obtain more rewards by providing high-quality content and services.

Social: Follow is also a social platform that allows you to follow other users, share your subscriptions, and discover new content. It also offers a subscription list synchronization feature, enabling your friends to sync with your subscriptions.

Supported Platforms: Follow Desktop for Windows, macOS, Linux, and Browser; Follow Mobile for Android and iOS (coming soon).

## Screenshots

The project is currently under active development. The following screenshots are for reference only and may differ from the final release version.

- Six types of views
  ![Screenshot 2024-09-10 at 6 22 18 PM](https://github.com/user-attachments/assets/bca27f18-a078-4828-bfb1-fb19470a81f5)
  ![Screenshot 2024-09-10 at 6 22 47 PM](https://github.com/user-attachments/assets/f8a90d09-e070-4807-9339-d7360925257a)
  ![Screenshot 2024-09-10 at 6 23 07 PM](https://github.com/user-attachments/assets/427c5160-d983-4c41-8afe-1478969e32c3)
  ![Screenshot 2024-09-10 at 6 23 31 PM](https://github.com/user-attachments/assets/18701743-0a27-45fb-ba7b-815af9e0707e)
  ![Screenshot 2024-09-10 at 6 23 47 PM](https://github.com/user-attachments/assets/7afaeaf7-5591-4cc1-8280-3e80aba697b6)
  ![Screenshot 2024-09-10 at 6 24 11 PM](https://github.com/user-attachments/assets/31ba2bc5-ac01-4d1c-b374-d9a0f448fbba)

- Extensive customization options
  ![Screenshot 2024-09-10 at 6 24 38 PM](https://github.com/user-attachments/assets/bef35f32-660c-4f3d-b040-bfdb1f280e1e)
  ![Screenshot 2024-09-10 at 6 24 48 PM](https://github.com/user-attachments/assets/767f9f03-26e8-47e6-895b-aa22eec9ad8f)

- Actions and AI features

  ![Screenshot 2024-09-10 at 6 25 27 PM](https://github.com/user-attachments/assets/f22606b5-1d84-42aa-aa39-cb70095b1e12)

- Third-party integrations
  ![Screenshot 2024-09-10 at 6 25 33 PM](https://github.com/user-attachments/assets/4c358860-e6ba-4c03-9f36-e14c521cae90)

- Shortcuts and gestures
  ![Screenshot 2024-09-10 at 6 25 38 PM](https://github.com/user-attachments/assets/09e84397-8fea-40fb-b4aa-2cacee1055ef)

- Blockchain features and $Power token
  ![Screenshot 2024-09-10 at 6 25 43 PM](https://github.com/user-attachments/assets/469bc3fc-80d0-47d2-b8c0-302db9e2674f)
  ![Screenshot 2024-09-10 at 6 27 08 PM](https://github.com/user-attachments/assets/e892a688-35e5-4acf-ba03-56c3b43b3ff6)

- Social features
  ![Screenshot 2024-09-10 at 6 26 37 PM](https://github.com/user-attachments/assets/3fef2ce9-0542-4eaf-bef0-c1930efb498d)

## Release

[![Discord](https://img.shields.io/discord/1243823539426033696?logo=discord&label=Discord&style=flat-square&color=5865F2)](https://discord.gg/xHCVQZ6wmZ) [![](https://img.shields.io/badge/any_text-Follow-blue?color=2CA5E0&label=_&logo=x&cacheSeconds=3600&style=flat-square)](https://x.com/intent/follow?screen_name=follow_app_)

Currently, Follow is still in the early developer preview stage (alpha) and is only available to a limited number of users through an invitation system.

You can get an invitation code in the following ways:

- Looking for any beta user to invite you.
- Join our Discord server for occasional giveaways.
- Follow our X account for occasional giveaways.

If you have access, you are welcome to use the following methods to download and install it:

- You can get the installation packages for each platform from the [Release page](https://github.com/RSSNext/Follow/releases).
- If you are using Arch linux, you can install package [follow-appimage](https://aur.archlinux.org/packages/follow-appimage) that maintained by [timochan](https://github.com/ttimochan)

## Contributing

If you are eligible to use Follow, you are welcome to join the open source community to build together.

Before you start, you need to install pnpm and then use it to install dependencies:

```sh
pnpm install
```

### Develop in the browser

```sh
pnpm run dev:web
```

Then the browser opens `https://app.follow.is/__debug_proxy`，you can access the online API environment to development and debugging.

### Develop in the electron

You need to fill in the required environment variables first.

```sh
cp .env.example .env
```

Then run:

```sh
pnpm run dev
```

Since it is not very convenient to develop in Electron, the first way to develop and contribute is recommended at this stage.

## License

Follow is licensed under the GNU General Public License version 3 with the addition of the following special exception:

All content in the `icons/mgc` directory is copyrighted by https://mgc.mingcute.com/ and cannot be redistributed.
