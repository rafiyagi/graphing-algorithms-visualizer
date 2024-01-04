/**
 * RafiLabs
 * Graphing Simulations
 * Comp160 Programming Project
 */


var graphAlgs = {
	
	/**
	 * Generates dense graph viz data
	 */
	getDenseGraph: function(){
		var denseGraph = {
		   nodes:{
		     A:{'color':'silver','shape':'dot','label':'A'},
		     B:{'color':'silver','shape':'dot','label':'B'},
		     C:{'color':'silver','shape':'dot','label':'C'},
		     D:{'color':'silver','shape':'dot','label':'D'},
		     E:{'color':'silver','shape':'dot','label':'E'},
		     F:{'color':'silver','shape':'dot','label':'F'},
		     G:{'color':'silver','shape':'dot','label':'G'},
		     H:{'color':'silver','shape':'dot','label':'G'}
		   }, 
		   edges:{
		     A:{ B:{cost: 13}, C:{cost: 7 }, D:{cost: 22}, E:{cost: 13}, F:{cost: 10}, G:{cost: 21}, H:{cost: 2 } },
		     B:{ A:{cost: 13}, C:{cost: 14}, D:{cost: 7 }, E:{cost: 19}, F:{cost: 5 }, G:{cost: 16}, H:{cost: 27} },
		     C:{ A:{cost: 7 }, B:{cost: 14}, D:{cost: 52}, E:{cost: 43}, F:{cost: 32}, G:{cost: 4 }, H:{cost: 1 } },
		     D:{ A:{cost: 22}, B:{cost: 7 }, C:{cost: 52}, E:{cost: 18}, F:{cost: 19}, G:{cost: 22}, H:{cost: 3 } },
		     E:{ A:{cost: 13}, B:{cost: 19}, C:{cost: 43}, D:{cost: 18}, F:{cost: 31}, G:{cost: 1 }, H:{cost: 7 } },
		     F:{ A:{cost: 10}, B:{cost: 5 }, C:{cost: 32}, D:{cost: 19}, E:{cost: 31}, G:{cost: 21}, H:{cost: 3 } },
		     G:{ A:{cost: 21}, B:{cost: 16}, C:{cost: 4 }, D:{cost: 22}, E:{cost: 1 }, F:{cost: 21}, H:{cost: 11} },
		     H:{ A:{cost: 2 }, B:{cost: 27}, C:{cost: 1 }, D:{cost: 3 }, E:{cost: 7 }, F:{cost: 3 }, G:{cost: 11} }
		   }
		}
		return denseGraph;	
	},

	/**
	 * Generates sparse graph viz data
	 */
	getSparseGraph: function(){
		var sparseGraph = {
		   nodes:{
		     A:{'color':'silver','shape':'dot','label':'A'},
		     B:{'color':'silver','shape':'dot','label':'B'},
		     C:{'color':'silver','shape':'dot','label':'C'},
		     D:{'color':'silver','shape':'dot','label':'D'},
		     E:{'color':'silver','shape':'dot','label':'E'},
		     F:{'color':'silver','shape':'dot','label':'F'},
		     G:{'color':'silver','shape':'dot','label':'G'},
		     H:{'color':'silver','shape':'dot','label':'H'},
		     I:{'color':'silver','shape':'dot','label':'I'}	     
		   }, 
		   edges:{
		     A:{ B:{cost: 4}, H:{cost: 8} },
		     B:{ A:{cost: 4}, C:{cost: 8} },
		     C:{ B:{cost: 8}, D:{cost: 7}, F:{cost: 4}, I:{cost: 2} },
		     D:{ E:{cost: 9}, F:{cost: 14} },
		     E:{ D:{cost: 9}, F:{cost: 10} },
		     F:{ C:{cost: 4}, E:{cost: 10}, G:{cost: 2} },
		     G:{ F:{cost: 2}, H:{cost: 1}, I:{cost:6} },
		     H:{ A:{cost: 8}, G:{cost: 1}, I:{cost: 7} },
		     I:{ C:{cost: 2}, H:{cost: 7}, G:{cost: 6} }
		   }
		};
		return sparseGraph;	
	},
		
		
	/**
	 * Renders the arbor.js graph visualization
	 * @param nodeData object - an object containing node data for the graph to render
	 */
	renderGraphViz: function(nodeData){
		var graph = arbor.ParticleSystem(1000, 400, 0.5) // create the graphtem with sensible repulsion/stiffness/friction
		graph.parameters({gravity:false}) // use center-gravity to make the graph settle nicely (ymmv)
		graph.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by graph...	
		graph.graft(nodeData);
		this.graph = graph;
	},
	
	/**
	 * Render predecessor tree
	 */
	renderPredTree: function(){
		var thisObj = this;
		this.graph.eachNode(
			function(node, pt){
				if(node.data.parent !== null){
					var edge = thisObj.graph.getEdges(node.data.parent, node.name);				
					edge[0].data.color  = "#71C671";
					edge[0].data.weight = 3;
				}
			}
		);
	},	
	
	/**
	 * Resets the graph to original labeling
	 */
	resetGraph: function(){
			var thisObj = this;
			this.graph.eachNode(
				function(node, pt){
					node.data.label = node.name;
					node.data.color = null;
					var nodeEdges = thisObj.graph.getEdgesFrom(node);
					nodeEdges.forEach(function(edge, index, edgeArray){
						edge.data.weight = 1;
						edge.data.color  = null;
					});
				}
			);
			this.graph.renderer.redraw();
	},
	
	/**
	 * Depth First Search (DFS) Algorithm
	 */
	DFS: function(){
		var thisObj = this;
		this.graph.eachNode(
			function(node, pt){
				node.data.color  = "silver";
				node.data.parent = null;
			}
		);	

		var time = {t:0};
		this.graph.eachNode(
			function(node, pt){
				if(node.data.color == "silver"){
					thisObj.DFS_VISIT(node, time);
				}
			}
		)
	},
	
	DFS_VISIT: function(node, time){
		var thisObj = this;
		time.t = time.t + 1;
		node.data.start = time.t;
		node.data.color = "gray";
		
		var adjNodes = this.graph.getEdgesFrom(node);
		adjNodes.forEach(
			function(v, index, adjArray){
				if(v.target.data.color == "silver"){
					v.target.data.parent = node.name;
					thisObj.DFS_VISIT(v.target, time);
				}
			}
		);
		
		node.data.color = "black";
		time.t = time.t + 1;
		node.data.finish = time.t;
		node.data.label  = node.name + ', ' + node.data.start + '/' + node.data.finish + ', ' + node.data.parent;		
	},
	
	/**
	 * Breadth First Search algorithm. The root (or source vertex)
	 * is picked arbitrarily.
	 */
	BFS: function(){
 	var thisObj = this;
		var source;

		this.graph.eachNode(function(node, pt){
			if(source == undefined){
				source = node;
			}
		});
	 	
 	this.graph.eachNode(
 		function(node, pt){
 			if(node !== source){
 				node.data.color    = "silver";
 				node.data.distance = 0;
 				node.data.parent   = null;
 			}
 		}
 	);
 		 	
 	source.data.color    = "gray";
 	source.data.distance = 0;
 	source.data.parent   = null;
 	
 	var adjNodes;
 	var queue  = [];
 	queue.push(source);

 	while(queue.length !== 0){
 			u = queue.shift();	 			
 			adjNodes = thisObj.graph.getEdgesFrom(u);
 			adjNodes.forEach(
 				function(v, index, adjArray){
	 				if(v.target.data.color == "silver"){
		 				v.target.data.color    = "gray";
		 				v.target.data.parent   = u.name;
		 				v.target.data.distance = u.data.distance + 1;
							v.target.data.label    = v.target.name + ', ' + v.target.data.distance + ', ' + v.target.data.parent;		 				
		 				queue.push(v.target);
	 				}
 				}
 			);
 		 u.data.color = "black";
 	}
		source.data.label = source.name + ', ' + source.data.distance + ', ' + source.data.parent; 	
 	source.data.color = "red";
	},
	
	/**
	 * Runs through the BFS step by step
	 */
	BFS_step_by_step: function(s){
 	var thisObj = this;
 	var source  = undefined;
		this.graph.eachNode(function(node, pt){
			if(source == undefined){
				source = node;
			}
		});
	 	
 	this.graph.eachNode(
 		function(node, pt){
 			if(node !== source){
 				node.data.color    = "silver";
 				node.data.distance = 0;
 				node.data.parent   = null;
 			}
 		}
 	);
 		 	
 	source.data.color    = "gray";
 	source.data.distance = 0;
 	source.data.parent   = null;
		source.data.label = source.name + ', ' + source.data.distance + ', ' + source.data.parent; 	
 	
 	var adjNodes;
 	var queue  = [];
 	queue.push(source);
		$('#nextStep').click(
			function(){
		 	if(queue.length != 0){
		 			u = queue.shift();	 			
		 			adjNodes = thisObj.graph.getEdgesFrom(u);
		 			adjNodes.forEach(
		 				function(v, index, adjArray){
			 				if(v.target.data.color == "silver"){
				 				v.target.data.color    = "gray";
				 				v.target.data.parent   = u.name;
				 				v.target.data.distance = u.data.distance + 1;
									v.target.data.label    = v.target.name + ', ' + v.target.data.distance + ', ' + v.target.data.parent;					 				
				 				queue.push(v.target);
			 				}
		 				}
		 			);
		 		 u.data.color = "black";
		 	}else{
			 	source.data.color = "red";
				 thisObj.renderPredTree();
				 $(this).attr('disabled', true);
					$('#runAlg').attr('disabled', false);				 
				 $(this).unbind('click');
		 	}
		 	thisObj.graph.renderer.redraw();
			}
		);
	},
	
	/**
	 * Prim's MST algorithm implemented with a MinHeap.
	 * The root node is picked arbitrarily.
	 */
	Prims: function(){
		var thisObj = this;
		var root    = undefined;

		this.graph.eachNode(function(node, pt){
			if(root == undefined){
				root = node;
			}
		})
		
		
		this.graph.eachNode(
			function(node, pt){
				node.data.key    = 1000;
				node.data.parent = null;
			}
		);
		root.data.key = 0;
		root.data.label = root.name + ', ' + root.data.key + ', ' + root.data.parent;		

		var minQ = new MinHeap(null, function(item1, item2) {
			return item1.data.key == item2.data.key ? 0 : item1.data.key < item2.data.key ? -1 : 1;
		});
	
		this.graph.eachNode(
			function(node, pt){
					minQ.push(node);
			}
		);		
		
		while(minQ.size() > 0){
			var u = minQ.pop();
			var edges = thisObj.graph.getEdgesFrom(u);
			edges.forEach(
				function(edge, index, adjArray){
					var v      = edge.target;
					var vIndex = minQ.exists(v);
					if((vIndex !== false) && (edge.data.cost < v.data.key)){
						v.data.parent = u.name;
						v.data.key    = Number(edge.data.cost);
						v.data.label  = v.name + ', ' + v.data.key + ', ' + v.data.parent;
						minQ.siftUp(vIndex);
					}
				}
			)
		}
		root.data.color = "red";	
	},
	/**
	 * Prim's step by step
	 */
	Prims_step_by_step: function(){
		var thisObj = this;
		var root    = undefined;

		this.graph.eachNode(function(node, pt){
			if(root == undefined){
				root = node;
			}
		})
				
		this.graph.eachNode(
			function(node, pt){
				node.data.key    = 1000;
				node.data.parent = null;
			}
		);
		root.data.key = 0;
		root.data.color = "red";		
		root.data.label = root.name + ', ' + root.data.key + ', ' + root.data.parent;				

		var minQ = new MinHeap(null, function(item1, item2) {
			return item1.data.key == item2.data.key ? 0 : item1.data.key < item2.data.key ? -1 : 1;
		});
	
		this.graph.eachNode(
			function(node, pt){
					minQ.push(node);
			}
		);		
		$('#nextStep').click(
			function(){		
				if(minQ.size() > 0){
					var u = minQ.pop();

					if(u.data.parent !== null){
						var treeEdge = thisObj.graph.getEdges(u.data.parent,u);
						treeEdge[0].data.color  = "green";
						treeEdge[0].data.weight = 3;
					}
					
					var edges = thisObj.graph.getEdgesFrom(u);
					edges.forEach(
						function(edge, index, adjArray){
							var v      = edge.target;
							var vIndex = minQ.exists(v);
							if((vIndex !== false) && (edge.data.cost < v.data.key)){
								v.data.key    = Number(edge.data.cost);
								v.data.parent = u.name;								
								v.data.label  = v.name + ', ' + v.data.key + ', ' + v.data.parent;
								minQ.siftUp(vIndex);
							}
						}
					)
				}else{
				 $(this).attr('disabled', true);
					$('#runAlg').attr('disabled', false);
				 $(this).unbind('click');						
				}
		 	thisObj.graph.renderer.redraw();				
			}
		);
	},
		
	/**
	 * Runs the algorithms and shows results the graph
	 */
	runAlgorithm: function(algorithm){
			var thisObj = this;
			thisObj.resetGraph();
			$('#nextStep').attr('disabled',false)
			switch(algorithm){
				case 'BFS':
					this.stepByStep ? this.BFS_step_by_step() : this.BFS();
					break;
				case 'DFS':
					this.stepByStep ? (function(){ alert("A step by step simulation is currently not available for DFS. Sorry!");$('#runAlg').attr('disabled', false); })() : this.DFS();					
					break;
				case 'Prim\'s':
					this.stepByStep ? this.Prims_step_by_step() : this.Prims();
					break;
			}
			if(!this.stepByStep){
				this.renderPredTree();
				this.graph.renderer.redraw();
			}
	},
	
	/**
	 * Button click listener for graph type (sparse or dense)
	 * radio button
	 */
	initGraphTypeButtonListener: function(){
		var thisObj = this;
		$('.graphType').click(
			function(){
				if($(this).val() == 'sparseGraph'){
					$('#customGraph').hide();
					if(!thisObj.isSparse){
						thisObj.graph.eachNode(
							function(node, pt){
								thisObj.graph.pruneNode(node);
							}
						);
						thisObj.graph.graft(thisObj.getSparseGraph());
						thisObj.isSparse = true;
					}
				}
				
				if($(this).val() == 'denseGraph'){
					$('#customGraph').hide();
					thisObj.graph.merge(thisObj.getDenseGraph());
					thisObj.isSparse = false;
				}
				
				if($(this).val() == 'customGraph'){
					$('#customGraph').show();
					$('#nodeFrom').focus();					
					thisObj.graph.eachNode(function(node, pt){
							thisObj.graph.pruneNode(node);
					})
					thisObj.isSparse = false;
				}
								
		});	
	},
	
	/**
	 * Button click listener for #runAlg button
	 */
	initRunAlgListener: function(){
		var thisObj = this;
		$('#runAlg').click(
			function(){
				if(thisObj.stepByStep){
					$(this).attr('disabled', true);					
				}
				var algorithm   = $('#selectAlgorithm').val();
				if( $('.graphType:checked').val() == 'sparseGraph' ){
					thisObj.runAlgorithm(algorithm);
				}else{
					thisObj.runAlgorithm(algorithm);
				}
			}
		);
	},
	/**
	 * Adds an edge to the graph
	 */
	addEdgeListener: function(){
		var thisObj = this;

		$('#addEdge').click(function(){
			var nodeFrom = $('#nodeFrom').val().toUpperCase();
			var nodeTo   = $('#nodeTo').val().toUpperCase();
			var weight   = $('#edgeWeight').val();
			if(!nodeFrom || !nodeTo || !weight || isNaN(weight)){
				alert('One of the node fields is missing or is not formatted correctly!');
			}else{
				
				if(thisObj.graph.getNode(nodeFrom) == undefined){
					thisObj.graph.addNode(nodeFrom, {'color':'silver','shape':'dot','label':nodeFrom});
				}
				
				if(thisObj.graph.getNode(nodeTo) == undefined){
					thisObj.graph.addNode(nodeTo, {'color':'silver','shape':'dot','label':nodeTo});
				}				
				
				$('#nodeFrom').val('');
				$('#nodeTo').val('');
				$('#edgeWeight').val('');
				$('#nodeFrom').focus();
				
				thisObj.graph.addEdge(nodeFrom, nodeTo, {cost: weight});
				thisObj.graph.addEdge(nodeTo, nodeFrom, {cost: weight});				
				thisObj.graph.renderer.redraw();
			}
		});
	},
	
	/**
	 * @var resultsData Array - global array tracking algorithm runtimes
	 */
	resultsData: [],
	/**
	 * @var isSparse boolean - global var whether current graph being displayed
	 * 																								is sparse or dense
	 */
	isSparse: true,
	/**
	 * Initializes graphs object with graph data and runs
	 * the different algorithm data
	 */
	init: function(){
		var thisObj = this;
		var sparseGraph = this.getSparseGraph();
		
		//Render the sparse graph by default
		this.renderGraphViz(sparseGraph);
		
		//Listener for graph type radio button
		this.initGraphTypeButtonListener();
		
		//Listener for run algorithm button
		this.initRunAlgListener();
		
		//Add edge listener button
		this.addEdgeListener();
		
		//Whether we should run the algorithm step by step or not
		$('#stepByStep').click(function(){
			if($(this).is(':checked')){
				thisObj.stepByStep = true;
				$('#nextStep').show();
			}else{
				thisObj.stepByStep = false;
				$('#nextStep').hide();
			}
		})
 }
};

(function($){
	$(document).ready(function(){
		graphAlgs.init();
	});
})(jQuery);