var gulp = require('gulp');
var jade = require('gulp-jade');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var gulpif = require('gulp-if');

var bases = {
	src: 'src/',
	dist: 'build/'
}

var paths = {
	scripts: ['scripts/**/*.js'],
	styles: ['styles/**/*.scss'],
	templates : ['templates/**/*.jade']
}

// If we don't explicitly set NODE_ENV, default is development.
var env = process.env.NODE_ENV || 'development';

gulp.task('jade', function(){
	return gulp.src(paths.templates, {cwd: bases.src})
	.pipe(jade())
	.pipe(gulp.dest(bases.dist))
});

gulp.task('scripts', function(){
	return browserify('./src/scripts/main',{ debug: env === 'development' }) // only include source maps if we are in development environment.
		.bundle()
		.pipe(source('bundle.js'))
		.pipe( gulpif( env === 'production', streamify(uglify()) ))
		.pipe(gulp.dest(bases.dist + 'scripts/'))
});

gulp.task('lint', function() {
	return gulp.src(paths.scripts, {cwd: bases.src})
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(stylish))
});

gulp.task('sass', function(){
	var config = {};

	if (env === 'development') {
		config.sourceComments = 'map';
	}

	if (env === 'production') {
		config.outputStyle = 'compressed';
	}

	return gulp.src(paths.styles, {cwd:bases.src})
	.pipe(sourcemaps.init())
		.pipe(sass(config))
	.pipe(sourcemaps.write('maps/'))
	.pipe(gulp.dest(bases.dist + '/styles'));
});

gulp.task('browser-sync', function () {
   var files = [
      bases.dist + '*.html',
      bases.dist + 'styles/**/*.css',
      bases.dist + 'scripts/**/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: bases.dist
      }
   });
});

gulp.task('watch', function(){
	gulp.watch(paths.scripts, {cwd: bases.src}, ['scripts'])
	gulp.watch(paths.styles, {cwd: bases.src}, ['sass'])
	gulp.watch(paths.templates, {cwd: bases.src}, ['jade'])
});


gulp.task('ci', ['scripts', 'default']);

gulp.task('default', ['jade', 'scripts', 'sass' ,'watch']); // run-sequence