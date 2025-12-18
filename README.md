
# Accenture UI Toolkit (ACT)
ACT helps us to organize our front-end delivery into  elements, components, forms, templates, pages to any taxonomy and align to any backend system the asset is being build for.

ACT provides below features:

### Style Guide + Documentation
Generate a style guide from your toolkit code. Write documentation in markdown to make your toolkit easy for other developers to use.

### Rapid Prototype
Highly-portable local development environment with [Handlebars](http://handlebarsjs.com/) and [BrowserSync](BrowserSync) built-in for a fast, efficient workflow.

### Automation
We have build automated gulp tasks within ACT to lint, compress, bundle `html, css and javascript` along with helpers to accelerate arabization, SVG font generation.

### Package Management
Package management along with dependencies will mostly be done by `NPM (Node Package Management)` and in some cases dev dependencies not available via `NPM` would be managed by `Yarn` if needed.

# Project Setup
Please follow below steps to setup the project:

### 1. Install Node and NPM

ACT uses Node.js as base platform. There are pre-built [installers for each platform](http://nodejs.org/download/). 

If Admin access is present to install node -

Download the nodeJS.exe file  from https://nodejs.org/en/download/.

If Admin Access is not present then use the below work-around - 

		Step 1: Download the nodeJS zip file from https://nodejs.org/en/download/.
		Step 2: Choose a folder to for nodeJS. For example, C:\ProgramData\Applications\nodejs and save the downloaded file under this folder.
		Step 3: Add the nodeJS folder to the environment variable PATH by executing the below command in the cmd.exe , or using the User Interface.
		set PATH=C:\ProgramData\Applications\nodejs;%PATH%
		Step 4: Now download the stable version of npm from the below link by replacing the version.
		https://registry.npmjs.org/npm/-/npm-{VERSION}.tgz
		For example for npm version 6.4.1, https://registry.npmjs.org/npm/-/npm-6.4.1.tgz
		Step 5: Now unzip the downloaded npm file anywhere and cd into package folder.
		Step 6: Execute the following command in the cmd.exe
		node bin/npm-cli.js install npm -gf
		Step 7: Execute the following commands to verify the installation of nodeJS and npm.

Validate the installation from terminal using command:

`node -v` this should print Node version installed e.g. `v6.9.5`

Validate NPM (Node Package Manager) using command:

`npm v` this should print NPM version installed e.g. `4.2.0`

### 2. Install windows build tool globally- 

For Windows users please install the windows build tools along side using the command below:
`npm install -g windows-build-tools`

### 3. Install Gulp globally - 

`npm install -g gulp` and add it into PATH variable and restart CLI.

Link global Gulp to local project - 

`npm link gulp`

### 4. Install workflow and dev dependencies

To install workflow dependencies like `gulp-sass` etc, please use
`npm install`
which will look into the project `package.json` and install all the dependencies listed in `package.json`.

### 5. Run local dev preview server
To build the `dist` with un-compressed asset files directory and preview in the browser please use
`npm start`

This also runs `gulp watch` internally and watches for any changes in sass, js, materials and refreshes the browser automatically to preview the latest changes


### 6. Package build
To build the `dist` with compressed asset files directory and preview in the browser please use

`npm run build`
