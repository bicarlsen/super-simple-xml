var gulp 		= require( 'gulp' ),
	gutil 		= require( 'gulp-util' ),
	mocha 		= require( 'gulp-mocha' ),
	istanbul 	= require( 'gulp-istanbul' ), 
	jshint 		= require( 'gulp-jshint' );

/**
 * Default task
 * 
 */
gulp.task( 'default', [ 'watch', 'lint', 'test' ] );


/**
 * Lint files
 */
gulp.task( 'lint', function() {
	var lintFiles = [
		'gulpfile.js', 
		'index.js', 
		'tests/*.js', 
	];

	var lintOptions = {	
		maxlen: 	105,
		quotmark: 	'single',
		loopfunc: 	true
	};

	return gulp.src( lintFiles )
		.pipe( jshint( lintOptions ) )
		.pipe( jshint.reporter( 'jshint-stylish' ) );
} );

/**
 * Watch files
 */
gulp.task( 'watch', function() {
	var watchFiles = [
		'index.js', 
		'tests/*.test.js'
	];

	gulp.watch( watchFiles, [ 'lint', 'test' ] );
} );

/**
 * Test files using Mocha.
 * Test code coverage using Istanbul.
 */
gulp.task( 'test', function() {
	var coverFiles = [
		'index.js'
	];

	var testFiles = [
		'tests/*.test.js'
	];

	return gulp.src( coverFiles )
		.pipe( istanbul() )
		.pipe( istanbul.hookRequire() )
		.on( 'finish', function() {
			gulp.src( testFiles ) 
				.pipe( mocha() )
				.pipe( istanbul.writeReports() )
				.pipe( istanbul.enforceThresholds(
					{ thresholds: { global: 0 } }
				) )
				.once( 'end', function() {
					process.exit();
				} );
		} );
} );

/**
 * Make sure Gulp is running.
 * Basic task for debugging.
 */
gulp.task( 'isRunning', function() {
	return gutil.log( 'Gulp is running.' );
} );