var application = {
	luncher: function(Y) {
		application.defaultNodeInitializer(Y);
		application.customNodeInitializer(Y);
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
					alert(JSON.stringify(config));					
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
	},
	defaultNodeInitializer: function(Y) {
		Y.DiagramNodeMerge = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'Merge'
                },
                criteria: {
                    validator: Y.Lang.isString,
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeJoin,
            prototype: {
				//CONTROLS_TEMPLATE: '<div id="ddd" class="' + CSS_DB_CONTROLS + '"></div>',
                initializer: function() {
                    var instance = this;
                    
                    this.SERIALIZABLE_ATTRS.push('criteria');
                },
                getPropertyModel: function () {
                    var instance = this;
                    var model = Y.DiagramNodeMerge.superclass.getPropertyModel.apply(instance, arguments);
                        model.splice(0, 1);
                        model.push({ 
                            attributeName: 'criteria', 
                            name: 'Criteria'
                        });
                    return model;
                },
            }
        });

        Y.DiagramNodedataSource_NYT = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'dataSource_NYT'
                },
                dataSource_NYTName: {
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeTask,
            prototype: {
                initializer: function() {
                    var instance = this;
                    this.SERIALIZABLE_ATTRS.push('dataSource_NYTName');
                },
                getPropertyModel: function () {
                    var instance = this;

                    var model = Y.DiagramNodedataSource_NYT.superclass.getPropertyModel.apply(instance, arguments);

                   model.splice(0, 1);
                   model.push({ 
                       attributeName: 'dataSource_NYTName', 
                       name: 'Category',
                       editor:  new Y.DropDownCellEditor({
                           options: {
                               Sports: 'Sports',
                               Business: 'Business',
                               Technology: 'Technology',
                               Science: 'Science',
                               Health: 'Health',
                               World: 'World'
                           }
                       }) 
                   });
                    return model;
                }
            }
        });

        Y.DiagramNodeDataSource_twitter = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'dataSource_twitter'
                },
                dataSource_twitterHashtag: {
                    validator: Y.Lang.isString,
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeTask,
            prototype: {
                initializer: function() {
                    var instance = this;
                    this.SERIALIZABLE_ATTRS.push('dataSource_twitterHashtag');
                },
                getPropertyModel: function () {
                    var instance = this;
                    var model = Y.DiagramNodeDataSource_twitter.superclass.getPropertyModel.apply(instance, arguments);
                        model.splice(0, 1);
                        model.push({
                            attributeName: 'dataSource_twitterHashtag', 
                            name: 'Keywords',
                        });
                    return model;
                }
            }
        });

        Y.DiagramNodeFilter = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'filter'
                },
                filtertype: {
                    value: ''
                },
                filter_criteria: {
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeFork,
            prototype: {
                initializer: function() {
                    var instance = this;
                    this.SERIALIZABLE_ATTRS.push('filtertype');
                    this.SERIALIZABLE_ATTRS.push('filter_criteria');
                },
                getPropertyModel: function () {
                    var instance = this;
                    var model = Y.DiagramNodeFilter.superclass.getPropertyModel.apply(instance, arguments);
                    model.splice(0, 1);
                    model.push({
                        attributeName: 'filtertype',
                        name: 'Filter Type',
                        editor: new Y.DropDownCellEditor({
                            options: {
                            	NYT: 'NYT Filter',
                                tbd: 'tdb'
                            }
                        })
                    });
                    model.push({
                        attributeName: 'filter_criteria', 
                        name: 'Keywords',
                        editor: new Y.TextCellEditor  
                    });

                    return model;
                }
            }
        });

        Y.DiagramNodeAnalytics = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'analytics'
                },
                filtertype: {
                    value: ''
                },
                filter_criteria: {
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeFork,
            prototype: {
                initializer: function() {
                    var instance = this;
                    this.SERIALIZABLE_ATTRS.push('analyticstype');
                    this.SERIALIZABLE_ATTRS.push('analytics_properties');
                },
                getPropertyModel: function () {
                    var instance = this;
                    var model = Y.DiagramNodeFilter.superclass.getPropertyModel.apply(instance, arguments);
                    model.splice(0, 1);
                    model.push({
                        attributeName: 'analyticstype',
                        name: 'Analytics Type',
                        editor: new Y.DropDownCellEditor({
                            options: {
                                Sentiment: 'Sentiment Analysis',
                                NE: 'Named Entity Recognition'
                            }
                        })
                    });
                    model.push({ 
                        attributeName: 'analytics_properties', 
                        name: 'Properties',
                        editor: new Y.TextCellEditor  
                    });
					return model;
                }
            }
        });
        Y.DiagramBuilder.types['analytics'] = Y.DiagramNodeAnalytics;
        Y.DiagramBuilder.types['merge'] = Y.DiagramNodeMerge;
        Y.DiagramBuilder.types['dataSource_NYT'] = Y.DiagramNodedataSource_NYT;
        Y.DiagramBuilder.types['dataSource_twitter'] = Y.DiagramNodeDataSource_twitter;
        Y.DiagramBuilder.types['filter'] = Y.DiagramNodeFilter;
		Y.DiagramBuilder.types['customNode'] = Y.DiagramNodeCustom;
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
	},
	addNewNode: function(){
		alert();
	},
	customNodeInitializer: function(Y) {
		//ToDO initialize customNodes
		Y.DiagramNodeCustom = Y.Component.create({
            NAME: 'diagram-node',
            ATTRS: {
                type: {
                    value: 'customNode'
                },
                criteria: {
                    validator: Y.Lang.isString,
                    value: ''
                }
            },
            EXTENDS: Y.DiagramNodeTask,
            prototype: {
                initializer: function() {
                    var instance = this;
                    this.SERIALIZABLE_ATTRS.push('criteria');
					this.on("click", app.addNewNode, this);
					
                }
            }
        });
	}
};
var app = application;
YUI().use('aui-io-request', 'aui-diagram-builder', 'aui-button', 'aui-form-builder', application.luncher);