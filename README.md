# About this fork

This repo is a fork by [deranged](https://deranged.dk), published as [@deranged/dkfds](https://www.npmjs.com/package/@deranged/dkfds).

We aim to contribute everything we do here back to the main package, working with the main team.

Our `master` branch tracks `master` on [detfaellesdesignsystem/dkfds-components](https://github.com/detfaellesdesignsystem/dkfds-components).

We publish from the `main` branch.

We aim to develop all new code as feature branches from `master`, rebasing and merging into `main` when we need to publish something for our uses.
This allows us to keep all our work compatible with the main package.

Goals of this fork:
- General cleanup and small contributions
- Variant theme for Digitaliseringsstyrelsen (digst)

# FDS - Det Fælles Designsystem

For guidelines and full documentation, visit https://designsystem.dk/

## Using the design system in your project

There are a few different ways to use the design system within your project. Which one you choose depends on the needs of your project and how you are most comfortable working. Here are a few notes on what to consider when deciding which installation method to use:

### Install using npm (recommended)

Install `dkfds` in your project by writing the following in a command-prompt:

  ```shell
  npm install --save dkfds
  ```

The `dkfds` module is now installed as a dependency. You can use the un-compiled files found in the `src/` or the compiled files in the `dist/` directory.

### Download

Download the [design system as a zip file](https://github.com/detfaellesdesignsystem/dkfds-components/releases) and open that file.

### Including FDS in your project

#### FDS as vendor
If you downloaded the project as a zip folder simply include the follow code in the head-part of your page to include the css:
```shell
  <link type='text/css' rel='stylesheet' href='[path to dkfds folder]/dist/css/dkfds.css'>
```
To include the javascript, include this tag at the bottom of the body-part of your page:
```shell
  <script src='[path to dkfds folder]/dist/js/dkfds.js'></script>
```

To include the styling add the following code to your main.scss file:

```shell
  @use 'node_modules/dkfds/src/stylesheets/dkfds' with (
    $font-path:         'node_modules/dkfds/src/fonts/IBMPlexSans/',
    $image-path:        'node_modules/dkfds/src/img/',
    $icons-folder-path: 'node_modules/dkfds/src/img/svg-icons/'
);
```

To include the JavaScript, import it in your main.js file:
```shell
  import * as DKFDS from "dkfds";
```

## Contribute
The project is available on GitHub. You are more than welcome to contact us with suggestions or bug reports.
[See the project on GitHub](https://github.com/detfaellesdesignsystem/dkfds-components)
