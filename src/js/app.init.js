define([ 'vendor/paper', 'vendor/codemirror/lib/codemirror', 'editor.plugins' ], function ( paper, CodeMirror ) {
  var w = window
    , d = document;

  // necessary elements
  var script = d.getElementById( 'paperscript' )
    , textarea = d.getElementById( 'plane' )
    , canvas = d.getElementById( 'paper' );

  // important variables
  var cm
    , ide
    , oldCode;

  var ideOptions = {
    lineNumbers: true,
    lineWrapping: true,
    electricChars: true,
    tabSize: 2,
    theme: 'monokai',
    extraKeys: {
      'Ctrl-Enter': 'runScript'
    }
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

  CodeMirror.commands.runScript = runScript;

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

  /**
   * Binds CodeMirror to DOM, sets focus and starts render loop
   */
  var setup = function () {
    ide = CodeMirror.fromTextArea( textarea, ideOptions );
    cm = d.querySelector( '.CodeMirror' );

    ide.on('change', debounce( runScript, 1000 ));
    
    ide.focus();
    ide.setCursor( ide.lastLine(), 0 );
  };

  // expose method to set up
  return {
    init: setup
  };

});