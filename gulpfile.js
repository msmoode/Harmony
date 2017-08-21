const gulp = require('gulp')
const babel = require('gulp-babel')
const browserify = require('gulp-browserify')
const standard = require('gulp-standard')
const rename = require('gulp-rename')

gulp.task('default', ['build'], function () {
})

gulp.task('build', function () {
  gulp.src(['./harmony/**/*.!(js|jsx)'])
        .pipe(gulp.dest('build'))

  gulp.src(['./harmony/**/*.@(js|jsx)'])
        .pipe(standard())
        .pipe(standard.reporter('default', {
          breakOnError: true,
          quiet: true
        }))
        .pipe(babel({
          presets: ['env', 'es2015', 'react']
        }))
        .pipe(gulp.dest('build'))
})
