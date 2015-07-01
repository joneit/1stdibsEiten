// Jonathan Eiten - 1stdibs quiz - minimods.js
// Adds simple modularization to Backbone

(function (api) {

	var app = {

		util: {
			// `util.defer`
			// Defined here because it is needed by module() defined herein.
			// Returns a nested object.
			// Given an object and a dot chain in a string such as 'x.y.z', returns obj[x][y][z].
			// If the non-terminal namespaces (e.g., x and y) do not exist, they are created (as empty plain objects).
			// If terminal namespace (e.g., z) does not exist, it is set to `value` if not  or empty plain object if not.
			// If `save` is truthy, overwrites dereferenced property with `value` (and returns it).
			deref: function(obj, dotChain, value, save) {
				var nodes = dotChain.split('.'),
					nodesRemaining = nodes.length;

				if (arguments.length < 3) {
					++nodesRemaining;
				}

				return _(nodes).reduce(function(memo, nodeName) {
					--nodesRemaining;

					if (!(nodeName in memo)) {
						if (nodesRemaining) {
							memo[nodeName] = {};
						} else if (save) {
							memo[nodeName] = value === undefined ? {} : value;
						}
					}

					return memo[nodeName];
				}, obj);
			}
		}

	};

	api.App = {

		// Gather all module getters but don't execute them yet
		module: function(name, get) {
			$(function() {
				var module = app.util.deref(app, name);
				_.extend(module, get(app, module));
			});
		},

		// Execute each module in order, then start the main module
		start: function(main) {
			$(function() {
				main(app);
			});
		}
	};

})(Backbone);
