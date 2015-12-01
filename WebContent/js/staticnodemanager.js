var staticnodemanager = {
	initialize: function(Y) {
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
        Y.DiagramBuilder.types['analytics'] = Y.DiagramNodeAnalytics;
        Y.DiagramBuilder.types['merge'] = Y.DiagramNodeMerge;
        Y.DiagramBuilder.types['dataSource_NYT'] = Y.DiagramNodedataSource_NYT;
        Y.DiagramBuilder.types['dataSource_twitter'] = Y.DiagramNodeDataSource_twitter;
        Y.DiagramBuilder.types['filter'] = Y.DiagramNodeFilter;
		Y.DiagramBuilder.types['customNode'] = Y.DiagramNodeCustom;
	}
};
var snm = staticnodemanager;