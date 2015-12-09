var application = {
	luncher: function(Y) {

		var availableFields = snm.initialize(Y).concat(dnm.initialize(Y));

        diagram = new Y.DiagramBuilder({
            availableFields: availableFields,
            boundingBox: '#myDiagramContainer',
            fields: [
              /*{
                name: 'Start',
                type: 'start',
                xy: [20, 250]
              },
              {
                name: 'NYT',
                type: 'dataSource_NYT',
                xy: [220, 100]
              },
              {
                name: 'Twitter',
                type: 'dataSource_twitter',
                xy: [220, 400]
              },
              {
                name: 'Filter',
                type: 'filter',
                xy: [520, 100]
              },
              {
                name: 'Analytics',
                type: 'analytics',
                xy: [520, 400]
              },
              {
                name: 'Merge',
                type: 'merge',
                xy: [720, 250]
              },
              {
                name: 'End',
                type: 'end',
                xy: [1020, 260]
              }*/
            ],
            srcNode: '#myDiagramBuilder'
        }).render();
		app.diagramBuilder = diagram;
		
        /*diagram.connectAll(
          [
            {
              connector: {
                name: ''
              },
              source: 'Start',
              target: 'NYT'
            },
            {
              connector: {
                name: ''
              },
              source: 'NYT',
              target: 'Filter'
            },
            {
              connector: {
                name: ''
              },
              source: 'Twitter',
              target: 'Analytics'
            },
            {
              connector: {
                name: ''
              },
              source: 'Filter',
              target: 'Twitter'
            },
            {
              connector: {
                name: ''
              },
              source: 'Analytics',
              target: 'Merge'
            },
            {
              connector: {
                name: ''
              },
              source: 'Merge',
              target: 'End'
            }
          ]
        );*/
        
        /*
        Y.one('#getButton').on(
            'click', 

            function() {
                jsonGetString = JSON.stringify(diagram.toJSON());
                jsonGetString = jsonGetString.substring(0, jsonGetString.length - 1);
                jsonGetString = jsonGetString + ",\"wrapper\":\"true\"}"
                Y.io.request(
                    'http://localhost:8080/Data_Mashup/DataMashup',
                    {
                    	method: 'POST',
                        data: jsonGetString,
                        on: {
                            success: function() {
                                var data = this.get('responseData');
                                alert(data);
                            },
                            failure: function() {
                                alert('failure');
                            }
                        }
                    }
                );
            }
        );
		*/

		
		app.nodeTypesStore = Ext.create('Ext.data.Store', {
			fields: ['key', 'name'],
			data : [
				{"key":"source", "name":"Source"},
				{"key":"subflow", "name":"Subflow"}
			]
		});

		app.nodeTypesCombo = Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Node Types',
			name: 'nodeType',
			store: app.nodeTypesStore,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'key',
			value: 'subflow',
			editable: false,
			listeners: {
				select: function(combo, records, eOpts) {
					if (records.get('key') == 'source') {
						app.sourceURLField.setDisabled(false);
						app.sourceURLField.setVisible(true);
					} else {
						app.sourceURLField.setDisabled(true);
						app.sourceURLField.setVisible(false);
					}
				}
			}
		});

		app.sourceURLField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Source URL',
				name: 'sourceURL',
				allowBlank: false,
				disabled: true,
				hidden: true
		});

		app.iconURLField = Ext.create('Ext.form.field.Text', {
				fieldLabel: 'Icon URL',
				name: 'iconURL',
				value: 'https://cdn0.iconfinder.com/data/icons/robots-expression/512/Robot_18-24.png',
				allowBlank: false
		});

		app.addCustomNodeForm = Ext.create('Ext.form.Panel', {
			border: false,
			defaultType: 'textfield',
			items: [app.nodeTypesCombo, {
				fieldLabel: 'Node Name',
				name: 'nodeName',
				allowBlank: false
			}, app.iconURLField,
			app.sourceURLField]
		});

		app.addCustomNodeWindow = Ext.create('widget.window', {
			title: 'Add new node',
			closable: true,
			closeAction: 'hide',
			width: 280,
			buttons: [{
				text: 'Submit',
				formBind: true,
				handler: function() {
					var diagramNodes = diagram.toJSON();
					diagramNodes = diagramNodes.nodes ? diagramNodes.nodes : [];
					var values = app.addCustomNodeForm.getValues();
					if (((diagramNodes.length > 0 && values['nodeType'] == 'subflow') || values['nodeType'] == 'source') && app.addCustomNodeForm.isValid()) {
						values['id'] = values['nodeName'].replace(/\s/g, '') + Math.floor((Math.random() * 10000000) + 1);
						values['nodes'] = diagramNodes;
						app.dynamicNodes.push(values);
						storage.lastRevision.info = app.dynamicNodes;
						storage.db.put(storage.lastRevision).then(
							function (response) {
								location.reload();
							}).catch(function (err) {
								location.reload();
							}
						);
						//app.addDynamicField(Y, values);
					} else {
						app.alertMSG('Please configure the Diagram first');
					}
				}
			}],
			height: 200,
			items: [app.addCustomNodeForm]
		});
		app.customNode = Ext.get('availableFields_field_customNode');
		app.diagram = document.getElementsByClassName("property-builder-canvas")[0];
		if (app.diagram == null) {
			alert('Check the code inside application.js app.diagram = document.getElementsByClassName("property-builder-canvas")[0];, app.diagram must not be null');
		} else {
			app.diagram.firstChild.style.overflow = 'hidden';
		}
		app.customNode.addListener('click', 
			function() {
				app.addCustomNodeWindow.show();
			}
		);

			
		app.removeNodeContextAction = Ext.create('Ext.Action', {
			text: 'Remove',
			icon: 'https://cdn3.iconfinder.com/data/icons/sympletts-free-sampler/128/circle-close-20.png',
			handler: function(widget, event) {
				app.removeNodeContextMenu.nodeToRemoveId;
				debugger;
				for (var i = 0; i < app.dynamicNodes.length; i++) {
					var node = app.dynamicNodes[i];
					if (node['id'] == app.removeNodeContextMenu.nodeToRemoveId) {
						app.dynamicNodes.splice(i, 1);
						break;
					}
				}
				storage.lastRevision.info = app.dynamicNodes;
				storage.db.put(storage.lastRevision).then(
					function (response) {
						location.reload();debugger;
					}).catch(function (err) {
						location.reload();debugger;
					}
				);
				return false;
			}
		});

		app.removeNodeContextMenu = Ext.create('Ext.menu.Menu', {
			items: [
				app.removeNodeContextAction
			]
		});

		if (app.dynamicNodes) {
			for (var i = 0; i < app.dynamicNodes.length; i++) {
				var node = app.dynamicNodes[i];
				var nodeElement = Ext.get('availableFields_field_' + node['id']);
				nodeElement.addListener('click',
					function(e, t, eOpts) {
						var dom = e.target.parentElement;
						var id = dom.id.substring(22, dom.id.length);debugger;
						var nodes = app.getDynamicNodeById(id).nodes;
						for (var i = 0; i < nodes.length; i++) {
							app.diagramBuilder.addField(nodes[i]);
						}
					}
				);
				nodeElement.on("contextmenu",function(event, element){
					event.stopEvent();
					app.removeNodeContextMenu.nodeToRemoveId = node['id'] + '';
					app.removeNodeContextMenu.showAt(event.getXY());
					return false;
				})
			}
		}
		/*Y.one('#availableFields_field_customNode').on(
            'click',
            function() {
				app.addCustomNodeWindow.showAt(100, 300);
            }
        );*/
        Y.one('#postButton').on(
            'click', 
            function() {
				document.getElementById("alertDiv").hidden = true;
				document.getElementById("alertDiv2").hidden = true;

            	jsonPostString = JSON.stringify(diagram.toJSON());
            	var dropDownMenu = document.getElementById("selectPattern");
            	var dropDownLength = dropDownMenu.length;
            	var selectedPattern = "";

            	for (var i = 0; i < dropDownLength; i++) {
            		if (dropDownMenu[i].selected == true) {
            			selectedPattern = dropDownMenu[i].value;
            		}
            	}

                Y.io.request(
                    'http://localhost:8080/Data_Mashup/DataMashup',
                    {
                        method: 'POST',
                        data: {flow: jsonPostString, pattern: selectedPattern},
                        on: {
                            success: function(msg) {
                                var data = this.get('responseData');
                                if(data.indexOf("timeCritical" != -1)) {
                                	//<div class="alert alert-success">
                                	//  <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                	//  <strong>Success!</strong> Indicates a successful or positive action.
                                	//</div>
									document.getElementById("alertDiv").hidden = false;
                                } else if (data.indexOf("robust" != -1)) {
									document.getElementById("alertDiv2").hidden = false;
                                }
                            },
                            failure: function() {
                                alert('An error ocurred, please check your model.');
                            }
                        }
                    }
                );
            }
        );
	},
	getDynamicNodeById: function(id) {
		for (var i =0; i < app.dynamicNodes.length; i++) {
			if (id = app.dynamicNodes[i]['id']) {
				return app.dynamicNodes[i];
			}
		}
	},
	alertMSG: function(content, type) {
		if (!type) {
			type = 'alert-warning';
		}
		YUI().use(
		  'aui-alert',
		  function(Y) {
			new Y.Alert(
			  {
				animated: true,
				bodyContent: content,
				boundingBox: '#myAlert',
				closeable: true,
				cssClass: type,
				destroyOnHide: false,
				duration: 1,
				render: true
			  }
			);
		  }
		);
	}
};
var app = application;
YUI().use('aui-io-request', 'aui-diagram-builder', 'aui-button', 'aui-form-builder', 'aui-modal', storage.initializeData);