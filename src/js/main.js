requirejs.config({
	baseUrl: './js',
	"paths": {

		"jquery": "../lib/jquery",
		"jquery-ui": "../lib/jquery-ui",
		"bootstrap": '../lib/bootstrap-3.3.6-dist/js/bootstrap',
		
		"spin": "../lib/spin",

		"angular": "../lib/angular",
		"ngAnimate": "../lib/angular-animate",
		"ngRoute": "../lib/angular-route",
		"ngCookies": "../lib/angular-cookies",
		"ngTranslate-core": "../lib/angular-translate",
		"ngTranslate-loader": "../lib/angular-translate-loader-static-files",
		"ngTranslate-storage": "../lib/angular-translate-storage-cookie",
		"ngTranslate": "../lib/angular-translate-storage-local",
		"ngComplete": "../lib/angucomplete-alt",
		"ui-boostrap-tpls": "../lib/ui-bootstrap-tpls-1.3.2"
	},
	shim: {
		'jquery-ui': ['jquery'],
		'bootstrap': ['jquery'],
		'ui-boostrap-tpls' : ['bootstrap', 'angular'],

		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'ngAnimate': ['angular'],
		'ngRoute': ['angular'],
		'ngCookies': ['angular'],
		'ngTranslate-core': ['angular'],				// we trick a little here so
		'ngTranslate-loader': ['ngTranslate-core'],		// module 'ngTranslate' actually includes 
		'ngTranslate-storage': ['ngTranslate-core'],	// the async loader and storage extensions
		'ngTranslate': ['ngTranslate-loader', 'ngTranslate-storage'],
		'ngComplete': ['angular']
	}
});


// Load everything, start the app 
requirejs([
	'jquery-ui',
	'app/browse',		// everything else
	'app/view', 		// is implicitly
	'app/translate',	// pulled via
	'util/directives',	// dependencies
	'query/query'
], function() {
	jQuery(function() {
		//console.log('haz all filez, ready, acshionz!');
		angular.bootstrap( document, ['classBrowserApp'], { strictDi: true } );
	});
});