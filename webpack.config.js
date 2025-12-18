const path = require("path");
const webpack = require("webpack");

/**
 * Define plugins based on environment
 * Currently not being called because some of the plugins are deprecated
 * @param {boolean} isDev If in development mode
 * @return {Array}
 */

function getPlugins(isDev) {
  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
  ];

  if (isDev) {
    plugins.push(new webpack.NoEmitOnErrorsPlugin());
  } else {
    plugins.push(new webpack.optimize.DedupePlugin());
    plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: false,
        compress: {
          warnings: false,
        },
      })
    );
  }
  return plugins;
}

/**
 * Define loaders
 * @return {Array}
 */
function getLoaders() {
  const loaders = [
    {
      test: /(\.js)/,
      exclude: /(node_modules)/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [["@babel/preset-env", { targets: "defaults" }]],
        },
      },
    },
    {
      test: /(\.jpg|\.png)$/,
      use: "url-loader?limit=10000",
    },
    
    {
      test: /\.json/,
      use: "json-loader",
    },
    {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    },
  ];
  return loaders;
}

module.exports = (config) => {
  return {
    entry: {
      "fabricator/scripts/fabricator": config.scripts.fabricator.src,
      "toolkit/scripts/toolkit": config.scripts.toolkit.src,
      // "toolkit/scripts/global": config.scripts.global.src
    },
    output: {
      path: path.resolve(__dirname, config.dest, "assets"),
      filename: "[name].js",
    },
    devtool: config.dev ? "source-map": "eval",
    resolve: {
      extensions: [".js", ".ts"],
    },
    optimization: {
      minimize: true,
    },
    // plugins: getPlugins(config.dev),
    module: {
      rules: getLoaders(),
    },
  };
};


// old get plugins
// function getPlugins(isDev) {

//   const plugins = [
//     new webpack.optimize.OccurenceOrderPlugin(),
//     new webpack.DefinePlugin({}),
//     new webpack.ProvidePlugin({
//       $: "jquery",
//       jQuery: "jquery",
//       "window.jQuery": "jquery"
//     }),
//   ];

//   if (isDev) {
//     plugins.push(new webpack.NoErrorsPlugin());
//   } else {
//     plugins.push(new webpack.optimize.DedupePlugin());
//     plugins.push(new webpack.optimize.UglifyJsPlugin({
//       minimize: true,
//       sourceMap: false,
//       compress: {
//         warnings: false,
//       },
//     }));
//   }

//   return plugins;

// }