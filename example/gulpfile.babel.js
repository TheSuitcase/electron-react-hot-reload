import gulp from 'gulp'
import electronReactHotReload from '../dist'
import del from 'del'
import babel from 'gulp-babel'
import watch from 'gulp-watch'

function clean(){
  return del(['app/*.js', 'app/*.jsx'])
}

function js(){
  return gulp
    .src(['./src/**/*.jsx', './src/**/*.js'], {since: gulp.lastRun(js)})
    .pipe(electronReactHotReload())
    .pipe(babel())
    .pipe(gulp.dest('./app'))
}

watch(['./src/**/*.jsx', './src/**/*.js'], js)

gulp.task('default', gulp.series(clean, js))