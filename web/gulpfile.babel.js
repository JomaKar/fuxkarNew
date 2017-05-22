var gulp = require('gulp');
var webserver = require('gulp-webserver');
var babelify = require('babelify');
var browserify = require('browserify');
var source= require('vinyl-source-stream');
var buffer= require('vinyl-buffer');
var uglify = require('gulp-uglify');
var smoosher= require('gulp-smoosher');
var imageop= require('gulp-imagemin');

var config = {
	scripts: {
	  	main: ['./src/scripts/index.js', './src/scripts/generalLook.js',
	  	 './src/scripts/einladung.js', './src/scripts/nickValidation.js',
	  	 './src/scripts/mailValidation.js', './src/scripts/autModels.js', 
	  	 './src/scripts/login.js', './src/scripts/catalogBrands.js',
	  	 './src/scripts/passModalDis.js', './src/scripts/profile.js', 
	  	 './src/scripts/carVersions.js', './src/scripts/specVersion.js',
	  	 './src/scripts/editProfile.js', './src/scripts/share.js',
	  	 './src/scripts/breadcrumb.js', './src/scripts/paseo.js', 
	  	 './src/scripts/changeLinksHref.js'],
	  	watch:'./src/scripts/**/*.js',
	  	output:'./js'
	},
	scriptsBL: {
	  	main: ['./src/scriptsBL/befLoad.js'],
	  	watch:'./src/scriptsBL/**/*.js',
	  	output:'./js'
	}
}

gulp.task('build:js', function(){
	return browserify(config.scripts.main).transform(babelify, {presets: ["es2015"]})
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(config.scripts.output));
});

gulp.task('buildBL:js', function(){
	return browserify(config.scriptsBL.main).transform(babelify, {presets: ["es2015"]})
	.bundle()
	.pipe(source('sbl.js'))
	.pipe(buffer())
	.pipe(uglify())
	.pipe(gulp.dest(config.scriptsBL.output));
});

gulp.task('watch', function() {
  gulp.watch(config.scripts.watch, ['build:js']);
  gulp.watch(config.scriptsBL.watch, ['buildBL:js']);
});

gulp.task('build', ['build:js', 'buildBL:js']).on('error', function(e){
		console.log(e);
	});

gulp.task('default', ['watch', 'build']);

