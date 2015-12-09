var dynamicnodemanager = {
	initialize: function(Y) {
		var availableFields = [];
		if (app.dynamicNodes) {
			for (var i = 0; i < app.dynamicNodes.length; i++) {
				var node = app.dynamicNodes[i];
				Y['DiagramNode' + node['id']] = Y.Component.create({
					NAME: 'diagram-node',
					config: node['nodes'],
					ATTRS: {
						type: {
							value: node['id']
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
				Y.DiagramBuilder.types[node['id']] = Y['DiagramNode' + node['id']];
				availableFields.push({
					id: node['id'],
					iconClass: 'diagram-node-' + node['id'] + '-icon',
					label: node['nodeName'],
					type: node['id']
				});
				dnm.addNodeCSSClass(node['id'], node['iconURL']);
			}
		}
		return availableFields;
	},
	addNewNode: function() {
		alert("TODO add new node");
	},
	addNodeCSSClass: function(name, imageURL) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '.diagram-node-' + name + ' .diagram-node-content {background: url(' + imageURL + ') no-repeat scroll center transparent;} .diagram-node-' + name + '-icon {background: url(' + imageURL + ') no-repeat scroll center transparent;}';
		document.getElementsByTagName('head')[0].appendChild(style);
	}
};
var dnm = dynamicnodemanager;