# Frontend Styleguide

This repo is part of the project for a Frontend Styleguide based on [U.S. Web Design Standards](https://standards.usa.gov/).

## Getting started

We’re glad you’d like to use the Standards — here’s how you can get started:

* Designers: [Check out our Getting Started for Designers information](https://fsgpilot.github.io/frontend-styleguide/getting-started/designers).
  <!-- * [Design files of all the assets included in the Standards are available for download](https://github.com/18F/web-design-standards-assets/archive/master.zip). -->
* Developers: [Follow the instructions in this README to get started.](#using-the-standards)
  * [CSS, JavaScript, image, and font files of all the assets on this site are available for download](https://github.com/FSGpilot/frontend-styleguide-components/releases/download/v2.0.0/dkwds-2.0.0.zip).

## Using the Standards

There are a few different ways to use the Standards within your project. Which one you choose depends on the needs of your project and how you are most comfortable working. Here are a few notes on what to consider when deciding which installation method to use:

*Download the Standards if:*
- You are not familiar with `npm` and package management.

*Use the Standards `npm` package if:*
- You are familiar with using `npm` and package management.
- You would like to leverage Standards [Sass](#sass) files.

### Download

1. Download the [Standards zip file](https://github.com/FSGpilot/frontend-styleguide-components/releases/download/v2.0.0/dkwds-2.0.0.zip) and open that file.

  After extracting the zip file you should see the following file and folder structure:

  ```
  dkwds-2.0.0/
  ├── css/
  │   ├── dkwds.min.css.map
  │   ├── dkwds.min.css
  │   └── dkwds.css
  ├── fonts/
  ├── html/
  └── js/
      ├── dkwds.min.js.map
      ├── dkwds.min.js
      └── dkwds.js

  ```

2. Copy these files and folders into a relevant place in your project's code base. Here is an example structure for how this might look:

  ```
  example-project/
  ├── assets/
  │   ├── dkwds-1.0.1/
  │   ├── stylesheets/
  │   ├── images/
  │   └── javascript/
  └── index.html
  ```

  You'll notice in our example above that we also outline a `stylesheets`, `images` and `javascript` folder in your `assets` folder. These folders are to help organize any assets that are unique to your project.

3. To use the Standards on your project, you’ll need to reference the [CSS (*C*ascading *S*tyle *S*heets)](https://developer.mozilla.org/en-US/docs/Web/CSS) and JavaScript files in each HTML page or dynamic templates in your project.

  Here is an example of how to reference these assets in your `index.html` file:

  ```html
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>My Example Project</title>
    <link rel="stylesheet" href="assets/uswds-1.0.1/css/dkwds.min.css">
  </head>
  <body>

    <script src="assets/dkwds-1.0.1/js/dkwds.min.js"></script>
  </body>
  </html>
  ```

We offer both files, the CSS and the JavaScript, in two versions — a minified version, and an un-minified one. (In the examples above, we are using the minified files.) Use the minified files in a production environment or to reduce the file size of your downloaded assets. And the un-minified files are better if you are in a development environment or would like to debug the CSS or JavaScript assets in the browser.

And that’s it — you should now be able to copy our code samples into our `index.html` and start using the Standards.

### Install using npm

`npm` is a package manager for Node based projects. The U.S. Web Design Standards maintains a [`dkwds` package](https://www.npmjs.com/package/uswds) for you to utilize both the pre-compiled and compiled files on your project.

1. Install `Node/npm`. Below is a link to find the install method that coincides with your operating system:

  - Node v4.2.3+, [Installation guides](https://nodejs.org/en/download/)

  **Note for Windows users:** If you are using Windows and are unfamiliar with `Node` or `npm`, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information.

2. Make sure you have installed it correctly:

  ```shell
  npm -v
  3.10.8 # This line may vary depending on what version of Node you've installed.
  ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `dkwds` to your project’s `package.json`:

  ```shell
  npm install --save dkwds
  ```

The `dkwds` module is now installed as a dependency. You can use the un-compiled files found in the `src/` or the compiled files in the `dist/` directory.

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

#### Importing assets

Since you are already using `npm`, the Frontend Styleguide team recommends leveraging the ability to write custom scripts. Here are some links to how we do this with our docs website using `npm` + [`gulp`](http://gulpjs.com/):

[Link to `npm` scripts example in `web-design-standards-docs`](https://github.com/18F/web-design-standards-docs/blob/develop/package.json#L4)

[Link to gulpfile.js example in `web-design-standards-docs`](https://github.com/18F/web-design-standards-docs/blob/develop/gulpfile.js)

#### Sass

The Standards are easily customizable using the power of [Sass (Syntactically Awesome Style Sheets)](http://sass-lang.com/). The main Sass (SCSS) source file is located here:

```
node_modules/dkwds/src/stylesheets/dkwds.scss
```

Global variables are defined in the `node_modules/dkwds/src/stylesheets/core/_variables.scss` file. Custom theming can be done by copying the `_variables.scss` file into your own project’s Sass folder, changing applicable variable values, and importing it before `dkwds.scss`.

Below is an example of how you might setup your main Sass file to achieve this:

```
@import 'variables.scss' # Custom Sass variables file
@import 'node_modules/dkwds/src/stylesheets/dkwds.scss';

```

You can now use your copied version of `_variables.scss` to override any styles to create a more custom look and feel to your application.

The Design System uses [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer) to automatically add vendor prefixes to the precompiled stylesheets (`css/dkwds.min.css` and `css/dkwds.css`) however prefixes will not be applied when using the Sass source files directly. If your project requires the use of Sass and vendor prefixes we recommend incorportaing a plugin such as [Autoprefixer](https://github.com/postcss/autoprefixer) into your build process.

#### JavaScript
`require('dkwds')` will load all of the U.S. Web Design Standards’ JavaScript onto the page. Add this line to whatever initializer you use to load JavaScript into your application.

### Use another framework or package manager

If you’re using another framework or package manager that doesn’t support `npm`, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the [download instructions](#download). Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/18F/web-design-standards/issues/877).

If you’re interested in maintaining a package that helps us distribute the U.S. Web Design Standards, the project’s build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](CONTRIBUTING.md#building-the-project-locally-with--gulp-) to locally build distributions for your framework or package manager.


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



## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the Standards style guide website for development.

If you would like to learn more about our workflow process, check out the [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) and [Label Glossary](https://github.com/18F/web-design-standards/wiki/Label-glossary) pages on the wiki.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/18F/web-design-standards/issues) or [emailing our team](mailto:uswebdesignstandards@gsa.gov).


## Reuse of open-source style guides

Much of the guidance in the U.S. Web Design Standards leans on open source designs, code, and patterns from other civic and government organizations, including:

* Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
* U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
* Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
* UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
* Code for America’s Chime [Styleguide](https://github.com/chimecms/chime-starter)
* Pivotal Labs [Component Library](http://styleguide.cfapps.io/)
