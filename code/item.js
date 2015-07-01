// item.js - List of form controls for a simple 1stdibs item page
// Jonathan Eiten

Backbone.App.module('quiz', function(app, mod) {

	var enums = JSON.parse($('#enums').text()).itemEnums;

	function wid(n) {
		if (typeof n === 'number') { n += 'px'; }
		return { style: 'width:' + n };
	}

	mod.models = [
	
		{
			id: 'title',
			label: 'Title',
			type: 'Textbox',
			viewAttributes: wid(400)
		},

		{
			id: 'description',
			label: 'Description',
			type: 'Textbox',
			rows: 9,
			viewAttributes: wid(400)
		},

		{
			id: 'dealerInternalNotes',
			label: 'Internal notes',
			type: 'Textbox',
			rows: 2,
			viewAttributes: wid(400)
		},

		{
			id: 'material.description',
			label: 'Materials',
			type: 'Dropdown',
			choices: enums.material,
			viewAttributes: wid(200)
		},

		{
			id: 'material.restricted',
			label: 'Check this box',
			hint: 'if the listing contains or may contain restricted materials',
			type: 'Checkbox'
		},

		{
			id: 'measurement.unit',
			label: 'Measurements are in:',
			type: 'RadioGroupExposed',
			choices: enums.measurement.unit,
			header: {
				label: 'Measurements'
			},
			viewAttributes: { style: "margin: 2.5em 0 -.5em" },
			onChoose: function(value) {
				$('.measurement .input-group-addon').text(value + '.');
			}
		},

		{
			id: 'measurement.shape',
			label: 'Measured item is:',
			type: 'RadioGroup',
			choices: enums.measurement.shape,
			onChoose: function(value) {
				var rect = value === 'rectangular';
				$('.measurement > .form-group').each(function(idx, elt) {
					var $elt = $(elt),
						shape = $elt.data('shape'),
						disabled = (shape !== value),
						$annotation = $elt.find('label, .input-group-addon'),
						$input = $elt.find('input');
					
					$annotation.toggleClass('disabled', disabled);
					$input.prop('disabled', disabled);
				});
			}
		},

		{
			id: 'measurement.length',
			label: 'Length:',
			type: 'TextboxWithAddon',
			data: { shape: 'rectangular' },
			container: '.measurement:first-of-type'
		},

		{
			id: 'measurement.depth',
			label: 'Depth:',
			type: 'TextboxWithAddon',
			data: { shape: 'rectangular' },
			container: '.measurement:first-of-type'
		},

		{
			id: 'measurement.height',
			label: 'Height:',
			type: 'TextboxWithAddon',
			data: { shape: 'rectangular' },
			container: '.measurement:last-of-type'
		},

		{
			id: 'measurement.diameter',
			label: 'Diameter:',
			type: 'TextboxWithAddon',
			data: { shape: 'circular' },
			container: '.measurement:last-of-type'
		},

		{
			id: 'condition.description',
			type: 'RadioGroup',
			choices: enums.condition.description,
			container: 'section:last-of-type',
			header: {
				label: 'Condition',
				hint: '( Select one )',
			}
		}
	];

});