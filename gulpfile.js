const
	gulp = require('gulp'),
	pump = require('pump'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

gulp
	.task('build', callback => {
		pump([
			gulp.src('src/*.es6'),
			babel({presets: ['es2015']}),
			gulp.dest('dist')
		], callback);
	})
	.task('build-compress', callback => {
		pump([
			gulp.src('src/*.es6'),
			babel({presets: ['es2015']}),
			uglify({mangle: true}),
			rename({suffix: '.min'}),
			gulp.dest('dist')
		], callback);
	})

	// 기본 태스크
	.task('default', ['build', 'build-compress']);
