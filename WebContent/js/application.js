var application = {
	luncher: function(Y) {
		snm.initialize(Y);
		dnm.initialize(Y);

		var availableFields = [{
            iconClass: 'diagram-node-start-icon',
            label: 'Start',
            type: 'start'
        }, {
            iconClass: 'diagram-node-end-icon',
            label: 'End',
            type: 'end'
        }, {
            iconClass: 'diagram-node-merge-icon',
            label: 'Merge',
            type: 'merge'
        },{
            iconClass: 'diagram-node-analytics-icon',
            label: 'Analytics',
            type: 'analytics'
        },{
            iconClass: 'diagram-node-filter-icon',
            label: 'Filter',
            type: 'filter'
        }, {
            iconClass: 'diagram-node-dataSource_twitter-icon',
            label: 'Twitter',
            type: 'dataSource_twitter'
        }, {
            iconClass: 'diagram-node-dataSource_NYT-icon',
            label: 'NYT',
            type: 'dataSource_NYT'
        }, {
			id: 'customNode',
            iconClass: 'diagram-node-customNode-icon',
            label: 'Custom',
            type: 'customNode'
        }];

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

		Y.one('#availableFields_field_customNode').on(
            'click', 
            function() {
				var config = diagram.toJSON();
				if (config.nodes.length > 0) {
					app.alertMSG(JSON.stringify(config), 'alert-info');					
				} else {
					app.alertMSG('Please make sure the diagram is configured correctly', 'alert-info');
				}
            }
        );
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
		/*
		getDynamicNodeById: function(id) {
		for (var i =0; i < app.dynamicNodes.length; i++) {
			if (id = app.dynamicNodes[i]['id']) {
				return app.dynamicNodes[i];
			}
		}
		*/
		//alert(app.dynamicNodes[1]);
		var node = document.getElementById('availableFields_field_customNode');
		var element = Ext.get('');
		var tip = Ext.create('Ext.tip.ToolTip', {
			target: 'availableFields_field_customNode',
			html: '<div><img src="js/subflow.png" height=300 width=400></div>'
		});
		
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
YUI().use('aui-io-request', 'aui-diagram-builder', 'aui-button', 'aui-form-builder', application.luncher);