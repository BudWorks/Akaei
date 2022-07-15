[![Akaei Image](https://pbs.twimg.com/profile_banners/1113794031966924800/1653151285/1500x500)](#)
[![Akaei Release Version](https://img.shields.io/static/v1?label=Akaei%20Release&message=Beta%201.3.0&color=ff69b4&style=flat-square)](#)
[![Akaei Experiments Version](https://img.shields.io/static/v1?label=Akaei%20Experiments&message=Beta%202.0.0&color=ff69b4&style=flat-square)](#)
[![Akaei Support Discord](https://img.shields.io/discord/674356534259744789?label=Akaei%20Support%20Discord&style=flat-square)](https://discord.gg/5Q94fEQ)
[![BudWorks Site Status](https://img.shields.io/website?down_color=red&down_message=Offline&label=BudWorks%20Site&up_message=Online&url=https%3A%2F%2Fwww.budworks.co&style=flat-square)](https://www.budworks.co)
[![Twitter Follows](https://img.shields.io/twitter/follow/AkaeiBot?color=blue&label=Follow%20%40AkaeiBot&logo=Twitter&style=flat-square)](https://twitter.com/AkaeiBot)

# Akaei

## Description

Akaei is a fun, cute and open-source Discord bot. Welcome your server into a global economy where members can earn coins by working, playing games, and utilizing their pets! Users can use their coins to purchase pets and items, which allow them to participate in more games, such as pet battles with other users! If you're looking for a way to spice up your server, give Akaei a shot!

Akaei was originally created on March 24, 2019 as a closed source personal project for the Sting Ray server. Over time, it outgrew its original purpose and its original JavaScript codebase. In addition, with Discord's push for slash commands, it was a good time to give the bot a fresh and up-to-date codebase. So, on July 15, 2022, this repository was made. Since the bot is now open-source, this README will document how to spin up a local version of the bot for development (or for self-hosting, though self-hosting is not officially supported) as well as the style guidelines and naming conventions for the project.

## Development

### Key Tools

Akaei is written in [TypeScript](typescriptlang.org/) and based on the popular [discord.js](https://github.com/discordjs/discord.js/) API library. We utilize [MongoDB](https://www.mongodb.com) as our database, [Yarn 2](https://yarnpkg.com) as our package manager, [TOML](https://toml.io/en/) for local settings, [ESLint](https://eslint.org) for linting, and [Prettier](prettier.io/) for formatting. Akaei utilizes many other open source tools, all of which can be viewed in the package.json file.

### Setting Up the Bot

We believe in the Yarn [Zero-Installs philosophy](https://yarnpkg.com/features/zero-installs), and as such our bot utilizes PNP and theoretically never needs to install packages unless they must be updated. With that being said, in order to utilize Yarn and TypeScript, you must have the TypeScript compiler and Yarn installed globally. You can accomplish this by running `npm install -g yarn typescript` in a terminal with [Node.js](https://nodejs.org/en/) installed. Instructions for configuring the bot and setting up a local MongoDB database are coming soon.

### Contributing

Coming soon!

## Licensing

This project is licensed under the [Mozilla Public License 2.0](https://github.com/BudWorks/Akaei/blob/main/LICENSE). All art for Akaei is not protected under this license, and is the intellectual property of BudWorks. In certain conditions as described in the self-hosting agreement, BudWorks grants limited access to the Akaei Emoji set for use exclusively with self-hosted bots that are hosted "as-is" and follow the agreement described below and for modified versions of the bot being used exclusively for testing while contributing to the project.

### Self-hosting

Self-hosting is not officially supported by the Akaei team, and we will not offer support to assist you in self-hosting a version of the bot. Part of the fun of the Akaei bot is the global economy system with each server acting as it's own economic niche. Because of this, the impact of the bot would be lost in a self-hosted version. With that being said, you are free to run a local version of the bot for your server or a closed group of servers if you'd like, but please avoid self-hosting another public version of the bot.

### Agreement

When choosing to self-host the bot as-is, you may not:

- Use the Akaei logo, profile picture, or other art, with the exception of the Akaei Emoji Set provided in the "Setting Up the Bot" section
- Claim to be affiliated with BudWorks or developers working on the official project
- Host a public version of the bot
- Charge for use of the bot

When self-hosting a modified version of the bot, you may not:

- Use the Akaei Logo, profile picture, or other art
- Claim to be affiliated with BudWorks or developers working on the official project
- Close source your version of the bot or restrict self-hosting more heavily than the official project
