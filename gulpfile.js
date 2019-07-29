let gulp = require('gulp'),
	watch = require('gulp-watch'),
	browserSync = require('browser-sync').create(),
	include = require("gulp-include"),
	concat = require('gulp-concat-multi'),
	postcss = require('gulp-postcss'),
	nested = require('postcss-nested'),
	nestedAncestors = require('postcss-nested-ancestors'),
	autoprefixer = require('autoprefixer'),
	csscomment = require('postcss-inline-comment'),
	cssnano = require('cssnano'),
	simplevars = require('postcss-simple-vars');

let paths = {
	src: {
		html: [
			'./project/*.html',
		],
		css: [
			'./project/*.css',
		],
	},
	dist: {
		css: './build/assets/css/',
		html: './build/',
	},
	watch: {
		html: [
			'./project/*.html',
		],
		css: [
			'./project/*.css',
		],
	}
};

gulp.task('html', function (done) {
	let stream = gulp.src(paths.src.html)
		.pipe(include())
		.on('error', console.log)
		.pipe(gulp.dest(paths.dist.html))

	stream.on('end', function () {
		browserSync.reload();
	});

	return stream;
});

gulp.task('css', function () {
	return concat({
			'style.css': paths.src.css
		})
		.pipe(postcss([
			csscomment,
			simplevars,
			nestedAncestors,
			nested,
			autoprefixer(),
			cssnano()
		]))
		.on('error', console.log)
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream());

});

gulp.task('watch html', function () {
	return watch(paths.watch.html, function () {
		gulp.start('html');
	});
});

gulp.task('watch css', function () {
	return watch(paths.watch.css, function () {
		gulp.start('css');
	});
});

gulp.task('build', ['css', 'html']);

gulp.task('watch', function () {
	browserSync.init({
		server: "./build",
		tunnel: false
	});

	gulp.start('watch html');
	gulp.start('watch css');
});

gulp.task('dev', ['build', 'watch']);