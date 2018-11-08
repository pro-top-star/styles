const gulp = require('gulp');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const gulpif = require('gulp-if');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const header = require('gulp-header');
const config = require('../config');
const pkg = require('../../package');

let environment = require('../lib/environment');

const paths = {
    src: config.root.css,
    dest: environment.production ? config.root.dest : config.root.tmp
}

var d = new Date();
var y = d.getFullYear();
var banner = `/*!
* Fiori Fundamentals v${pkg.version}
* Copyright (c) ${y} SAP SE or an SAP affiliate company.
* Licensed under Apache License 2.0 (https://github.com/SAP/Fundamental/blob/master/LICENSE)
*/\n`;

//compile top-level files
var sassTask = (cb) => {
    let prefix = config.tasks.css.prefix;
    let files = environment.production ? `${paths.src}/*.${config.tasks.css.extensions}` : `${paths.src}/all.scss`;

    var isAllCss = function (file) {
        return file.path.includes('all');
    }
    console.log('test')
    gulp.src(files)
        .pipe(gulpif(environment.development, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(config.tasks.css.autoprefixer))
        .pipe(gulpif(environment.production, cleanCSS(config.tasks.css.cleanCSS)))
        .pipe(gulpif(isAllCss, rename({
            basename: prefix
        })))
        .pipe(gulpif(environment.development, sourcemaps.write()))
        .pipe(gulp.dest(paths.dest));
    cb();
}
gulp.task('pkg-sass', sassTask);

//compile top-level (dark) files
var darkSassTask = (cb) => {
    let prefix = config.tasks.css.prefix;
    let files = environment.production ? `${paths.src}/*.${config.tasks.css.extensions}` : `${paths.src}/all-dark.scss`;

    var isAllCss = function (file) {
        return file.path.includes('all-dark');
    }
    gulp.src(files)
        .pipe(gulpif(environment.development, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(config.tasks.css.autoprefixer))
        .pipe(gulpif(environment.production, cleanCSS(config.tasks.css.cleanCSS)))
        .pipe(gulpif(isAllCss, rename({
            basename: prefix
        })))
        .pipe(gulpif(environment.development, sourcemaps.write()))
        .pipe(gulp.dest(paths.dest))
    cb();
}
gulp.task('pkg-dark-sass', darkSassTask);

//compile individual component files
var componentsTask = (cb) => {
    var files = [
        `${paths.src}/components/*.${config.tasks.css.extensions}`,
        `!${paths.src}/components/_*.${config.tasks.css.extensions}`
    ];
    return gulp.src(files)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer(config.tasks.css.autoprefixer))
        .pipe(gulpif(environment.production, cleanCSS(config.tasks.css.cleanCSS)))
        .pipe(gulp.dest(`${paths.dest}/components`))
}
gulp.task('pkg-css-components', componentsTask);

//create minify versions
var minifyTask = (cb) => {
    return gulp.src([`${paths.dest}/**/*.css`])
        .pipe(cleanCSS({
            level: {
                1: {
                    specialComments: false
                }
            }
        }))
        .pipe(rename({
            suffix: `.min`
        }))
        .pipe(gulp.dest(paths.dest))
}
gulp.task('pkg-css-minify', minifyTask);

//add banner
var bannerTask = (cb) => {
    gulp.src([`${paths.dest}/**/*.css`])
        .pipe(header(banner))
        .pipe(gulp.dest(paths.dest));
    cb();
}
gulp.task('pkg-css-banner', bannerTask);

//main css task


// const cssTask = (cb) => {
//     console.log('AAA', environment);

//     if (environment.production) {
//         gulp.series('pkg-sass', 'pkg-dark-sass', 'pkg-css-components', 'pkg-css-minify', 'pkg-css-banner', cb());
//     } else {
//         gulp.series('pkg-sass', 'pkg-dark-sass', cb());
//     }
// }
module.exports = gulp.task('pkg-css', environment.production ?
    gulp.series('pkg-sass', 'pkg-dark-sass', 'pkg-css-components', 'pkg-css-minify', 'pkg-css-banner') :
    gulp.series('pkg-sass'));
// module.exports = cssTask;