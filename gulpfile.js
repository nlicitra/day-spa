var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var mustache = require('gulp-mustache');
var fs = require('fs');
var babel = require('gulp-babel');
var python = require('python-shell');
var del = require('del');
var _ = require('lodash/core');

// Compile SCSS into CSS
gulp.task('sass', function() {
	return gulp.src('./src/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(concat('main.css'))
		.pipe(gulp.dest('./dist/styles/'));
});

gulp.task('sass:watch', function() {
	return gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('es6', function() {
	return gulp.src('./src/**/*.es6')
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('es6:watch', function() {
	return gulp.watch('./src/**/*.es6', ['es6']);
});

gulp.task('html', function() {
	var templateData = {};
	templateData.style = !!fs.existsSync('./dist/scripts/main.js');
	templateData.script = !!fs.existsSync('./dist/styles/main.css');
	if (!templateData.script && !templateData.style) {
		templateData.message = "It worked! Now get to coding!";
	}

	return gulp.src('./src/index.html')
		.pipe(mustache(templateData))
		.pipe(gulp.dest('dist'));
});

var libraries = ['d3', 'lodash']
gulp.task('lib', function() {
	var libPaths = _.map(libraries, function (lib) {
		return "./node_modules/" + lib + "/" + lib + ".min.js";
	});
	return gulp.src(libPaths)
		.pipe(concat('libraries.js'))
		.pipe(gulp.dest('./dist/scripts/'))
});

gulp.task('clean', function() {
	del(['./dist/**/*']);
});

gulp.task('server', function() {
	python.run('server.py', function (error) {
		if (error) throw error;
	});
});

gulp.task('watch', ['sass:watch', 'es6:watch']);
gulp.task('start', ['clean', 'lib', 'es6', 'sass', 'html', 'watch', 'server']);
gulp.task('default', ['start']);
