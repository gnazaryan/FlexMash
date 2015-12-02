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
		app.addCustomNodeForm = Ext.create('Ext.form.Panel', {
			border: false,
			defaultType: 'textfield',
			items: [{
				fieldLabel: 'Node Name',
				name: 'nodeName',
				allowBlank: false
			},{
				fieldLabel: 'Icon URL',
				name: 'iconURL',
				allowBlank: false
			}]
		});
		app.addCustomNodeWindow = Ext.create('widget.window', {
			title: 'Add new node',
			closable: true,
			closeAction: 'hide',
			width: 280,
			buttons: [{
				text: 'Reset',
				handler: function() {
					this.up('form').getForm().reset();
				}
			}, {
				text: 'Submit',
				formBind: true,
				handler: function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
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
YUI().use('aui-io-request', 'aui-diagram-builder', 'aui-button', 'aui-form-builder', 'aui-modal', application.luncher);