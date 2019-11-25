var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
      .style({
        'content': 'data(id)'
      })
    .selector('edge')
      .style({
        'curve-style': 'bezier',
        'width': 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
      })
    .selector('.highlighted')
      .style({
        'background-color': 'green',
        'line-color': 'green',
        'target-arrow-color': 'green',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      })
    .selector('.highlighted_red')
      .style({
        'background-color': 'red',
        'line-color': 'red',
        'target-arrow-color': 'red',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }),
    

  elements: {
      nodes: [
        { data: { id: '1'} },
        { data: { id: '2' } },
        { data: { id: '3' } },
        { data: { id: '4' } },
        { data: { id: '5' } }
      ],

      edges: [
        { data: { id: '15', weight: 1, source: '1', target: '5' } },
        { data: { id: '12', weight: 3, source: '1', target: '2' } },
        { data: { id: '25', weight: 4, source: '2', target: '5' } },
        { data: { id: '23', weight: 5, source: '2', target: '3' } },
        { data: { id: '35', weight: 6, source: '3', target: '5' } },
        { data: { id: '34', weight: 2, source: '3', target: '4' } },
        { data: { id: '45', weight: 7, source: '4', target: '5' } }
      ]
    }
});

//bfs
function bfs_demo(curr_vertex,visited,mylist){
  var start_node = vertex[curr_vertex];
  var myqueue = [curr_vertex];
  visited[curr_vertex] = true;
  mylist.push(start_node);
  while(myqueue[0]!=undefined){
    var my_vertex = myqueue.shift();
    for(let i=0;i<edges[my_vertex].length;i++){
      if(!visited[edges[my_vertex][i]]){
        mylist.push(vertex[my_vertex] + vertex[edges[my_vertex][i]])
        visited[edges[my_vertex][i]] = true;
        mylist.push(vertex[edges[my_vertex][i]])
        myqueue.push(edges[my_vertex][i])
      }
    }
  }
}

function bfs(start_vertex){
  var mylist = [];
  var visited = new Array(vertex.length);
  for (var i = 0;i < vertex.length ; i++) visited[i] = false;
  bfs_demo(start_vertex,visited,mylist);
  for(var i =0 ; i<vertex.length;i++){
    if(!visited[i]){
      bfs_demo(i,visited,mylist);
    }
  }
  return mylist;
}


//dfs
function dfs_demo(start_vertex,visited,mylist,backedge,previous){
  if(visited[start_vertex]){
    return;
  }
  var start_node = vertex[start_vertex];
  mylist.push(start_node);
  backedge.push(false);
  visited[start_vertex] = true;
  for(var i=0;i<edges[start_vertex].length;i++){
    if(!visited[edges[start_vertex][i]]){
      mylist.push(start_node + vertex[edges[start_vertex][i]]);
      backedge.push(false);
      dfs_demo(edges[start_vertex][i],visited,mylist,backedge,start_vertex);
    }
    else if( edges[start_vertex][i] != previous ){
      mylist.push(start_node + vertex[edges[start_vertex][i]]);
      backedge.push(true);
    }
  }
}

function dfs(start_vertex){
  var mylist = [];
  var backedge = [];
  var visited = new Array(vertex.length);
  for (var i = 0;i < vertex.length ; i++) visited[i] = false;
  dfs_demo(start_vertex,visited,mylist,backedge,undefined);
  for(var i =0 ; i<vertex.length;i++){
    if(!visited[i]){
      dfs_demo(i,visited,mylist,backedge,undefined);
    }
  }
  return {a:mylist,b:backedge};
}

let i=0;
function animation(mylist){
  console.log(mylist);
  if (i<mylist.length) {
    cy.getElementById(mylist[i]).addClass("highlighted");
    cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted");
    i++;
    setTimeout(() => animation(mylist),1200);
  }
}

function animation2(mylist,backedge){
  if (i<mylist.length) {
    if(!backedge[i]){
      cy.getElementById(mylist[i]).addClass("highlighted");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted");
    }
    else{
      cy.getElementById(mylist[i]).addClass("highlighted_red");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_red");
    }
    i++;
    setTimeout(() => animation2(mylist,backedge),800);
  }
}


//bfs animation

function bfs_animation(start_vertex) {
  i = 0;
  mylist = bfs(start_vertex);
  animation(mylist);
}


//dfs animation

function dfs_animation(start_vertex){
  i = 0;
  var list = dfs(start_vertex);
  mylist = list.a;
  backedge = list.b;
  console.log(mylist);
  animation2(mylist,backedge);
}



//main
var vertex = ['a','b','c','d','e'];
var edges = [[4,1],[0,4,2],[1,4,3],[2,4],[0,1,2,3]];
//dfs_animation(0);
bfs_animation(0);

i = 0;

