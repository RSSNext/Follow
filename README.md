<p align="center">
<img src="https://github.com/RSSNext/follow/assets/41265413/c6c02ad5-cddc-46f5-8420-a47afe1c82fe" alt="Follow" width="100">
</p>
<h1 align="center">Follow</h1>

> Next generation information browser

Roadmap: https://github.com/orgs/RSSNext/projects/1/views/1

[![Discord](https://img.shields.io/discord/1243823539426033696?logo=discord&label=Discord&style=flat-square&color=5865F2)](https://discord.gg/xHCVQZ6wmZ) [![](https://img.shields.io/badge/any_text-Follow-blue?color=2CA5E0&label=_&logo=x&cacheSeconds=3600&style=flat-square)](https://x.com/intent/follow?screen_name=follow_app_)

## Release

Currently, Follow is still in the early developer preview stage (alpha) and is only available to a limited number of users through an invitation system.

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
