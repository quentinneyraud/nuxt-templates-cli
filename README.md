# Nuxt templates CLI

> Install features from [Nuxt templates repo](https://github.com/quentinneyraud/nuxt-templates)

## Installation

```bash
npm install -g nuxt-templates-cli
```

## Usage

### Install features

```bash
nuxt-templates install
```

Displays a checkbox list of all features (all branches in the repository that start with `features/`).  
After selection, it downloads all required files and install dependencies with yarn or npm.

#### Arguments

- **Token (`install --token xxx`)**

Each `install` command use multiple calls to the Github API, which is limited to 60 requests per hour.

Create an API token in [Github developer settings](https://github.com/settings/tokens) to get more requests per hour.

- **Repository (`install --repository xxx`)**

By default, `install` command is looking for features in `quentinneyraud/nuxt-templates` Github repository. Pass an other repository name if you forked it to add your own features (More info on how to do it [here](https://github.com/quentinneyraud/nuxt-templates)). 

- **Tmp directory (`install --tmp my-directory`)**

`install` command requires to temporary store files to work. Pass an other directory name (relative to root directory) if `tmp` directory is already used for something else.

### Get config

Programmaticaly adding feature configuration in `nuxt.config.js` is difficult and buggy, so each configuration is in its own file and downloaded in `/configs` folder.  
It requires to update `nuxt.config.js` file so it can merge all feature configurations in one object, exported by `nuxt.config.js`.

```bash
nuxt-templates get-config
```

This command logs the new configuration and copy it to the clipboard, you just need to replace your `nuxt.config.js` content with it.
