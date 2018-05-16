var gulp = require('gulp'),
    gulpCleanCss = require('gulp-clean-css'),            //压缩css
    gulpCssUrlVer = require('gulp-make-css-url-version'),//CSS引用文件的md5生产版本号
    gulpUglify = require('gulp-uglify'),                 //压缩js
    gulpImageMin = require('gulp-imagemin'),             //压缩图片
    gulpHtmlMin = require('gulp-htmlmin'),               //压缩html
    gulpConcat = require('gulp-concat'),                 //文件合并
    gulpLess = require('gulp-less'),                     //编译less文件
    gulpRunSequence = require('gulp-run-sequence'),      //顺序执行任务
    gulpRev = require('gulp-rev'),                       //对文件名加MD5后缀
    gulpRevCollector = require('gulp-rev-collector'),    //gulp-rev的插件，用于html模板更改引用路径
    del = require('del');                                //删除文件及目录


var assets = {
    images: './src/assets/images/**/*',
    less: './src/assets/less/**/*.less',
    css: './src/assets/css/**/*.css',
    js: [
        './src/assets/js/libs/zepto.js',
        './src/assets/js/libs/touch.js',
        /*'./src/assets/js/libs/swiper.jquery.js',
        './src/assets/js/libs/swiper.animate.js',*/
        './src/assets/js/app.js'
    ],
    rev: ['rev/**/*.json', 'src/*.html']
}

// html压缩
gulp.task('rev', function() {
    return gulp.src( assets.rev )
        // html模板更改引用路径
        .pipe(gulpRevCollector({
            replaceReved: true,
            dirReplacements: {
                'assets/css/': 'assets/css/',
                'assets/images/': 'assets/images/',
                'assets/js/': 'assets/js/'
            }
        }))
        .pipe(gulpHtmlMin({
            collapseWhitespace: true,       // 压缩HTML
            removeComments: true,           // 清除HTML注释
            removeEmptyAttributes: true,    // 删除所有空格
            minifyCSS: true,                // 压缩页面CSS
            minifyJS: true                  // 压缩页面JS
        }))
        .pipe( gulp.dest('./dist') );
});

// images压缩
gulp.task('images', function() {
    return gulp.src(assets.images)
        // 压缩images
        .pipe(gulpImageMin())
        // 对文件名加MD5后缀
        .pipe(gulpRev())
        // 构建到发布目录
        .pipe(gulp.dest('./dist/assets/images'))
        // 写入文件MD5版本号
        .pipe(gulpRev.manifest())
        .pipe(gulp.dest('./rev/assets/images'));
});

// 编译less文件
gulp.task('less', function() {
    return gulp.src(assets.less)
        .pipe(gulpLess())
        .pipe(gulp.dest('./src/assets/css'));
});

// css压缩、MD5、替换引用
gulp.task('css', function() {
    return gulp.src(assets.css)
        // 合并代码
        .pipe(gulpConcat('app.css'))
        // 压缩CSS代码
        .pipe(gulpCssUrlVer()) //给css文件里引用文件加版本号（文件MD5）
        .pipe( gulpCleanCss())
        // 对文件名加MD5后缀
        .pipe(gulpRev())
        // 构建到发布目录
        .pipe(gulp.dest('./dist/assets/css'))
        // 写入文件MD5版本号
        .pipe(gulpRev.manifest())
        .pipe(gulp.dest('./rev/assets/css'));
});

// js压缩、MD5、替换引用
gulp.task('js', function() {
    return gulp.src(assets.js)
        // 合并代码
        .pipe(gulpConcat('app.js'))
        // 压缩JS代码
        .pipe(gulpUglify())
        // 对文件名加MD5后缀
        .pipe(gulpRev())
        // 构建到发布目录
        .pipe(gulp.dest('./dist/assets/js'))
        // 写入文件MD5版本号
        .pipe(gulpRev.manifest())
        .pipe(gulp.dest('./rev/assets/js'));
});

// 清理dist目录
gulp.task('clean', function(){
    del(['./dist/*.html', './dist/assets/css/**/*.*', './dist/assets/images/**/*.*', './dist/assets/js/**/*.*']);
    //del('./dist/**');
});

// build
gulp.task('build', function(callback){
    // 顺序执行依赖任务
    //gulpRunSequence('clean', ['images', 'css', 'js'], 'rev', callback);
    gulpRunSequence('clean', 'less', ['css', 'js'], 'rev', callback);
});

gulp.task('watch', function(){
    gulp.watch( './src/**/*.*', ['build'] );
});

// 默认任务
gulp.task('default', ['watch']);