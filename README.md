Developed by Rafi Yagudin

The following application simulates the following algorithms: Breadth First Search (BFS), Depth First Search (DFS), 
and Prim's Minimum Spanning Tree (MST). All the graphs in use are undirected and weighted.	You can run the 
application in two modes: instantaneously or step-by-step. 
		
To load up the application, make sure 1) have an internet connection 2) a modern browser that supports HTML5/Web Workers
(I recommend to run this application on the most recent version of Google Chrome or Mozilla FireFox) 3) click on
graphs.html to load the website.
		
All algorithms are coded in JavaScript. You can view the source code in the main.js. 

This application utilizes the arbor.js (http://www.arborjs.org) JavaScript graph visualization library and 
the JavaScript MinHeap.js(http://www.digitaltsunami.net/projects/javascript/minheap/index.html) data structure.

# Graph Explanation:

BFS: At the end of the algorithm, each node contains its name, how far away it is from the source vertex, and its parent.
So a node with a label of "B,1,A" is the Node B that is 1 edge away from the source vertex, and its parent is Node A.
The edges highlighted in green show the BFS tree.

DFS: At the end of the algorithm, each node contains its name, its start/finish time, and its parent.
So a node with a label of "B,2/14,A" is Node B with a start time of 2, a finish time of 14, and its parent is Node A.

Prim's: At the end of the algorithm, each node contains its name, its key (i.e. the cheapest edge connect it to the MST), and its parent.
So a node with a label of "B, 2, A" is Node B with a key of 2, and its parent is Node A.
The edges highlighted in green show the MST.

# Other Notes:

Please use edge weights less than 1000. I initially used Number.MAX_INT for these simulations, but the node labels
become absurdly large and unreadable. If you use weights greater than 1000, then Prim's algorithm will not run correctly.

I had to modify the MinHeap.js slightly and include an exists() function. This is necessary for Prim's algorithm as it tests for
set membership within the min heap for every node it looks at. This is to ensure the MST doesn't form cycles. The exists()
function is not efficient - it does a linear search for the particular node.
