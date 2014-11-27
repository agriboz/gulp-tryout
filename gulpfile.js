var gulp   = require('gulp');
var config = require('./config.json');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

gulp.task('jade', function(){
	return gulp.src(config.jade.src)
	.pipe(plugins.jade())
	.pipe(gulp.dest(config.jade.build))
});

gulp.task('ci', ['jade']);