# grunt-pngdrive

A simple task to encode text files using PNGDrive https://github.com/claus/PNGDrive.

## Usage

	Configure it with:

  	// Project configuration.
	grunt.initConfig({
	  'grunt-pngdrive': {

		  compress:{
			  output:'out/out.png',
			  src:['data/**/*.*']
		  }
	  }
	});

	// load task.
    grunt.loadNpmTasks('grunt-pngdrive');


TODO: Update documentation...