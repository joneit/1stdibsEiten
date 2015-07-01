// code/form.js
// Jonathan Eiten

// Contents:
//	1. module form.Model: master data model for a form
//	2. module form.Collection: the form's (polymorphic) control models
//	3. module form.View: renders the form's controls


Backbone.App.module('form.constants', function(app, mod) {
	return {
		siteUrl: 'http://localhost:8888/',
	    defaultContainer: 'section:first-of-type'
	};
});


Backbone.App.module('form', function(app, mod) {
	
	mod.Model = Backbone.Model.extend({
		url: function() { return mod.constants.siteUrl + 'data/item.json'; },
		sync: function(method, model, options) {
			console.log('Backbone.sync("' + method + '")');
			switch (method) {
				case 'read':
					Backbone.sync.apply(this, arguments);
					break;
				default:
					_(options.subviews).each(function(subview) {
						app.util.deref(model.attributes, subview.model.id, subview.model.get('value'), true);           
					});
					console.log(JSON.stringify(model.attributes, null, '\t'));
			}
		}
	});


	// On instantiation, the given array of models should be in display order for each container.
	mod.Collection = Backbone.Collection.extend({
	    model: function(attrs, options) {
			return new app.form.control.models[attrs.type](attrs, options);
		}
	});


	mod.View = Backbone.View.extend({
		el: 'body',
		events: { 'click button': 'onSaveClick' },
		initialize: function() {
			var formView = this;

			this.subviews = [ ];

			_(this.collection.models).each(function(model) {
				var constructor = app.form.control.views[model.get('type')],
					subview = new constructor({ model: model });

				formView.subviews.push(subview);

				subview.listenTo(formView.model, 'change', function() {
					var item = formView.model.get('result').item;
					var value = app.util.deref(item, model.get('id'), '');
					model.set('value', model instanceof app.form.control.models.Choice ? value.toLowerCase() : value);
				});
			});

			this.render();
		},
		render: function() {
			_(this.subviews).each(function(subview) {
				subview.render().$el.appendTo(subview.model.get('container'));                
			});
		},
		onSaveClick: function() {
			this.model.save(this.model.attributes, { subviews: this.subviews });
		}
	});

});
