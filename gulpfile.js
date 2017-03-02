var fs = require('fs');
var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		browserSync    = require('browser-sync').create(),
		less           = require('gulp-less'),
		sourcemaps     = require('gulp-sourcemaps'),
		autoprefixer   = require('gulp-autoprefixer'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		//rigger         = require('gulp-rigger'),
		pug            = require('gulp-pug'),
		path           = require('path');


gulp.task('serve', ['less', 'pug'], function() {

    browserSync.init({
			server: {
				baseDir: 'app'
			},
			notify: false,
    });

    gulp.watch("app/less/**/*.less", ['less']);
		//gulp.watch('template-html/**/*.html', ['template']);
		gulp.watch('template/**/*.pug', ['pug']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});


gulp.task('pug', function buildHTML() {
	return gulp.src('template/*.pug')
		.pipe(pug({
			pretty: true,
			data: {
				"global": JSON.parse(fs.readFileSync('template/data/vars.json', 'utf-8'))
			}
		}))
		.pipe(gulp.dest('app'))
		
});

// gulp.task('template', function () {
//   	return	gulp.src('template-html/**/*.html') //Выберем файлы по нужному пути
//         .pipe(rigger()) //Прогоним через rigger
//         .pipe(gulp.dest('app')) //Выплюнем их в папку build
//         .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
// });

gulp.task('less', function () {
  return gulp.src('app/less/*.less')
		.pipe(sourcemaps.init())
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('default', ['serve']);
