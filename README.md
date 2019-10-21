# FDS - Det Fælles Designsystem

This repo is part of the project for a Frontend Styleguide.


## Using the design system in your project

There are a few different ways to use the design system within your project. Which one you choose depends on the needs of your project and how you are most comfortable working. Here are a few notes on what to consider when deciding which installation method to use:

### Download

Download the [design system as a zip file](https://github.com/detfaellesdesignsystem/dkfds-components/releases) and open that file.

### Install using npm

Install `dkfds` in your project by writing the following in a commad-prompt:

  ```shell
  npm install --save dkfds
  ```

The `dkfds` module is now installed as a dependency. You can use the un-compiled files found in the `src/` or the compiled files in the `dist/` directory.

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

#### Webpack

To include the styling add the following code to your main.scss file:

```shell
  $font-path:         '~dkfds/src/fonts/IBMPlexSans/';
  $image-path:        '~dkfds/src/img';
  $site-image-path:   '~dkfds/src/img';
  $icons-folder-path: '~dkfds/src/img/svg-icons';
  @import '../node_modules/dkfds/src/stylesheets/dkfds';
```

To include the javascript via webpack, import it in your main.js file:
```shell
  import "dkfds";
```

## Contribute
The project is available on Github. You are more than welcome to contact us with suggestions or if you have a bug to report.
[See the project on Github](https://github.com/detfaellesdesignsystem/dkfds-components)
