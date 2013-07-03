/*!
 * Paper Plane v0.1.0
 * 2013-07-04
 * http://11am.github.com/paper-plane
 * Copyright (c) 2013
 * Arne Schlüter; Licensed MIT
!*/

(function (w, d) {

	// necessary elements
	var script = d.getElementById( 'paperscript' )
		, textarea = d.getElementById( 'plane' )
		, canvas = d.getElementById( 'paper' )
		, loadLink = d.getElementById( 'load') ;

	// important variables
	var storageName = 'drawings'
		, storageSpace = {}
		, storagePrefix = 'drawing-'
		, storageAmount = 0
		, currentDrawing
		, cm, ide
		, oldCode;

	var ideOptions = {
		lineNumbers: true,
		lineWrapping: true,
		electricChars: true,
		tabSize: 2,
		theme: 'monokai',
		extraKeys: {
			'Ctrl-Enter': 'runScript',
			'Ctrl-S': 'persistDrawing',
			'Ctrl-Y': 'loadDrawing'
		}
	};

	// helpers
	var _hasOwn = function( object, key) {
		return Object.prototype.hasOwnProperty.call( object, key );
	};

	/**
	 * function for running code from the textarea
	 * original code from paperjs.org
	 */
	var runScript = function () {
		var scope = paper.PaperScope.get( script );
		if (scope) {
			var code = ide.getValue();
			script.innerHTML = code;

			// Clear scope first, then evaluate a new script.
			var clearAndSetup = function() {
				scope.clear();
				scope.initialize( script );
				scope.setup( canvas );
			};

			if (code !== oldCode) {
				try {
					clearAndSetup();
					scope.evaluate( code );
					oldCode = code;
				} catch(e) {
					// if the evaluation fails, simply execute last working code
					clearAndSetup();
					scope.evaluate( oldCode );
					throw e;
				}
			}
		}
	};

	/**
	 * Helper functions for handling all drawings
	 */

	// keeps storageSpace up to date with what's in localStorage
	// called on initialization and when a drawing is saved
	var getDrawings = function () {
		storageSpace = JSON.parse( localStorage.getItem( storageName ) );
		storageAmount = 0;

		var currentDrawing;
		
		for (var key in storageSpace) {
			if ( _hasOwn( storageSpace, key ) ) {
				storageSpace[ key ] = JSON.parse( storageSpace[ key ] );
				storageAmount++;
			}
		}

		// display load link
		if ( storageAmount > 0 ) {
			loadLink.parentElement.classList.remove('hidden');
		}
	};

	// gets a single drawing inside storageSpace
	var findDrawing = function ( name ) {
		return storageSpace[ storagePrefix + name ];
	};

	// saves a single drawing and keeps all drawings in sync with localStorage
	var saveDrawing = function ( drawing ) {
		drawing.alreadySaved = true;
		
		storageSpace[ storagePrefix + drawing.name ] = drawing;

		// Stringify all items
		var tmpStore = Object.create( storageSpace );
		for (var key in storageSpace) {
			if ( _hasOwn( storageSpace, key ) ) {
				tmpStore[ key ] = JSON.stringify( storageSpace[ key ] );
			}
		}

		localStorage.setItem( storageName, JSON.stringify( tmpStore ) );
	};

	/**
	 * Saving current editor content to LocalStorage.
	 */
	var Drawing = function Drawing ( name, content, loaded ) {
		this.name = name;
		this.content = content;

		// if it gets called without 3rd parameter, it's not saved yet
		this.alreadySaved = !!loaded;
	};

	Drawing.prototype.setName = function () {
		this.name = window.prompt('Enter a name for your drawing:');
	};

	Drawing.prototype.continueWithName = function () {
		if ( !this.alreadySaved && findDrawing( this.name ) ) {
			return window.confirm(
				'There is already a drawing with the name "' + this.name + '".\n' +
				'Do you want to overwrite it?'
			);
		}

		return true;
	};

	Drawing.prototype.save = function () {
		if ( !this.alreadySaved ) {
			this.setName();

			if ( !this.name || !this.continueWithName() ) {
				this.name = '';
				return;
			}
		}

		this.content = ide.getValue();
		
		saveDrawing( this );
		getDrawings();
	};

	/**
	 * @static
	 * @return Drawing
	 */
	Drawing.load = function ( name ) {
		var object = findDrawing( name );

		return new Drawing( object.name, object.content, true ); 
	};

	// save and load functions to be called externally
	var persistDrawing = function () {
		currentDrawing.save();
	};

	var loadDrawing = function ( instance, name ) {
		if ( !name ) {
			name = window.prompt( 'Enter the script to be loaded' );
		}

		currentDrawing = Drawing.load( name );
		instance.setValue( currentDrawing.content );
		runScript();
	};

	/**
	 * Return a function that will only be called once (at the end) when
	 * continued to be called in a specified interval
	 * Original code from underscore.js
	 */
	var debounce = function( func, wait ) {
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      
      var later = function() {
        timeout = null;
        result = func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      return result;
    };
  };

  CodeMirror.commands.runScript = runScript;
	CodeMirror.commands.persistDrawing = persistDrawing;
	CodeMirror.commands.loadDrawing = loadDrawing;

	/**
	 * Add CodeMirror, take care of focusing and bluring
	 */
	var setup = function () {
		ide = CodeMirror.fromTextArea( textarea, ideOptions );
		cm = d.querySelector( '.CodeMirror' );

		ide.on('change', debounce( runScript, 500 ));
		
		ide.focus();
		ide.setCursor( ide.lastLine(), 0 );

		// needed for saving and loading scripts
		currentDrawing = new Drawing();

		// set up localStorage
		if ( !localStorage.getItem( storageName ) ) {
			localStorage.setItem( storageName, JSON.stringify( storageSpace ) );
		} else {
			getDrawings();
		}
	};

	setup();

})( window, document );