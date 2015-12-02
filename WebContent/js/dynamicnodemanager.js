var dynamicnodemanager = {
	initialize: function(Y) {
		var nodes = JSON.parse(localStorage.getItem("customNodes"));
		var availableFields = [];
		if (nodes) {
			for (var i = 0; i < nodes.length; i++) {
				var node = nodes[i];
				Y['DiagramNode' + node['name']] = Y.Component.create({
					NAME: 'diagram-node',
					config: node['nodes'],
					ATTRS: {
						type: {
							value: node['name']
						},
						criteria: {
							validator: Y.Lang.isString,
							value: ''
						}
					},
					EXTENDS: Y.DiagramNodeTask,
					prototype: {
						initializer: function() {
							
						}
					}
				});
				Y.DiagramBuilder.types[node['name']] = Y['DiagramNode' + node['name']];
				availableFields.push({
					iconClass: 'diagram-node-start-icon',
					label: node['name'],
					type: node['name']
				});
			}
		}
		return availableFields;
	},
	addNewNode: function(){
		alert("TODO add new node");
	}
};
var dnm = dynamicnodemanager;