const
	gulp = require('gulp'),
	pump = require('pump'),
	babel = require('gulp-babel'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename');

const
	getRoutines = (type = '', compress = false) => {
		let routines = [gulp.src('src/*.es6')];

		if(type === 'amd') {
			routines.push(babel({
				presets: ['es2015'],
				plugins: ['transform-es2015-modules-amd']
			}));
			routines.push(rename({
				suffix: '-amd'
			}));
		} else {
			routines.push(babel({
				presets: ['es2015']
			}));
		}

		if(compress) {
			routines.push(uglify({
				mangle: true
			}));
			routines.push(rename({
				suffix: '.min'
			}));
		}

		routines.push(gulp.dest('dist'));

		return routines;
	};

gulp
	.task('noamd', callback => {
		pump(getRoutines(), callback);
	})
	.task('noamd-compress', callback => {
		pump(getRoutines('', true), callback);
	})
	.task('amd', callback => {
		pump(getRoutines('amd'), callback);
	})
	.task('amd-compress', callback => {
		pump(getRoutines('amd', true), callback);
	})
	.task('build', ['noamd', 'noamd-compress'])
	.task('build-amd', ['amd', 'amd-compress'])
	.task('default', ['build', 'build-amd']);
