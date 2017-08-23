var fs = require('fs');
var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		scss           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		sourcemaps     = require('gulp-sourcemaps'),
		ftp            = require('vinyl-ftp'),
		pug            = require('gulp-pug'),
		markdown       = require('gulp-markdown'),
		notify         = require("gulp-notify"),
		rsync          = require('gulp-rsync');


		gulp.task('pug', ['markdown'], function buildHTML() {
			return gulp.src(['templates/**/*.pug', '!templates/**/_*.pug' ])
			.pipe(pug({
					pretty: true,
					data: {
						"global": JSON.parse(fs.readFileSync('templates/data/global.json', 'utf-8'))
					}
				}))
				.pipe(gulp.dest('src'))
		});

		gulp.task('markdown', function () {
    return gulp.src('templates/_md/**/*.md')
				.pipe(rename({suffix: '', prefix : '_'}))
        .pipe(markdown())
        .pipe(gulp.dest('templates/_md'));
});


// Скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'src/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'src/libs/jquery-3.2.1.min.js',
		'src/libs/OwlCarousel/dist/owl.carousel.min.js',
		'src/js/uikit.min.js',
		//'src/js/uikit-icons.min.js',
		'src/js/uikit-icons-theme.js',
		'src/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('src/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('scss', function() {
	return gulp.src('src/scss/dewelop.scss')
	.pipe(sourcemaps.init())
	.pipe(scss({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(gulp.dest('src/css'))
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['scss', 'js',  'pug', 'markdown', 'browser-sync'], function() {
	gulp.watch('src/scss/**/*.scss', ['scss']);
	gulp.watch('templates/**/*.pug', ['pug']);
	gulp.watch('templates/_md/**/*.md', ['markdown']);
	gulp.watch(['libs/**/*.js', 'src/js/common.js'], ['js']);
	gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});


gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('rsync', function() {
	return gulp.src('dist/**')
	.pipe(rsync({
		root: 'dist/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		archive: true,
		silent: false,
		compress: true
	}));
});

gulp.task('build', ['removedist', 'imagemin', 'scss', 'js'], function() {

	var buildFiles = gulp.src([
		'src/*.html',
		'src/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'src/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'src/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'src/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
