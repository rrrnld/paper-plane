// this file is used to load the necessary addons and plugins for codemirror
define([
	'vendor/codemirror/addon/tern/tern',
	'vendor/codemirror/addon/hint/show-hint',
	'vendor/codemirror/mode/javascript/javascript'
], function (TernServer) {

	return {
		tern: new TernServer({ 
			useWorker: !!window.Worker,
			workerScript: 'js/vendor/codemirror/addon/tern/worker.js',
      worderDeps: [ '../../../acorn/acorn.js', '../../../tern/lib/tern.js' ] 
		})
	};
});