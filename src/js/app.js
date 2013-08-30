require.config({
	paths: {
		'vendor/paper': 'vendor/paper/dist/paper-full',
		'acorn': 'vendor/acorn'
	}
});

require([
  'vendor/jquery/jquery',
  'app.init',
  'hoodie.singleton'
], function ( $, app, hoodie ) {
  app.init();
});