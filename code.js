//speed controller
document.getElementById("speedControlRange").onchange = function(){
  speed = 1600 - document.getElementById("speedControlRange").value;
} 


//input
document.getElementById("Submit").onclick = function(){
  let formData = {};
  formData.noOfEdges = document.getElementById("NumofEdges").value;
  formData.noofVertices = document.getElementById("NumofVertices").value;
  formData.edges = [];
  edge_tuple = [];
  edges_no = formData.noOfEdges*2;
  cy.elements().remove();

  edges = [];
  for(var i=0;i<formData.noofVertices;i++){
    edges.push([]);
  }

  document.querySelectorAll('.edge-row').forEach((el) => {
    let inpList = el.querySelectorAll('input');
    formData.edges.push({
      source: inpList[0].value,
      target: inpList[1].value,
      weight: inpList[2].value,
      id : inpList[0].value + "-" + inpList[1].value
    });
    edges[inpList[0].value-1].push(inpList[1].value-1);
    edges[inpList[1].value-1].push(inpList[0].value-1);
    edge_tuple.push([inpList[0].value-1,inpList[1].value-1,inpList[2].value]);
  })
  vertex = [];

  var element = [];
  
  for (var i=1;i<=formData.noofVertices;i++){
    element.push({data: {id: i.toString()}});
    vertex.push(i.toString());
  }
  
  for (var i=0;i<formData.noOfEdges;i++){
    element.push({ data: formData.edges[i] });
  }
  
  cy.add(element);
  cy.layout({name: 'cose'}).run();
  console.log('vertex',vertex);
  console.log('edges',edges);
}

document.getElementById("View").onclick = function(){
  var garganimation = document.getElementById("AnimationType").value;
  start = document.getElementById("Start-Vertex").value - 1;
  if(start===-1) start = 0;
  clearTimeout(timer);
  cy.elements().removeClass("highlighted");
  cy.elements().removeClass("highlighted_red");
  cy.elements().removeClass("highlighted_orange");
  cy.elements().removeClass("highlighted_blue");
  cy.elements().removeClass("highlighted_notpartoftree");
  if(garganimation === "Breadth first search"){
    bfs_animation(start);
  }
  else if(garganimation === "Depth-first search"){
    dfs_animation(start);
  }
  else{
    mst();
  }
}
var cy = cytoscape({
  container: document.getElementById('cy'),
  boxSelectionEnabled: false,
  autounselectify: true,
  zoomingEnabled: true,
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
        'target-arrow-color': '#ddd',
        'content': 'data(weight)'
      })
    .selector('.highlighted')
      .style({
        'background-color': '#ff9800',
        'line-color': '#ff9800',
        'target-arrow-color': '#ff9800',
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
      })
    .selector('.highlighted_orange')
      .style({
        'background-color': 'green',
        'line-color': 'green',
        'target-arrow-color': 'green',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      })
    .selector('.highlighted_blue')
      .style({
        'background-color': 'blue',
        'line-color': 'blue',
        'target-arrow-color': 'blue',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      })
    .selector('.highlighted_notpartoftree')
      .style({
        'background-color': '#ce93d8',
        'line-color': '#ce93d8',
        'target-arrow-color': '#ce93d8',
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
        { data: { id: '1-5', weight: 1, source: '1', target: '5' } },
        { data: { id: '1-2', weight: 3, source: '1', target: '2' } },
        { data: { id: '2-5', weight: 4, source: '2', target: '5' } },
        { data: { id: '2-3', weight: 5, source: '2', target: '3' } },
        { data: { id: '3-5', weight: 6, source: '3', target: '5' } },
        { data: { id: '3-4', weight: 2, source: '3', target: '4' } },
        { data: { id: '4-5', weight: 7, source: '4', target: '5' } }
      ]
    }

});

cy.layout({name: 'breadthfirst'}).run();
if(screen.width < 500){
  cy.pan({
    x: 50,
    y: 60
  });
}
else{
  cy.pan({
    x:50,
    y:-50
  });
}

cy.panningEnabled(false);
// cy.userPanningEnable(false);
//bfs
function bfs_demo(curr_vertex,visited,mylist,current){
  var start_node = vertex[curr_vertex];
  var myqueue = [curr_vertex];
  visited[curr_vertex] = true;
  while(myqueue[0]!=undefined){
    var my_vertex = myqueue.shift();
    mylist.push(vertex[my_vertex]);
    current.push(true);
    for(let i=0;i<edges[my_vertex].length;i++){
      if(!visited[edges[my_vertex][i]]){
        mylist.push(vertex[my_vertex] + "-"+ vertex[edges[my_vertex][i]]);
        current.push("edge");
        visited[edges[my_vertex][i]] = true;
        mylist.push(vertex[edges[my_vertex][i]]);
        current.push(false);
        myqueue.push(edges[my_vertex][i]);
      }
    }
    mylist.push(vertex[my_vertex]);
    current.push(2);
  }
  
}

function bfs(start_vertex){
  var mylist = [];
  var current = [];
  var visited = new Array(vertex.length);
  for (var i = 0;i < vertex.length ; i++) visited[i] = false;
  bfs_demo(start_vertex,visited,mylist,current);
  for(var i =0 ; i<vertex.length;i++){
    if(!visited[i]){
      bfs_demo(i,visited,mylist,current);
    }
  }
  return [mylist,current];
}


//dfs
function dfs_demo(start_vertex,visited,mylist,backedge,previous,current){
  if(visited[start_vertex]){
    return;
  }
  var start_node = vertex[start_vertex];
  visited[start_vertex] = true;
  for(var i=0;i<edges[start_vertex].length;i++){
    mylist.push(start_node);
    current.push(true);
    backedge.push(false);
    if(!visited[edges[start_vertex][i]]){

      mylist.push(start_node + '-' + vertex[edges[start_vertex][i]]);
      current.push(false);
      backedge.push(false);

      mylist.push(start_node);
      current.push(false);
      backedge.push(false);

      dfs_demo(edges[start_vertex][i],visited,mylist,backedge,start_vertex,current);

      mylist.push(start_node + '-' + vertex[edges[start_vertex][i]]);
      current.push(2);
      backedge.push(false);
    }
    else if( edges[start_vertex][i] != previous ){
      mylist.push(start_node + '-' + vertex[edges[start_vertex][i]]);
      backedge.push(true);
      current.push(false);
    }
  }

  mylist.push(start_node);
  current.push(2);
  backedge.push(false);
}

function dfs(start_vertex){
  var mylist = [];
  var backedge = [];
  var current = [];
  var visited = new Array(vertex.length);
  for (var i = 0;i < vertex.length ; i++) visited[i] = false;
  dfs_demo(start_vertex,visited,mylist,backedge,undefined,current);
  for(var i =0 ; i<vertex.length;i++){
    if(!visited[i]){
      dfs_demo(i,visited,mylist,backedge,undefined,current);
    }
  }
  return {a:mylist,b:backedge,c:current};
}

let i=0;
let speed = 800;
function animation(mylist,current){
  if (i<mylist.length) {
    if(current[i] === "edge"){
      cy.getElementById(mylist[i]).removeClass("highlighted");
      cy.getElementById(mylist[i]).removeClass("highlighted_red");
      cy.getElementById(mylist[i]).addClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_orange");
      
    }
    else if(current[i] === 2){
      cy.getElementById(mylist[i]).removeClass("highlighted");
      cy.getElementById(mylist[i]).removeClass("highlighted_red");
      cy.getElementById(mylist[i]).addClass("highlighted_orange");
    }
    else if(current[i]){
      cy.getElementById(mylist[i]).removeClass("highlighted");
      cy.getElementById(mylist[i]).removeClass("highlighted_orange");
      cy.getElementById(mylist[i]).addClass("highlighted_red");
    }
    else{
      cy.getElementById(mylist[i]).removeClass("highlighted_red");
      cy.getElementById(mylist[i]).removeClass("highlighted_orange");
      cy.getElementById(mylist[i]).addClass("highlighted");
    }
    i++;
    timer = setTimeout(() => animation(mylist,current),speed);
  }
}

let timer;

function animation2(mylist,backedge,current){
  if (i<mylist.length) {

    if(backedge[i]){
      cy.getElementById(mylist[i]).addClass("highlighted_blue");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_blue");
    }

    else if(current[i]===true){
      cy.getElementById(mylist[i]).removeClass("highlighted");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted");
      cy.getElementById(mylist[i]).removeClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_orange");
      cy.getElementById(mylist[i]).addClass("highlighted_red");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_red");
    }
    
    else if(current[i] === 2){
      cy.getElementById(mylist[i]).removeClass("highlighted");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted");
      cy.getElementById(mylist[i]).removeClass("highlighted_red");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_red");
      cy.getElementById(mylist[i]).addClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_orange");
    }

    else{
      cy.getElementById(mylist[i]).removeClass("highlighted_red");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_red");
      cy.getElementById(mylist[i]).removeClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_orange");
      cy.getElementById(mylist[i]).addClass("highlighted");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted");
    }

    i++;
    timer = setTimeout(() => animation2(mylist,backedge,current),speed);
  }
}

function animation3(mylist,type){
  if(i<mylist.length){
    if(type[i]===1){
      cy.getElementById(mylist[i]).removeClass("highlighted_notpartoftree");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_notpartoftree");
      cy.getElementById(mylist[i]).addClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_orange");
    }
    else{
      cy.getElementById(mylist[i]).removeClass("highlighted_orange");
      cy.getElementById(mylist[i].split('').reverse().join("")).removeClass("highlighted_orange");
      cy.getElementById(mylist[i]).addClass("highlighted_notpartoftree");
      cy.getElementById(mylist[i].split('').reverse().join("")).addClass("highlighted_notpartoftree");
    }
    i++;
    timer = setTimeout(() => animation3(mylist,type),speed);
  }
}
//bfs animation
function bfs_animation(start_vertex) {
  i = 0;
  [mylist,current] = bfs(start_vertex);
  // console.log("mylist",mylist);
  // console.log("current",current);
  animation(mylist,current);
}


//dfs animation
function dfs_animation(start_vertex){
  i = 0;
  var list = dfs(start_vertex);
  var mylist = list.a;
  var backedge = list.b;
  var current = list.c;
  console.log("mylist",mylist);
  console.log("current",current);
  console.log(backedge);
  animation2(mylist,backedge,current);
}


//minimum spanning tree
function mst(){
  i = 0;
  [mylist,type] = Kruskels();
  console.log("mylist",mylist);
  console.log("type",type);
  animation3(mylist,type);
}

//main
var vertex = ['1','2','3','4','5'];
var edges = [[4,1],[0,4,2],[1,4,3],[2,4],[0,1,2,3]];
var start = 0;
var edge_tuple = [[0,4,1],[0,1,3],[1,4,4],[1,2,5],[2,4,6],[2,3,2],[3,4,7]];
var edges_no = 7;
i = 0;


function Sort(sub){ 
    let l = sub.length 
    for(let i=0;i<l;i++){ 
        for(let j=0;j<l-i-1;j++){ 
            if (sub[j][2] > sub[j + 1][2]){ 
                var tempo = sub[j] 
                sub[j]= sub[j + 1] 
                sub[j + 1]= tempo
            }
        }
    } 
    return sub 
}
//minimum spanning tree
function Kruskels() {
  var mylist = [];
  edge_tuple = Sort(edge_tuple);
  var type = [];
  var myedgelist = [];
  for(var i = 0;i < edge_tuple.length ;i++){
    myedgelist.push(edge_tuple[i]);
    mylist.push((edge_tuple[i][0]+1).toString());
    if(iscycle(myedgelist)==0){
      type.push(1);
      type.push(1);
      type.push(1);
    }
    else{
      myedgelist.pop();
      type.push(1);
      type.push(0);
      type.push(1);
    }
    mylist.push((edge_tuple[i][0]+1) + "-" + (edge_tuple[i][1]+1));
    mylist.push((edge_tuple[i][1]+1).toString());
  }
  return [mylist,type];
}

function iscycle(edge_tuple){
  
  var parent = []
  for (var i=0;i<vertex.length;i++){
    parent.push(-1);
  }
  for (var i=0;i<edge_tuple.length;++i){
    let x = find(parent,edge_tuple[i][0]);
    let y = find(parent,edge_tuple[i][1]);

    if(x===y) return 1;
    Union(parent,x,y);
  }
  return 0; 
}

function find(parent,i){
  if(parent[i]==-1) return i;
  return find(parent,parent[i]);
}

function Union(parent,x,y){
  let xset = find(parent,x);
  let yset = find(parent,y);
  parent[xset] = yset;
}