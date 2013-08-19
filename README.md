# Paper Plane

Paper plane is a frontend-heavy webapp (hooray for [hoodie.js](http://hood.ie)!)
that is developed to provide a feature-rich, easy and fun to use IDE for working
with the awesome [paper.js](http://paperjs.org)-library.

## Running

1. Install [CouchDB](https://couchdb.apache.org/) (any version >= 1.2.0
	should work fine)
2. Install [node.js](http://nodejs.org) (Development is using version 0.10.x)
3. Install [bower](http://bower.io) (`npm install -g bower`)

Once all of that is done, `cd` into this directory and run `npm install && bower
install` to install all dependencies. Issue `npm start` and you're good to go!

## What's working

* Write code and have it rendered live in the background

## What's planned

* Save your sketches locally and publish them
* Browse published sketches
* Refine the user interface

## Developing

For browser side package management bower is used and the whole backend runs
with the help of hoodie (`npm install -g hoodie-cli`). The build process is
handled using [Grunt](http://gruntjs.com/) (`npm install -g grunt-cli`).