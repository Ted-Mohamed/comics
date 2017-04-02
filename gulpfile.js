const fs = require('fs')
const path = require('path')
const gulp = require('gulp')
const env = require('gulp-env')
const gutils = require('gulp-util')
const connect = require('gulp-connect')
const sourcemaps = require('gulp-sourcemaps')
const exec = require('child_process').exec;
const syncy = require('syncy');
const debounce = require('lodash.debounce');
const del = require('del');
const glob = require('glob')
const pug = require('gulp-pug')

const stylus = require('gulp-stylus')
const rupture = require('rupture')
const stylusUnits = require('stylus-units')
const stylusSymetra = require('stylus-symetra')
const stylusVerticalGrid = require('stylus-vertical-grid')

const postcss = require('gulp-postcss')
const rucksack = require('rucksack-css')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const mqpacker = require("css-mqpacker")

const rollup = require('rollup').rollup
const buble = require('rollup-plugin-buble')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')
const minify = require('uglify-js').minify
const vue = require('rollup-plugin-vue')
const nodeGlobals = require('rollup-plugin-node-globals')
const json = require('rollup-plugin-json')
const replace = require('rollup-plugin-replace')
function onError(error) {
  gutils.log(error.message);
  this.emit('end');
}

env('.env.json');

var isProduction = !!gutils.env.production

gulp.task('serve', function () {
  connect.server({
    livereload: true,
    root: './public/',
    port: 8888
  });
});

gulp.task('markup', function () {
  return gulp.src('./source/markup/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', onError)
    .pipe(gulp.dest('./public/'))
    .pipe(connect.reload())
})

gulp.task('styles', function () {
  var postCSSPlugins = [
    rucksack(),
  ]

  if (isProduction) {
    postCSSPlugins = postCSSPlugins.concat([
      autoprefixer({ browsers: ['last 1 version'] }),
      mqpacker(),
      cssnano(),
    ])
  }

  return gulp.src('./source/styles/*.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus({
      use: [rupture(), stylusUnits(), stylusSymetra(), stylusVerticalGrid()]
    }))
    .on('error', onError)
    .pipe(postcss(postCSSPlugins))
    .on('error', onError)
    .pipe(isProduction ? gutils.noop() : sourcemaps.write())
    .pipe(gulp.dest('./public/assets/styles/'))
    .pipe(connect.reload());
})

gulp.task('scripts', function () {

  glob.sync('./source/scripts/*.js').forEach(filepath => {
    const filename = path.basename(filepath, '.js')

    var plugins = [
      json({}),
      replace({
        "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
        "AUTH_DOMAIN": process.env.AUTH_DOMAIN,
        "FIREBASE_DATABASE_URL": process.env.FIREBASE_DATABASE_URL,
        "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
        "FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
        "FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID
      }),
      vue({
        css: function (styles, styleNodes) {
          fs.writeFileSync(`./source/styles/modules/${filename}.styl`, styles)
        }
      }),
      buble({
        objectAssign: 'Object.assign'
      }),
      resolve({ jsnext: true, main: true, browser: true }),
      commonjs(),
      nodeGlobals(),
    ]

    if (isProduction) {
      plugins = plugins.concat([
        uglify({}, minify),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ])
    }

    return rollup({
      entry: filepath,
      plugins: plugins
    }).then((bundle) => {
      return bundle.write({
        format: 'iife',
        useStrict: false,
        sourceMap: !isProduction,
        dest: `./public/assets/scripts/${filename}.js`
      })
    })
  })
});

gulp.task('watch', ['images', 'fonts', 'markup', 'styles', 'scripts'], function () {
  gulp.watch("source/images/**/*", { cwd: './' }, ['images'])
  gulp.watch("source/fonts/**/*", { cwd: './' }, ['fonts'])
  gulp.watch("source/styles/**/*.styl", { cwd: './' }, ['styles']);
  gulp.watch("source/markup/**/*.pug", { cwd: './' }, ['markup']);
  gulp.watch("source/**/*.{js,vue}", { cwd: './' }, ['scripts']);
});

gulp.task("fonts", function () {
  syncy('./source/fonts/**', './public/assets/fonts', {
    base: './source/fonts/'
  }).catch(console.error)
})

var imageOptim = debounce(function () {
  exec('./node_modules/.bin/imageOptim -d ./public/assets/images/ -a', function (err, stdout, stderr) {
    gutils.log(stdout.trim())
    console.error(stderr.trim())
  })
}, 200)

gulp.task('images', function () {
  syncy('./source/images/**', './public/assets/images', {
    base: './source/images/'
  }).then(() => {
    if (isProduction) { imageOptim() }
  }).catch(console.error)
})

gulp.task('clean', function () {
  del([
    './public/**/*.map',
  ])
})

gulp.task('default', ['clean', 'serve', 'watch']);
