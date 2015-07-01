// code/controls.js - common form controls
// Jonathan Eiten

// Contents:
//	1. module form.control.models - control model constructors, as named in model.type
//	2. module form.control.views - control view constructors, as named in model.type (yes, same names as their models)


Backbone.App.module('form.control.models', function(app, mod) {

	var Textbox = Backbone.Model.extend({
		defaults: {
			value: '',
			rows: 1,
			container: app.form.constants.defaultContainer
		}
	});

	// A `Choice` model represents an exclusive choice and can be rendered by
	// either `app.controls.views.Dropdown` or `app.controls.views.RadioGroup`.
	var Choice = Backbone.Model.extend({
		defaults: {
			value: '',
			choices: [ ],
			label: '',
			header: { },
			container: app.form.constants.defaultContainer
		},
		initialize: function() {
			// Convert `choices` attribute to a hash (if not already)
			// with keys as all-lower-case versions of values.
			if (_.isArray(this.attributes.choices)) {
				var keys = _(this.attributes.choices).map(function(item) { return item.toLowerCase(); });
				this.attributes.choices = _.object(keys, this.attributes.choices);
			}
		}
	});

	var Checkbox = Backbone.Model.extend({
		defaults: {
			value: 'N',
			checked: 'Y',
			unchecked: 'N',
			container: app.form.constants.defaultContainer
		}
	});

	return {
		Textbox: Textbox, TextboxWithAddon: Textbox,
		Choice: Choice, Dropdown: Choice, RadioGroup: Choice, RadioGroupExposed: Choice,
		Checkbox: Checkbox
	};

});


Backbone.App.module('form.control.views', function(app, mod) {

	var Control = Backbone.View.extend({
		className: 'form-group',
		attributes: function() { return this.model.get('viewAttributes'); },
		events: { change: 'onChange' },
		initialize: function() {
			_(this.model.get('data')).each(function(datum, datumName) {
				this.$el.data(datumName, datum);
			}, this);
			this.listenTo(this.model, 'change:value', this.onUpdate);
		},
		render: function() {
			var template = app.template[this.model.get('template') || this.template],
				mixins = { fmt: app.template[this.valueTemplate] },
				mergeVars = _.extend(mixins, this.model.attributes),
				html = template(mergeVars);
			this.$el.append(html);
			return this;
		}
	});

	var onTextboxUpdate = function() {
		
	};

	var Textbox = Control.extend({
		template: 'textbox',
		onChange: function() {
			var value = this.$('input, textarea').val();
			this.model.attributes.value = value;
		},
		onUpdate: function() {
			var value = this.model.get('value');
			if (this.model.get('rows') === 1) {
				this.$('input').val(value);
			} else {
				this.$('textarea').text(value);
			}
		}
	});

	var TextboxWithAddon = Textbox.extend({
		template: 'textbox_with_addon'
	});

	var Chooser = Control.extend({
		valueTemplate: 'value_only',
		initialize: function(options) {
			this.onChoose = options.model.get('onChoose');
			Control.prototype.initialize.call(this);
		}
	});

	var Dropdown = Chooser.extend({
		template: 'dropdown',
		onChange: function() {
			var value = $('select').val();
			if (this.onChoose) { this.onChoose(value); }
			this.model.attributes.value = value;
		},
		onUpdate: function() {
			this.$('select').val(this.model.get('value'));
		}
	});

	var RadioGroup = Chooser.extend({
		template: 'radio_button',
		events: function() {
			return _(this.model.get('choices')).reduce(function(memo, option, value) {
				memo['change input[value="' + value + '"]'] = function() {
					if (this.onChoose) { this.onChoose(value); }
					this.model.attributes.value = value;
				};
				return memo;
			}, {});
		},
		onUpdate: function() {
			this.$('input[value="' + this.model.get('value') + '"]').prop('checked', true);
		}
	});

	var RadioGroupExposed = RadioGroup.extend({
		valueTemplate: 'value_with_key_exposed'
	});

	var Checkbox = Control.extend({
		className: 'checkbox',
		template: 'checkbox',
		onChange: function(evt) {
			var state = this.$('input').prop('checked') ? 'checked' : 'unchecked',
				value = this.model.get(state);
			if (this.onChoose) { this.onChoose(value); }
			this.model.attributes.value = value;
		},
		onUpdate: function() {
			var value = this.model.get('value') === this.model.get('checked');
			this.$('input').prop('checked', value);
		}
	});


	// Module interface
	return {
		Textbox           : Textbox,
		TextboxWithAddon  : TextboxWithAddon,
		RadioGroup        : RadioGroup,
		RadioGroupExposed : RadioGroupExposed,
		Dropdown          : Dropdown,
		Checkbox          : Checkbox
	};

});
