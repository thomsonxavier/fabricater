/*
================================================
Index
------------------------------------------------
01 - require dependencies
02 - clean distribution before build
03(a) - compile sass files into css (documentation)
03(b) - lint toolkit sass
03(c) - compile sass files into css (toolkit)
04 - minify and copy images
05 - task to convert svg icons into fonts
06 - copy fonts to dist
07 - copy svgs to dist
08 - bundle JS using webpack
09 - assemble materials
10 - serve task to serve distribution and watch changes
11 - default gulp task to run all tasks in order
12 - custom handlebar helper for support assemble localization
13 - custom block helper to swap passed parameters with default values
================================================
*/

/*
01 - Require Dependencies
*/
const assembler = require("fabricator-assemble");
const browserSync = require("browser-sync");
const del = require("del");
const gulp = require("gulp");
const gutil = require("gulp-util");
const gulpif = require("gulp-if");
const rename = require("gulp-rename");
const reload = browserSync.reload;
const argv = require('minimist')(process.argv.slice(2));
const svgo = require("gulp-svgo");
const zip = require("gulp-zip");
const log = require('fancy-log');
const npmPackage = require('./package.json');

// Redundant
// const runSequence = require("run-sequence");
// const rtlcss = require("gulp-rtlcss");
// const yaml = require("gulp-yaml");
// const jsonTransform = require("gulp-json-transform");
// const cache = require("gulp-cached");

// Images and Icons
const iconFontName = "icon-font";
const iconfont = require("gulp-iconfont");
const iconFontStyles = require("gulp-iconfont-css");
const imagemin = require("gulp-imagemin");

// Styles
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');
const cleanCss = require('gulp-clean-css');
const gulpStylelint = require("gulp-stylelint");
const prefix = require("gulp-autoprefixer");
const strip = require("gulp-strip-comments");

// Javascript
const sourcemaps = require("gulp-sourcemaps");
const webpack = require("webpack");
const rollup = require('rollup');
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const rollupReplace = require('@rollup/plugin-replace');
const { terser } = require('rollup-plugin-terser');
const typescript = require('@rollup/plugin-typescript');

// Replacing gutil.colors
const colors = require("ansi-colors");
const isdev = gutil.env.dev || process.env.NODE_ENV === "development" || !!argv.dev;

const config = require("./gulp.config.js")(isdev);
const webpackConfig = require("./webpack.config")(config);

require("./code/handlebarHelpers");

// reload
let server = false;
function reload_server(done) {
  if (server) server.reload();
  done();
}

/*
01 - serve task to serve distribution and watch changes
*/
function assembler_task(done) {
  assembler({
    logErrors: config.dev,
    dest: config.dest,
    helpers: {
      // {{ default description "string of content used if description var is undefined" }}
      default: function defaultFn(...args) {
        return args.find(value => !!value);
      },
      // {{ concat str1 "string 2" }}
      concat: function concat(...args) {
        return args.slice(0, args.length - 1).join('');
      },
      // {{> (dynamicPartial name) }} ---- name = 'nameOfComponent'
      dynamicPartial: function dynamicPartial(name) {
        return name;
      },
      eq: function eq(v1, v2) {
        return v1 === v2;
      },
      ne: function ne(v1, v2) {
        return v1 !== v2;
      },
      and: function and(v1, v2) {
        return v1 && v2;
      },
      or: function or(v1, v2) {
        return v1 || v2;
      },
      not: function not(v1) {
        return !v1;
      },
      gte: function gte(a, b) {
        return +a >= +b;
      },
      lte: function lte(a, b) {
        return +a <= +b;
      },
      plus: function plus(a, b) {
        if(! (b>0)){
          b=0;
        }
        return +a + +b;
      },
      minus: function minus(a, b) {
        return +a - +b;
      },
      divide: function divide(a, b) {
        return +a / +b;
      },
      multiply: function multiply(a, b) {
        return +a * +b;
      },
      abs: function abs(a) {
        return Math.abs(a);
      },
      mod: function mod(a, b) {
        return +a % +b;
      },
      

    },
  });

  done();
}

/*
02 - clean distribution before build
*/
const clean = () => del([config.dest]);

/*
03(a) - Generate Brand SCSS files from YML file
*/
// Redundant

/*
03(b) - compile sass files into css (documentation)
*/
function styles_fabricator(){
  return gulp
    .src(config.styles.fabricator.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(prefix(config.styles.browsers))
    .pipe(gulpif(!config.dev, cleanCss()))
    .pipe(rename("f.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.fabricator.dest))
    .pipe(gulpif(config.dev, reload({ stream: true })));
}

/*
03(b) - lint toolkit sass
*/
function styles_lint(){
  return gulp.src(config.styles.toolkit.lint).pipe(
    gulpStylelint({
      failAfterError: false,
      reporters: [{ formatter: "string", console: true }],
    })
  );
}

/*
03(b) - compile sass files into css (toolkit)
*/
function styles_toolkit(path='toolkit'){
  console.log('starting styles compiling for', path);
  return gulp
  .src(config.styles[path].src)
  .pipe(gulpif(config.dev, sourcemaps.init()))
  .pipe(
    sass({
      includePaths: "./node_modules",
    }).on("error", sass.logError)
  )
  .pipe(prefix(config.styles.browsers))
  .pipe(gulpif(!config.dev, cleanCss()))
  .pipe(gulpif(config.dev, sourcemaps.write()))
  // .pipe(cleanCss())
  .pipe(gulp.dest(config.styles[path].dest))
  .pipe(gulpif(config.dev, reload({ stream: true })));
}
// styles
const STYLES_BASE = gulp.parallel(styles_lint,styles_fabricator, styles_toolkit.bind(null,'toolkit'));
// const STYLES_Z_SAMPLEAPP_1 = gulp.parallel(styles_toolkit.bind(null,'z_sampleApp_1'));

const STYLES_COMPLETE = gulp.series(STYLES_BASE); //, STYLES_Z_SAMPLEAPP_1

/*
  3(c) - move src SCSS files into Styles (fabricator) (on prod)
*/
function styles_copy(path='toolkit'){
  console.log('copying styles from', path, 'folder');
  return gulp
  .src(config.styles.styles_copy[path].src)
  .pipe(strip.text())
  .pipe(gulp.dest(config.styles.styles_copy[path].dest));
}
const styles_copy_complete =  gulp.series(styles_copy.bind(null, 'toolkit')); //, styles_copy.bind(null, 'z_sampleApp_1')

/*
04 - minify and copy images
*/
//what to do?
function favicon() {
  return gulp.src("./favicon.ico")
  .pipe(gulp.dest(config.dest));
}

function images(path="toolkit") {
  console.log('copying images from', path, 'folder');

  return gulp
    .src(config.images[path].src)
    .pipe(gulpif(!isdev, imagemin()))
    .pipe(gulp.dest(config.images[path].dest));
};

const IMAGES_BASE = gulp.parallel(images.bind(null, "toolkit"));
// const IMAGES_Z_SAMPLEAPP_1 = gulp.parallel(images.bind(null, "z_sampleApp_1"));
const IMAGES_COMPLETE = gulp.series(IMAGES_BASE); //, IMAGES_Z_SAMPLEAPP_1
/*
05 - task to convert svg icons into fonts
*/
gulp.task("iconfont_toolkit", () => {
  gulp.src(config.fonticons.toolkit.src).pipe(svgo());

  return gulp
    .src(config.fonticons.toolkit.src)
    .pipe(
      iconFontStyles({
        fontName: iconFontName,
        path: config.fonticons.toolkit.template,
        targetPath: config.fonticons.toolkit.targetPath,
        fontPath: config.fonticons.toolkit.srcPath,
      })
    )
    .pipe(
      iconfont({
        fontName: iconFontName,
        formats: ["svg", "ttf", "eot", "woff", "woff2"],
        normalize: true,
        fontHeight: 1001,
      })
    )
    .pipe(gulp.dest(config.fonticons.toolkit.srcPath))
    .pipe(gulp.dest(config.fonticons.toolkit.distPath));
});

function iconfont_func(path="toolkit") {
  console.log('starting Iconfont for', path);

  const icon_font_name = path === "toolkit" ? iconFontName : iconFontName+'-'+path;
  const icon_font_class = path === "toolkit" ? 'icon' : 'icon'+'-'+path;
  gulp.src(config.fonticons[path].src).pipe(svgo())

  return gulp
    .src(config.fonticons[path].src)
    .pipe(
      iconFontStyles({
        fontName: icon_font_name,
        path: config.fonticons[path].template,
        targetPath: config.fonticons[path].targetPath,
        fontPath: config.fonticons[path].srcPath,
        cssClass: icon_font_class
      })
    )
    .pipe(
      iconfont({
        fontName: icon_font_name,
        formats: ["svg", "ttf", "eot", "woff", "woff2"],
        normalize: true,
        fontHeight: 1001,
      })
    )
    .pipe(gulp.dest(config.fonticons[path].srcPath))
    .pipe(gulp.dest(config.fonticons[path].distPath));
}

gulp.task("iconfont", (done)=>{
  iconfont_func("toolkit")
  // iconfont_func("z_sampleApp_1")

  done();
})

/*
06 - copy fonts to dist
*/
function fonts(path="toolkit") {
  console.log('starting fonts task for', path);
  return gulp
    .src(config.fonts[path].src)
    .pipe(gulp.dest(config.fonts[path].dest));
};

const FONTS_BASE = gulp.parallel(fonts.bind(null, "toolkit"));
// const FONTS_Z_SAMPLEAPP_1 = gulp.parallel(fonts.bind(null, "z_sampleApp_1"));
const FONTS_COMPLETE = gulp.series(FONTS_BASE); //, FONTS_Z_SAMPLEAPP_1

/*
07 - bundle JS using webpack
*/
function scripts_toolkit(done){
  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // gutil.log(gutil.colors.red(err()));
      // console.log(colors.bold(colors.red('[Error]')), colors.red(err));
      if (err) {
        // console.error(err.stack || err);
        if (err.details) {
          // console.error(err.details);
        }
        return;
      }
      const info = stats.toJson();
      if (stats.hasErrors()) {
        // console.error(info.errors);
      }
      if (stats.hasWarnings()) {
        // console.warn(info.warnings);
      }
    }
    const result = stats.toJson();
    if (result.errors.length) {
      result.errors.forEach((error) => {
        console.log(error.details, ':', error.message)
        // gutil.log(gutil.colors.red(error));
        // console.log(colors.bold(colors.red('[Error]')), colors.red(error));
      });
    }
    done();
  });
}

function scripts_global(path='global') {
  console.log('starting scripts compiling for', path);
  const plugins = [
    babel({
      //, useBuiltIns: "usage", corejs: "3.6.5"
      presets: [["@babel/preset-env", { loose: true, bugfixes: true, modules: false }]],
      // Only transpile our source code
      exclude: 'node_modules/**',
      // Include the helpers in the bundle, at most one copy of each
      babelHelpers: 'bundled'
    }),
    rollupReplace({
      'process.env.NODE_ENV': '"production"',
      preventAssignment: true
    }),
    nodeResolve(),
    typescript()
  ];

  const bundle_name = path === 'global' ? 'pf_fed' : `pf_fed_${path}`;
  const bundle_banner = path === 'global' ? `/*! Prototype_Factory_FED v${npmPackage.version} */` : `/*! Prototype_Factory_FED ${path} v${npmPackage.version} */`;

  if (!isdev) {
    plugins.push(
      terser({
        compress: { passes: 2 },
        mangle: true
      })
    )
  }

  return rollup
    .rollup({
      input: config.scripts[path].src,
      plugins: plugins
    })
    .then(bundle => {
      return bundle.write({
        file: `${config.scripts[path].dest}/${path}.js`,
        format: 'umd',
        generatedCode: 'es2015',
        sourcemap: config.dev ? true : false,
        name: bundle_name,
        banner: bundle_banner,
        compact: isdev ? false : true
      });
    })
    .catch(error => log.error(error));
}
const SCRIPTS_BASE = gulp.parallel(scripts_toolkit, scripts_global.bind(null, 'global'));
// const SCRIPTS_Z_SAMPLEAPP_1 = gulp.parallel(scripts_global.bind(null, 'z_sampleApp_1'));

const SCRIPTS_COMPLETE = gulp.parallel(SCRIPTS_BASE); //, SCRIPTS_Z_SAMPLEAPP_1

/**REDUNDANT */
// gulp.task("sample",async ()=> {
//   let path = 'global';
//   console.log(config.scripts)
// })

/*
  07(b) - move src JS files into Scripts (fabricator) (on prod)
*/
function scripts_copy(path='toolkit'){
  console.log('copying scripts from', path, 'folder');
  return gulp
  .src(config.scripts.scripts_copy[path].src)
  // .pipe(strip.text())
  .pipe(gulp.dest(config.scripts.scripts_copy[path].dest));
}
const scripts_copy_complete =  gulp.series(scripts_copy.bind(null, 'toolkit')); //, SCRIPTS_Z_SAMPLEAPP_1

/**
 * 08 - serve
 */
// server
function serve(done) {
  server = browserSync.create();
  server.init({
    server: {
      baseDir: config.dest,
    },
    notify: false,
    logPrefix: 'FABRICATOR',
  });
  done();
}

/**
 * Zip assets for prod
 */
gulp.task("zip_assets", (done) => {
  gulp
    .src(config.assetsZip.srcPath)
    .pipe(zip(config.assetsZip.targetFile))
    .pipe(gulp.dest(config.assetsZip.targetFolder));
  done();
});

/**
 * gulp watch
 */
gulp.task("watch_files", (done) => {
  gulp.watch(config.templates.watch, gulp.series(assembler_task, reload_server));

  //STYLES
  gulp.watch( [config.styles.fabricator.watch, config.styles.toolkit.watch], gulp.series(STYLES_BASE, reload_server));
  // gulp.watch(config.styles.z_sampleApp_1.watch, STYLES_Z_SAMPLEAPP_1);

  //SCRIPTS
  gulp.watch( [ config.scripts.fabricator.watch, config.scripts.toolkit.watch, config.scripts.global.watch], gulp.series(SCRIPTS_BASE, reload_server) );
  // gulp.watch(config.scripts.z_sampleApp_1.watch, SCRIPTS_Z_SAMPLEAPP_1);

  //IMAGES
  gulp.watch(config.images.toolkit.watch, gulp.series(IMAGES_BASE, reload_server));
  // gulp.watch(config.images.z_sampleApp_1.watch, gulp.series(IMAGES_Z_SAMPLEAPP_1, reload_server));

  done();
});

/**
 * 09 - default gulp task to run all tasks in order
 */
let tasks =  gulp.series( clean, STYLES_COMPLETE, styles_copy_complete, FONTS_COMPLETE, favicon, IMAGES_COMPLETE, SCRIPTS_COMPLETE, scripts_copy_complete, assembler_task, "zip_assets" )

if (gutil.env.dev || process.env.NODE_ENV === "development" || !!argv.dev) {
  console.log("MODE - Development");
  tasks = gulp.series( clean, STYLES_COMPLETE, FONTS_COMPLETE, favicon, IMAGES_COMPLETE, SCRIPTS_COMPLETE, assembler_task, serve, "watch_files", )
}
else {
  console.log("MODE - Production");
}

gulp.task( "default", tasks );