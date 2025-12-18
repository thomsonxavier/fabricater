### CSS Methodology
For CSS Architecture SMACSS would be used guidelines. Detailed guidelines on writing modular styles can be found at [SMACSS Guidelines](https://smacss.com/)

### Starting with BEM
For naming convention we would be using BEM (Block Element Modifier). Detailed guidelines on BEM can be found at [BEM Guidelines](https://en.bem.info/methodology/quick-start/). **CSS Naming** section provides detailed conventions used.

### Linting
For SASS or CSS linting [Stylelint](https://stylelint.io/) is being used with [gulp-stylelint](https://github.com/olegskl/gulp-stylelint) to hook gulp watch and start tasks. The paths for files to be linted are defined in `gulp.config.js` file under `toolkit` object as below:

```js
toolkit: {
  src: 'src/assets/toolkit/styles/toolkit.scss',
  brandStyles: {'src' : 'src/data/toolkit.yml', 'dest' :"src/assets/toolkit/styles/settings/_brand-colors.scss"},
  lint:
    [
      //get all .scss files in the src/assets/toolkit/styles folder.
      'src/assets/toolkit/styles/**/*.scss',
      //paths starting with ! will be ignored.
      '!src/assets/toolkit/styles/_font-icons.scss',
      '!src/assets/toolkit/styles/template/_font-icons.scss'
    ],
    dest: 'dist/assets/toolkit/styles',
    watch: 'src/assets/toolkit/styles/**/*.scss'
}
```
