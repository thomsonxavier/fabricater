### Font Generator
This task can be used from the command line to generate font from the SVG icons found in the `src/assets/toolkit/font-icons` directory. This task is not part of the `watch command` to avoid re-generating fonts on each document save. Below command can be used to generate the font.

`gulp iconfont`


### Brand Color Stylesheet Generator
This task can be used from the command line to generate brand colors from `/src/data/toolkit.yml` YAML file. The brand color stylesheet will be generated in `/src/assets/toolkit/styles/settings/_brand-colors.scss`. This task is not part of the `watch command` to avoid re-generating fonts on each document save. Below command can be used to generate the color stylesheet along with the right SASS variables.

`gulp styles:brand`
