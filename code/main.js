// code/quiz.js
// Jonathan Eiten
// Main module

Backbone.App.start(function(app) {

	// 4-STEP BOOTSTRAP PROCESS:

	// 1: Instantiate the "controls" collection and all its control models
	var controls = new app.form.Collection(app.quiz.models);

	// 2: Instantiate the form's data model
	var form = new app.form.Model();
	
	// 3: Instantiate the form's view, which renders all the controls
	var formView = new app.form.View({
		collection: controls,
		model: form
	});

	// 4: Now with everything instantiated, fill the rendered controls with data
	form.fetch();
});
