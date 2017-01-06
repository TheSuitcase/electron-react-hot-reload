#### This is an beta version! Use at your own risk.
---

# Electron React Hot Reload
> Develop your Electron React at lightning speed.


## Install
`npm install thesuitcase/electron-react-hot-reload`

## Usage
> Note: We are using gulp 4.0 for this example.

```js
...[imports]

function js(){
  return gulp
    .src(['./src/**/*.jsx', './src/**/*.js'], {since: gulp.lastRun(js)})
    .pipe(electronReactHotReload())
    .pipe(babel())
    .pipe(gulp.dest('./app'))
}

watch(['./src/**/*.jsx', './src/**/*.js'], js)

gulp.task('default', gulp.series(clean, js))

```
