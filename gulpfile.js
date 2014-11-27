var gulp = require('gulp');

gulp.task('testing', function(){
	console.log('testing');
});


gulp.task('ci', ['testing']);