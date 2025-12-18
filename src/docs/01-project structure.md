```
├── dist/
├── node_modules/
├── src/
├── .babelrc
├── .editorconfig
├── .eslintrc
├── gulp.config.js
├── gulpfile.js
├── package.json
└── webpack.config.js
```

#### dist/ (Distribution Directory)
Contains the distribution package to be shared with the integration teams.

`npm run build` generates the distribution with minified, concatenated, optimized assets across CSS, JavaScript, Images and SVGs etc. There will be no source-maps along with the distribution.

`npm start` generates the distribution with concatenated, optimized assets but un-minified with source-maps enabled for better debugging and trace.

#### src/ (Source Directory)
Contains the complete source code for project with below directory structure

```
│   ├── assets
│   │   ├── fabricator
│   │   │   ├── scripts
│   │   │   ├── styles
│   │   ├── toolkit
│   │   │   ├── font-icons
│   │   │   ├── fonts
│   │   │   ├── images
│   │   │   ├── scripts
│   │   │   ├── styles
│   │   │   │   ├── template
│   │   │   └── svg-icons
│   ├── data
│   │   └── (json, yml)
│   ├── docs
│   ├── materials
│   │   ├── elements
│   │   ├── components
│   │   └── forms
│   ├── views/
│   │   ├── layouts
│   │   │   ├── includes
│   │   │   └── default.html
│   │   ├── pages
│   │   │   ├── includes
│   │   └── (documentation listing pages)
│   └── favicon.ico
```
