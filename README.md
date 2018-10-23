# DKFDS - Det Fælles Designsystem

This repo is part of the project for a Frontend Styleguide.


## Using the design system

There are a few different ways to use the design system within your project. Which one you choose depends on the needs of your project and how you are most comfortable working. Here are a few notes on what to consider when deciding which installation method to use:

*Download the design system if:*
- You are not familiar with `npm` and package management.

*Use the design system with `npm` package if:*
- You are familiar with using `npm` and package management.

### Download

1. Download the [design system as a zip file](https://github.com/detfaellesdesignsystem/dkfds-components/releases) and open that file.

### Install using npm

`npm` is a package manager for Node based projects. The npm package for DKFDS can be found [here](https://www.npmjs.com/package/dkfds) for you to utilize both the pre-compiled and compiled files on your project.

1. Install `Node/npm`. Below is a link to find the install method that coincides with your operating system:

  - Node v4.2.3+, [Installation guides](https://nodejs.org/en/download/)

  **Note for Windows users:** If you are using Windows and are unfamiliar with `Node` or `npm`, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information.

2. Make sure you have installed it correctly:

  ```shell
  npm -v
  3.10.8 # This line may vary depending on what version of Node you've installed.
  ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `dkfds` to your project’s `package.json`:

  ```shell
  npm install --save dkwds
  ```

The `dkfds` module is now installed as a dependency. You can use the un-compiled files found in the `src/` or the compiled files in the `dist/` directory.

```
node_modules/dkwds/
├── dist/
│   ├── css/
│   ├── fonts/
│   ├── html/
│   ├── img/
│   ├── js/
└── src/
    ├── fonts/
    ├── img/
    ├── js/
    ├── stylesheets/
    └── templates/
```

## Fractal

We're using [Fractal](http://fractal.build) to generate an interactive component library for the Standards. You can run it locally after `npm install` with:

```sh
npm start
```

Then, visit [http://localhost:3000/](http://localhost:3000/) to see the Standards in action.

_**Optional**: To re-build when code changes are made, run the following command from the project directory in a separate terminal window:_
```sh
npm run watch
```

### Template compatibility

Many of our Fractal view templates are compatible with [Nunjucks](https://mozilla.github.io/nunjucks/) (for JavaScript/Node), [Jinja](http://jinja.pocoo.org/docs/2.9/) (Python), and [Twig](https://twig.sensiolabs.org/) (PHP) out of the box. Components that reference other components use a Fractal-specific `{% render %}` tag that will either need to be implemented in other environments or replaced with the appropriate `{% include %}` tags.