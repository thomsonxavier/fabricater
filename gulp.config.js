module.exports = function (isdev) {
  var config = {
    dev: isdev,
    styles: {
      browsers: "last 1 version",
      fabricator: {
        src: "src/assets/fabricator/styles/fabricator.scss",
        dest: "dist/assets/fabricator/styles",
        watch: "src/assets/fabricator/styles/**/*.scss",
      },
      toolkit: {
        src: "src/assets/toolkit/styles/toolkit.scss",
        brandStyles: {
          src: "src/data/toolkit.yml",
          dest: "src/assets/toolkit/styles/settings/_brand-colors.scss",
        },
        lint: [
          //get all .scss files in the src/assets/toolkit/styles folder.
          "src/assets/toolkit/styles/**/*.scss",
          //paths starting with ! will be ignored.
          "!src/assets/toolkit/styles/_font-icons.scss",
          "!src/assets/toolkit/styles/template/_font-icons.scss",
        ],
        dest: "dist/assets/toolkit/styles",
        watch: "src/assets/toolkit/styles/**/*.scss",
      },
      z_sampleApp_1: {
        src: "src/assets/z_sampleApp_1/styles/z_sampleApp_1.scss",
        dest: "dist/assets/z_sampleApp_1/styles",
        watch: "src/assets/z_sampleApp_1/styles/**/*.scss",
      },
      global: {
        src: "src/assets/toolkit/styles/global.scss",
        brandStyles: {
          src: "src/data/toolkit.yml",
          dest: "src/assets/toolkit/styles/settings/_brand-colors.scss",
        },
        lint: [
          //get all .scss files in the src/assets/toolkit/styles folder.
          "src/assets/toolkit/styles/**/*.scss",
          //paths starting with ! will be ignored.
          "!src/assets/toolkit/styles/_font-icons.scss",
          "!src/assets/toolkit/styles/template/_font-icons.scss",
        ],
        dest: "dist/assets/fabricator/styles",
        watch: "src/assets/toolkit/styles/**/*.scss",
      },
      global_SCSS: {
        src: "src/assets/toolkit/styles/**/*",
        dest: "dist/assets/fabricator/styles",
      },
      styles_copy: {
        toolkit: {
          src: "src/assets/toolkit/styles/**/*",
          dest: "dist/assets/fabricator/toolkit/styles",
        },
        z_sampleApp_1: {
          src: "src/assets/z_sampleApp_1/styles/**/*",
          dest: "dist/assets/fabricator/z_sampleApp_1/styles",
        }
      },
    },
    scripts: {
      fabricator: {
        src: "./src/assets/fabricator/scripts/fabricator.js",
        dest: "dist/assets/fabricator/scripts",
        watch: "src/assets/fabricator/scripts/**/*",
      },
      toolkit: {
        src: "./src/assets/toolkit/scripts/toolkit.js",
        dest: "dist/assets/toolkit/scripts",
        watch: "src/assets/toolkit/scripts/**/*",
      },
      global: {
        src: "./src/assets/toolkit/scripts/global.js",
        dest: "dist/assets/toolkit/scripts",
        watch: "src/assets/toolkit/scripts/**/*",
      },
      global_JS: {
        src: "src/assets/toolkit/scripts/**/*",
        dest: "dist/assets/fabricator/scripts",
      },
      z_sampleApp_1: {
        src: "./src/assets/z_sampleApp_1/scripts/z_sampleApp_1.js",
        dest: "dist/assets/z_sampleApp_1/scripts",
        watch: "src/assets/z_sampleApp_1/scripts/**/*",
      },
      scripts_copy: {
        toolkit: {
          src: "src/assets/toolkit/scripts/**/*",
          dest: "dist/assets/fabricator/toolkit/scripts",
        },
        z_sampleApp_1: {
          src: "src/assets/z_sampleApp_1/scripts/**/*",
          dest: "dist/assets/fabricator/z_sampleApp_1/scripts",
        }
      },
    },
    images: {
      toolkit: {
        src: ["src/assets/toolkit/images/**/*"], //, 'src/favicon.ico'
        dest: "dist/assets/toolkit/images",
        watch: "src/assets/toolkit/images/**/*",
      },
      z_sampleApp_1: {
        src: ["src/assets/z_sampleApp_1/images/**/*"], //, 'src/favicon.ico'
        dest: "dist/assets/z_sampleApp_1/images",
        watch: "src/assets/z_sampleApp_1/images/**/*",
      },
    },
    fonticons: {
      toolkit: {
        src: "src/assets/toolkit/font-icons/**/*",
        template: "src/assets/toolkit/styles/template/_font-icons.scss",
        targetPath: "../styles/_font-icons.scss",
        srcPath: "src/assets/toolkit/fonts",
        distPath: "dist/assets/toolkit/fonts",
      },
      z_sampleApp_1: {
        src: "src/assets/z_sampleApp_1/font-icons/**/*",
        template: "src/assets/toolkit/styles/template/_font-icons.scss",
        targetPath: "../styles/_font-icons.scss",
        srcPath: "src/assets/z_sampleApp_1/fonts",
        distPath: "dist/assets/z_sampleApp_1/fonts"
      }
    },
    fonts: {
      toolkit: {
        src: "src/assets/toolkit/fonts/**/*",
        dest: "dist/assets/toolkit/fonts",
      },
      z_sampleApp_1: {
        src: "src/assets/z_sampleApp_1/fonts/**/*",
        dest: "dist/assets/z_sampleApp_1/fonts",
      }
    },
    templates: {
      watch: "src/**/*.{html,md,json,yml}",
    },
    dest: "dist",
    assetsZip: {
      srcPath: "dist/assets/toolkit/**",
      targetFile: "toolkit.zip",
      targetFolder: "dist/zip",
    },
  };

  return config;
};
