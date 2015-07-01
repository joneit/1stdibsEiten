// code/template.js - Template pre-compiler
// Jonathan Eiten

Backbone.App.module('template', function(app, mod) {

	// Compiles all templates with _.template() and installs them in the module using their ids.

	var $templateScripts = $('script[type="text/template"][id|="template"]');

	$templateScripts.each(function(idx, elt) {
		var id = elt.id.replace(/^template-/, '').replace(/[^\w]/g, '_');
		mod[id] = _.template($(elt).text());
	});

});
