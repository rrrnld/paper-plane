// this file is used to load the necessary addons and plugins for codemirror
require([
	'vendor/codemirror/addon/tern/tern',
	'vendor/codemirror/mode/javascript/javascript'
], function (TernServer) {
	return {
		tern: new TernServer({ 
			useWorker: !!window.Worker,
			workerScript: 'js/vendor/codemirror/addon/tern/worker.js'
		})
	};
});