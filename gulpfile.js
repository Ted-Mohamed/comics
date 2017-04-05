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

const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const webpack = require('webpack');
gulp.task('scripts', function () {
  const ExtractTextPlugin = require("extract-text-webpack-plugin");
  gulp.task('scripts', function () {
    return gulp.src('source/scripts/*.js')
      .pipe(named())
      .pipe(webpackStream({
        output: {
          filename: '[name].js',
        },
        resolve: {
          extensions: ['.js', '.vue', '.json'],
          alias: {}
        },
        module: {
          rules: [
            {
              test: /\.vue$/,
              loader: 'vue-loader',
              options: {
                loaders: {
                  js: 'buble-loader',
                  stylus: ExtractTextPlugin.extract({
                    use: 'raw-loader',
                  })
                }
              }
            },
            {
              test: /\.js$/,
              loader: 'buble-loader',
              exclude: /node_modules/
            },
          ]
        },
        plugins: [
          // new webpack.LoaderOptionsPlugin({
          //   minimize: true,
          //   debug: false
          // }),
          new ExtractTextPlugin({
            filename: (getPath) => {
              return path.relative(path.resolve(__dirname, './public/assets/scripts/'), path.resolve(__dirname, './source/styles/components', getPath('[name].styl')))
            },
            allChunks: true
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module) {
              return module.context && module.context.indexOf('node_modules') !== -1;
            }
          }),
          new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('production'),
            FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
            AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
            FIREBASE_DATABASE_URL: JSON.stringify(process.env.FIREBASE_DATABASE_URL),
            FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
            FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
            FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID)
          }),
          // new webpack.optimize.UglifyJsPlugin({
          //   beautify: false,
          //   mangle: {
          //     screw_ie8: true,
          //     keep_fnames: true
          //   },
          //   compress: {
          //     screw_ie8: true
          //   },
          //   comments: false
          // })
        ],
      }, webpack))
      .on('error', onError)
      .pipe(gulp.dest('./public/assets/scripts/'));
  });
});

gulp.task('watch', ['images', 'fonts', 'markup', 'scripts', 'styles'], function () {
  gulp.watch("source/images/**/*", { cwd: './' }, ['images'])
  gulp.watch("source/fonts/**/*", { cwd: './' }, ['fonts'])
  gulp.watch("source/styles/**/*.styl", { cwd: './' }, ['styles']);
  gulp.watch("source/markup/**/*.pug", { cwd: './' }, ['markup']);
  gulp.watch("source/scripts/**/*.{js,vue}", { cwd: './' }, ['scripts']);
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
