requirejs.config({
	paths: {
		'vendor/paper': 'vendor/paper/dist/paper-full'
	}
});

require([ 'vendor/jquery/jquery', 'app.init', 'hoodie.singleton' ], function ( $, app, hoodie ) {
  app.init();
});