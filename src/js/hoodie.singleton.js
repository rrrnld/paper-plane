define([ 'vendor/hoodie' ], function (Hoodie) {
  // this module initializes Hoodie once and then passes on the same instance
  // to every module that requires it
  
  return new Hoodie();
});