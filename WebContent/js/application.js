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

		app.savedTempletesStore = Ext.create('Ext.data.Store', {
			fields: ['value', 'name'],
			data: storage.lastRevision.templetes
		});

		app.savedTempletes = Ext.create('Ext.form.ComboBox', {
			fieldLabel: 'Saved Templates',
			editable: false,
			store: app.savedTempletesStore,
			renderTo: 'savedTemplates',
			queryMode: 'local',
			displayField: 'name',
			labelWidth: 150,
			valueField: 'value',
			listeners: {
				select: function( combo, record, eOpts ) {
					var nodes = Ext.decode(record.get('value'));
					for (var i = 0; i < nodes.length; i++) {
						app.diagramBuilder.addField(nodes[i]);
					}
				}
			}
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
						location.reload();  //debugger;
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
			//loop through dynamic nodes
			for (var i = 0; i < app.dynamicNodes.length; i++) {
					var strTable="<div><table border=1>";
					var node = app.dynamicNodes[i];
					debugger;
					//check for subflows
					if (node.nodeType == 'subflow') {
						//table of the tooltip
						strTable=strTable + "<tr>Sub Flow Information:</tr>";
						for (var strNode in node){
									if(strNode!='nodes'){
									strTable=strTable+"<tr bgcolor='#81DAF5'><td>" + strNode +":</td><td>"+ node[strNode]+"</td></tr>";
								}
								//loop through the sub nodes
								else{
									for(var j=0 ; j<node.nodes.length;j++){
										var objNodes=node.nodes[j];
										var strNodesName, strNodesValue ;
										for(strNodesName in objNodes){
											//check connections or transitions
											if(strNodesName=='transitions'){
												var objTrans=node.nodes[j].transitions;
												var objTransNodes;
												strTable=strTable+"<tr bgcolor='#F6E3CE'><td >" + strNodesName +":</td><td>";
												//loop through the connections of the node
												for(var k=0 ; k<objTrans.length; k++){
													objTransNodes=objTrans[k];
													var strTransName, strTransValue ;
													for(strTransName in objTransNodes){
														if(strTransName=='target'){
															strTransValue = objTransNodes[strTransName] ;
															strTable=strTable + strTransValue+"</td></tr>";
														}
													}
													strTable=strTable +"</td></tr>";
												}
											}
											else{
												strNodesValue = objNodes[strNodesName] ;
												strTable=strTable+"<tr bgcolor='#F6E3CE'><td >" + strNodesName +":</td><td>"+ strNodesValue+"</td></tr>";
											}
										}
									strTable=strTable+"<tr bgcolor='#FE2E2E'><td>  </td><td>  </td></tr>";
									}
								}
						}					
						
						strTable=strTable+"<img src='"+node.iconURL+"'></table></div>";
						strTable=strTable+"</table></div>";		
						//the tip
						var tip = Ext.create('Ext.tip.ToolTip', {
						target: ('availableFields_field_' + node.id),
						dismissDelay: 0,
						html:strTable
						});
					}
				
				var nodeElement = Ext.get('availableFields_field_' + node['id']);
				nodeElement.addListener('click',
					function(e, t, eOpts) {
						/*var dom = e.target.parentElement;
						var id = dom.id.substring(22, dom.id.length);  //debugger;
						var nodes = app.getDynamicNodeById(id).nodes;
						for (var i = 0; i < nodes.length; i++) {
							app.diagramBuilder.addField(nodes[i]);
						}*/
					}
				);
				nodeElement.dom.setAttribute('name', (node['id'] + ''));
				nodeElement.on("contextmenu", function(event, element) {
					event.stopEvent();debugger;
					var id = element.getAttribute('name');
					app.removeNodeContextMenu.nodeToRemoveId = id; 
					app.removeNodeContextMenu.showAt(event.getXY());
					return false;
				});
			}
		}
		
		app.patternGridPanel = Ext.create('Ext.grid.Panel', {
			title: 'Patterns',
			store: Ext.create('Ext.data.Store', {
				fields:['name', 'id'],
				data:{'items':[
					{ 'name': 'Time-Critical', 'description':'Description goes here', "id":"timeCritical"},
					{ 'name': 'Robust', 'description':'Robust execution engine', "id":"robust"},
					{ 'name': 'Secure (tbd)', 'description':'Description goes here', "id":"tradeOff"},
					{ 'name': 'Big Data (tbd)', 'description':'Description goes here', "id":"bigData"}
				]},
				proxy: {
					type: 'memory',
					reader: {
						type: 'json',
						root: 'items'
					}
				}
			}),
			listeners: {
				select: function(grid, record, index, eOpts) {
					var patternId = record.get('id');
					Ext.Ajax.request({
						url: ('patterns/' + patternId + '.html'),
						success: function(response) {
							app.patternDetailPanel.update(response.responseText);
						},
						failure: function(response) {
							app.patternDetailPanel.update('The selected pattern dows not have a detailed description');
						}
					});
				}
			},
			columns: [
				{ text: 'Name',  dataIndex: 'name' },
				{ text: 'Description',  dataIndex: 'description', flex: 1}
			]
		});
		app.patternDetailPanel = Ext.create('Ext.panel.Panel', {
			region: 'center',
			title: 'Pattern Details',
			html: 'Please select a pattern from the left panel',
			split: true,
			autoScroll: true
		});
		app.patternSelectionViewPort = Ext.create('Ext.panel.Panel', {
			layout: 'border',
			items: [{
				region: 'west',
				collapsible: true,
				title: 'Navigation',
				width: 250,
				items: app.patternGridPanel
				// could use a TreePanel or AccordionLayout for navigational items
			}, app.patternDetailPanel]
		});
		app.patternSelectionWindow = Ext.create('Ext.window.Window', {
			title: 'Pattern Selection',
			height: 530,
			width: 800,
			layout: 'fit',
			items: app.patternSelectionViewPort
		});
		Y.one('#patterSelection').on(
            'click',
            function() {
				app.patternSelectionWindow.show();
            }
        );
		Y.one('#removeTempleteButton').on(
            'click', 
            function() {
				var selection = app.savedTempletes.getSelection();
				if (selection != null) {
					app.savedTempletesStore.remove(selection);
					app.savedTempletes.setSelection(null);
					storage.lastRevision.templetes = Ext.pluck(app.savedTempletesStore.data.items, 'data');
					storage.db.put(storage.lastRevision).then(
						function (response) {
							app.savedTempletesStore.add({
								name: text,
								id: id,
								value: diagramNodes
							});
						}).catch(function (err) {
							
						}
					);
				}
			}
		);
		Y.one('#saveTempleteButton').on(
            'click', 
            function() {
				var diagramNodes = diagram.toJSON();
				diagramNodes = diagramNodes.nodes ? diagramNodes.nodes : [];
				if (diagramNodes.length > 0) {
					Ext.Msg.prompt('Templete Name', 'Please enter name for templete:', function(btn, text){
						if (btn == 'ok' && text != ''){
							if (storage.lastRevision.templetes == null) {
								storage.lastRevision.templetes = [];
							}
							diagramNodes = Ext.encode(diagramNodes);
							var id = (new Date()).getTime(); 
							storage.lastRevision.templetes.push({
								name: text,
								id: id,
								value: diagramNodes
							});
							storage.db.put(storage.lastRevision).then(
								function (response) {
									app.savedTempletesStore.add({
										name: text,
										id: id,
										value: diagramNodes
									});
								}).catch(function (err) {
									
								}
							);
						}
					});
				} else {
					app.alertMSG('Please configure the Diagram first');
				}
            }
        );
		Y.one('#patterSelection').on(
            'click',
            function() {
				app.patternSelectionWindow.show();
            }
        );
        Y.one('#postButton').on(
            'click', 
            function() {alert();
				var values = diagram.toJSON();
				var inQuery = '';
				var inQuery1 = '';
				if (values.nodes) {
					var nodes = values.nodes;
					for (var i = 0; i < nodes.length;i++) {
						var node = nodes[i];
						if (node.type == 'dataSource_googleplus') {
							inQuery = node.dataSource_googleplusKey;
						}
						if (node.type == 'dataSource_facebook') {
							inQuery1 = node.dataSource_facebookKey;
						}
					}
				}
				var url = '/Data_Mashup/DataMock?inQuery=' + (inQuery + '&inQuery1=' + inQuery1);
				Ext.create('Ext.window.Window', {
					title: 'Result',
					height: 400,
					width: 600,
					layout: 'fit',
					items: Ext.create('Ext.grid.Panel', {
						 store: Ext.create('Ext.data.Store', {
							fields: ['id', 'lastName', 'firstName', 'link'],
							autoLoad: true,
							proxy: {
								type: 'ajax',
								url: url,
								reader: {
									type: 'json'
								}
							 },
							autoLoad: true
						 }),
						columns: [
							{ text: 'ID',  dataIndex: 'id' },
							{ text: 'Last Name', dataIndex: 'lastName'},
							{ text: 'First Name', dataIndex: 'firstName' },
							{ text: 'Link', dataIndex: 'link', flex: 1, 
								renderer: function(value, metaData, record, row, col, store, gridView) {
									return '<a href="' + value + '" target="_blank"><img border="0" alt="W3Schools" src="' + ((value.indexOf('google') > 0)? 'https://cdn3.iconfinder.com/data/icons/free-social-icons/67/google_circle_color-24.png': 'https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-24.png') + '" width="24" height="24"></a>';
								}
							}
						]
					})
				}).show();
				/*
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
                );*/
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