   // Creación de conjuntos de nodos y aristas
   var nodes = new vis.DataSet([
    // Definición de nodos con IDs y etiquetas
      { id: 1, label: 'Pensamiento A' },
      { id: 2, label: 'Fundamentos' },
      { id: 3, label: 'Estructura L' },
      { id: 4, label: 'Paradigmas' },
      { id: 5, label: 'Estructura NL' },
      { id: 6, label: 'Algoritmos' },
      { id: 7, label: 'Bases de Datos' },
      { id: 8, label: 'Lenguajes' },
      { id: 9, label: 'Ing Software' },
      { id: 10, label: 'Patrones' },
      { id: 11, label: 'BigData' },
      { id: 12, label: 'Arq Software' },
      { id: 13, label: 'Fin' },
    ]);

    var edges = new vis.DataSet([
    // Definición de aristas con conexiones, etiquetas y direcciones
    { from: 1, to: 2, arrows: 'to',label:"(64,1)" },
    { from: 2, to: 3, arrows: 'to',label:"(48,2)" },
    { from: 2, to: 4, arrows: 'to',label:"(48,2)" },
    { from: 3, to: 5, arrows: 'to',label:"(32,2)" },
    { from: 3, to: 6, arrows: 'to',label:"(32,2)" },
    { from: 4, to: 6, arrows: 'to',label:"(64,1)" },
    { from: 5, to: 7, arrows: 'to',label:"(64,3)" },
    { from: 6, to: 8, arrows: 'to',label:"(16,3)" },
    { from: 7, to: 9, arrows: 'to',label:"(48,4)" },
    { from: 7, to: 10, arrows: 'to',label:"(48,4)" },
    { from: 7, to: 11, arrows: 'to',label:"(48,4)" },
    { from: 10, to: 12, arrows: 'to',label:"(64,1)" },
    { from: 8, to: 13, arrows: 'to',label:"(32,2)" },
    { from: 9, to: 13, arrows: 'to',label:"(32,4)" },
    { from: 12, to: 13, arrows: 'to',label:"(64,3)" },
    { from: 11, to: 13, arrows: 'to',label:"(48,2)" },
    ]);

    function actualizarGrafo() {
    // Limpiar el contenedor del grafo
    var container = document.getElementById("grafico");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // Crear un nuevo grafo con los nodos y aristas actualizados
    var data = {
      nodes: nodes,
      edges: edges
    };

    var options = {
      physics: false,
      interaction:{
        selectConnectedEdges: false
      }
    }; // Puedes agregar opciones de configuración aquí si las tienes

    network = new vis.Network(Grafico, data, options);
    }

    // Crea la matriz de adyacencia
    function crearMatrizAdyacencia() {
    var matriz = [];

    nodes.forEach(function(node) {  
      var row = [];
      nodes.forEach(function() {
        row.push(0);
      });
      matriz.push(row);
    });

    edges.forEach(function(edge) {
      matriz[edge.from-1][edge.to-1] = 1;
    });

    return matriz;
    }

    // Crea la matriz de incidencia
   function crearMatrizIncidencia() {
    var matriz = [];

    nodes.forEach(function(node) {
      var row = [];
      edges.forEach(function(edge) {
        if (edge.from === node.id) {
          row.push(1);
        } else if (edge.to === node.id) {
          row.push(-1);
        } else {
          row.push(0);
        }
      });
      matriz.push(row);
    });
    return matriz;
    }

     // Actualiza las tablas de matrices
    function actualizarMatrices() {
    var adyacenciaTable = document.getElementById("adyacencia");
    var incidenciaTable = document.getElementById("incidencia");

    adyacenciaTable.innerHTML = '';
    incidenciaTable.innerHTML = '';
    
    // Crea la fila de encabezado para ambas tablas
    var adyacenciaHeaderRow = adyacenciaTable.insertRow();
    var incidenciaHeaderRow = incidenciaTable.insertRow();

    adyacenciaHeaderRow.insertCell();
    incidenciaHeaderRow.insertCell();

    nodes.forEach(function(node) {
      var adyacenciaHeaderCell = adyacenciaHeaderRow.insertCell();
      adyacenciaHeaderCell.innerHTML = node.label;
    });
    edges.forEach(function(edge){
      var incidenciaHeaderCell = incidenciaHeaderRow.insertCell();
      incidenciaHeaderCell.innerHTML = edge.label;
    });

    // Llena las tablas con las matrices
    var matrizAdyacencia = crearMatrizAdyacencia();
    var matrizIncidencia = crearMatrizIncidencia();
    var i=0;
    nodes.forEach(function(node){
      
      var adyacenciaRow = adyacenciaTable.insertRow();
      var incidenciaRow = incidenciaTable.insertRow();

      var adyacenciaHeaderCell = adyacenciaRow.insertCell();
      adyacenciaHeaderCell.innerHTML = node.label;

      var incidenciaHeaderCell = incidenciaRow.insertCell();
      incidenciaHeaderCell.innerHTML = node.label;

      for (var j = 0; j < edges.length; j++) {
        if (j < nodes.length) {
          var adyacenciaCell = adyacenciaRow.insertCell();
          adyacenciaCell.innerHTML = matrizAdyacencia[i][j];
        }

        var incidenciaCell = incidenciaRow.insertCell();
        incidenciaCell.innerHTML = matrizIncidencia[i][j];
      }
    i=i+1;
    });
    }
    
    var button = document.createElement("button");
    button.innerHTML = "Actualizar Tabla";
    button.onclick = function() {
    actualizarMatrices();
    };

    function guardarDatosComoJSON() {
    var datos = {
      nodes: nodes.get(),
      edges: edges.get()
    };

    var texto = JSON.stringify(datos, null, 2); // Agregamos 2 espacios de sangría
    var blob = new Blob([texto], { type: "application/json;charset=utf-8" });
    saveAs(blob, "datos_grafo.json");
    }



    function cargarDatosDesdeJSON() {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";

    fileInput.addEventListener("change", function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();

      reader.onload = function() {
        var contenido = reader.result;
        var datos = JSON.parse(contenido);

        // Actualizar los diccionarios nodes y edges
        nodes = new vis.DataSet(datos.nodes);
        edges = new vis.DataSet(datos.edges);

        // Actualizar el grafo y las tablas
        actualizarGrafo();
        actualizarMatrices();
      }

      reader.readAsText(file);
    });

    fileInput.click();
    }

    

    // Obtener referencias a elementos HTML
    var Grafico = document.getElementById('grafico');
    var Grafico2 = document.getElementById('grafico2');
    var Grafico3 = document.getElementById('grafico3');
    var Agregar = document.getElementById('Agregar');
    var addEdgeButton = document.getElementById('addEdgeButton');
    var oneDirectionRadio = document.getElementById('oneDirection');
    var bothDirectionsRadio = document.getElementById('bothDirections');
    var deleteNodeButton = document.getElementById('deleteNodeButton');
    var deleteEdgeButton = document.getElementById('deleteEdgeButton');
    var editNodeButton = document.getElementById('editNodeButton');
    var editEdgeButton = document.getElementById('editEdgeButton');
    // Configuración de datos y opciones del grafo
    var data = {
      nodes: nodes,
      edges: edges
    };

    var options = {
      physics: false,
      interaction:{
        selectConnectedEdges: false
      }
    };
    // Crear el objeto de red (grafo) utilizando vis.js
    var network = new vis.Network(Grafico, data, options);
    var network2 = new vis.Network(Grafico2, data, options);
    var network3 = new vis.Network(Grafico3, data, options);
    // Arreglo para almacenar IDs de nodos seleccionados  
    var selectedNodes = [];
    var contador = nodes.length;
     // Manejador de evento cuando se selecciona un nodo
    network.on("selectNode", function (params) {
    var nodeId = params.nodes[0];
    // Verificar si se pueden agregar aristas
    if (selectedNodes.length < 2 && selectedNodes.indexOf(nodeId) === -1) {
      selectedNodes.push(nodeId);
      // Habilitar el botón de agregar arista si se han seleccionado dos nodos
      if (selectedNodes.length === 2) {
        addEdgeButton.disabled = false;
      }
    }
  });
  // Manejador de evento cuando se deselecciona un nodo
  network.on("deselectNode", function (params) {
    var nodeId = params.nodes[0];
    var index = selectedNodes.indexOf(nodeId);
    if (index !== -1) {
      selectedNodes.splice(index, 1);
      addEdgeButton.disabled = true;
    }
  });
  // Manejador de evento para agregar arista
  addEdgeButton.addEventListener('click', function() {
    if (selectedNodes.length === 2) {
      var fromNodeId = selectedNodes[0];
      var toNodeId = selectedNodes[1];
      var arrows = getArrowsDirection();
      var edgeLabel = prompt("Introduce el texto para la arista:", "");
      edges.add({ from: fromNodeId, to: toNodeId, arrows: arrows, label: edgeLabel });
      selectedNodes = [];
      addEdgeButton.disabled = true;
    }
  });
  // Función para determinar dirección de flechas de las aristas
  function getArrowsDirection() {
    if (oneDirectionRadio.checked) {
      return 'to';
    } else if (bothDirectionsRadio.checked) {
      return 'to, from';
    }
    return '';
  }
  // Manejador de evento para agregar nodo
  
  Agregar.addEventListener('click', function() {
      contador = contador + 1;
      var newNodeId = contador;
      var nodeLabel = prompt("Introduce el texto para el nodo:", "");
      var newNode = { id: newNodeId, label: nodeLabel };
      nodes.add(newNode);
      
    });
  // Manejador de evento para eliminar nodo
  deleteNodeButton.addEventListener('click', function() {
    var selectedNode = network.getSelectedNodes();
    if (selectedNode.length > 0) {
      // Elimina las aristas relacionadas al nodo seleccionado
      var edgesToRemove = [];
      edges.forEach(function(edge) {
        if (edge.from === selectedNode || edge.to === selectedNode) {
          edgesToRemove.push(edge.id);
        }
      });
      edges.remove(edgesToRemove);

      // Elimina el nodo seleccionado
      nodes.remove(selectedNode);
      
      selectedNodes = []; // Limpiar la selección de nodos
      addEdgeButton.disabled = true; // Deshabilitar el botón de agregar arista después de eliminar un nodo
    }
  });
  // Manejador de evento para eliminar arista
  deleteEdgeButton.addEventListener('click', function() {
    var selectedEdges = network.getSelectedEdges();
    if (selectedEdges.length > 0) {
      edges.remove(selectedEdges);
    }
  });
  // Manejador de evento para editar nodo
  editNodeButton.addEventListener('click', function() {
    var selectedNode = network.getSelectedNodes();
    if (selectedNode.length > 0) {
      var nodeId = selectedNode[0];
      var nodeToUpdate = nodes.get(nodeId);
      var newNodeLabel = prompt("Introduce el nuevo texto para el nodo:", nodeToUpdate.label);

      if (newNodeLabel !== null) {
        nodeToUpdate.label = newNodeLabel;
        nodes.update(nodeToUpdate);
        addEdgeButton.disabled = true;
      }
    }
    else {
      alert("Selecciona un nodo para editar.");
    }
  });
  // Manejador de evento para editar arista
  editEdgeButton.addEventListener('click', function() {
    var selectedEdge = network.getSelectedEdges()[0];
    if (selectedEdge.length > 0) {
      var edgeLabel = prompt("Introduce el texto para la arista:", "");
      edges.update({ id: selectedEdge, label: edgeLabel });

    }
  });

// Función para encontrar el camino mínimo utilizando el algoritmo de Dijkstra
function dijkstra(graph, startNodeId) {
nodes: nodes;
var distances = {};
var previousNodes = {};
var unvisitedNodes = new Set();



// Inicializar las distancias y nodos previos
nodes.forEach(function(node) {
  distances[node.id] = Infinity;
  previousNodes[node.id] = null;
  unvisitedNodes.add(node.id);
});

distances[startNodeId] = 0;

while (unvisitedNodes.size > 0) {
  var currentNodeId = getClosestNode(unvisitedNodes, distances);
  unvisitedNodes.delete(currentNodeId);

  var neighbors = getNeighbors(currentNodeId);

  for (var neighborId of neighbors) {
    var tentativeDistance = distances[currentNodeId] + getDistance(currentNodeId, neighborId);

    if (tentativeDistance < distances[neighborId]) {
      distances[neighborId] = tentativeDistance;
      previousNodes[neighborId] = currentNodeId;
    }
  }
}

return { distances, previousNodes };
}

// Función para obtener el nodo más cercano entre los nodos no visitados
function getClosestNode(unvisitedNodes, distances) {
var closestNode = null;
unvisitedNodes.forEach(function(nodeId) {
  if (closestNode === null || distances[nodeId] < distances[closestNode]) {
    closestNode = nodeId;
  }
});
return closestNode;
}

// Función para obtener los nodos vecinos de un nodo
function getNeighbors(nodeId) {
var neighbors = [];
edges.forEach(function(edge) {
  if (edge.from === nodeId) {
    neighbors.push(edge.to);
  }
});
return neighbors;
}

// Función para obtener la distancia entre dos nodos
function getDistance(node1Id, node2Id) {
var distance = Infinity;
edges.forEach(function(edge) {
  if ((edge.from === node1Id && edge.to === node2Id) || (edge.from === node2Id && edge.to === node1Id)) {
    distance = parseInt(edge.label.match(/\d+/)[0]); // Extraer el número de la etiqueta
  }
});
return distance;
}

// Ejemplo de uso del algoritmo de Dijkstra
var startNodeId = 1; // ID del nodo de inicio
var result = dijkstra(nodes, startNodeId);
console.log("Distancias mínimas desde el nodo " + startNodeId + ":");
console.log(result.distances);


// Resaltar el camino mínimo en el grafo
function highlightShortestPath(result, startNodeId) {
var shortestPathNodes = [];
var currentNodeId = 13; // ID del nodo de destino (puedes cambiarlo según tus necesidades)

while (currentNodeId !== startNodeId) {
  shortestPathNodes.unshift(currentNodeId);
  currentNodeId = result.previousNodes[currentNodeId];
}
shortestPathNodes.unshift(startNodeId);

// Resaltar el camino mínimo en verde
var highlightedEdges = [];
for (var i = 0; i < shortestPathNodes.length - 1; i++) {
  var fromNodeId = shortestPathNodes[i];
  var toNodeId = shortestPathNodes[i + 1];

  edges.forEach(function (edge) {
    if ((edge.from === fromNodeId && edge.to === toNodeId) || (edge.from === toNodeId && edge.to === fromNodeId)) {
      highlightedEdges.push(edge.id);
    }
  });
}

// Actualizar la visualización del grafo
var updatedData = {
  nodes: nodes,
  edges: edges.map(function (edge) {
    if (highlightedEdges.includes(edge.id)) {
      return { ...edge, color: { color: 'green' } };
    } else {
      return { ...edge, color: { color: 'black' } };
    }
  }),
};
network2.setData(updatedData);
}


// Ejecutar la función para resaltar el camino mínimo
highlightShortestPath(result, startNodeId);

  ;

  // Obtener la caja de texto
var solutionTextArea = document.getElementById('solutionTextArea');

// Crear una cadena con la solución
var solutionText = 'Camino mínimo desde el nodo ' + startNodeId + ':\n';

// Obtener los nodos en el camino mínimo
var shortestPathNodes = [];
var currentNodeId = 13; // ID del nodo de destino (puedes cambiarlo según tus necesidades)

while (currentNodeId !== startNodeId) {
shortestPathNodes.unshift(currentNodeId);
currentNodeId = result.previousNodes[currentNodeId];
}
shortestPathNodes.unshift(startNodeId);

// Agregar los nodos al texto de la solución
solutionText += shortestPathNodes.join(" -> ");

// Actualizar el contenido de la caja de texto
solutionTextArea.value = solutionText;

// Actualizar el contenido de la caja de texto
solutionTextArea.value = solutionText;



// Función para encontrar la ruta crítica en un grafo dirigido acíclico (DAG)
function criticalPath(graph) {
// Realiza un orden topológico del grafo
var topologicalOrder = topologicalSort(graph);

// Inicializa las distancias más largas
var distances = {};
var previousNodes = {};
topologicalOrder.forEach(function(nodeId) {
  distances[nodeId] = -Infinity;
  previousNodes[nodeId] = null;
});

// Inicializa la distancia para el nodo de inicio
var startNodeId = topologicalOrder[0];
distances[startNodeId] = 0;

// Recorre los nodos en orden topológico y actualiza las distancias más largas
topologicalOrder.forEach(function(nodeId) {
  var neighbors = getNeighbors(nodeId);
  neighbors.forEach(function(neighborId) {
    var edgeDistance = getDistance(nodeId, neighborId);
    var newDistance = distances[nodeId] + edgeDistance;
    if (newDistance > distances[neighborId]) {
      distances[neighborId] = newDistance;
      previousNodes[neighborId] = nodeId;
    }
  });
});

// Encuentra el nodo final y construye la ruta crítica
var endNodeId = topologicalOrder[topologicalOrder.length - 1];
var criticalPathNodes = [];
var currentNodeId = endNodeId;
while (currentNodeId !== null) {
  criticalPathNodes.unshift(currentNodeId);
  currentNodeId = previousNodes[currentNodeId];
}

return criticalPathNodes;
}

// Función para realizar un orden topológico en un grafo dirigido acíclico (DAG)
function topologicalSort(graph) {
var visited = {};
var stack = [];

function visit(nodeId) {
  if (!visited[nodeId]) {
    visited[nodeId] = true;
    var neighbors = getNeighbors(nodeId);
    neighbors.forEach(visit);
    stack.unshift(nodeId);
  }
}

nodes.forEach(function(node) {
  var nodeId = node.id;
  if (!visited[nodeId]) {
    visit(nodeId);
  }
});

return stack;
}



// Función para obtener la distancia entre dos nodos
function getDistance(node1Id, node2Id) {
var distance = -Infinity;
edges.forEach(function(edge) {
  if ((edge.from === node1Id && edge.to === node2Id) || (edge.from === node2Id && edge.to === node1Id)) {
    distance = parseInt(edge.label.match(/\d+/)[0]);
  }
});
return distance;
}
// Función para resaltar el camino crítico en el grafo
function highlightCriticalPathInGraph(criticalPathNodes) {
// Obtén las aristas y nodos relevantes del camino crítico
var highlightedEdges = [];
var highlightedNodes = new Set(criticalPathNodes);

for (var i = 0; i < criticalPathNodes.length - 1; i++) {
  var fromNodeId = criticalPathNodes[i];
  var toNodeId = criticalPathNodes[i + 1];

  edges.forEach(function (edge) {
    if ((edge.from === fromNodeId && edge.to === toNodeId) || (edge.from === toNodeId && edge.to === fromNodeId)) {
      highlightedEdges.push(edge.id);
    }
  });
}

// Actualizar la visualización del grafo para resaltar el camino crítico en rojo
var updatedData = {
  nodes: nodes.map(function (node) {
    return {
      ...node,
      borderWidth: highlightedNodes.has(node.id) ? 3 : 1,
      borderWidthSelected: 3,
    };
  }),
  edges: edges.map(function (edge) {
    return {
      ...edge,
      color: {
        color: highlightedEdges.includes(edge.id) ? 'red' : 'black',
      },
      width: highlightedEdges.includes(edge.id) ? 2 : 1,
    };
  }),
};

network3.setData(updatedData);
}



// Obtiene la referencia al elemento de la caja de texto
var criticalPathSolutionTextarea = document.getElementById('criticalPathSolution');

// Función para mostrar la solución del camino crítico en la caja de texto
function displayCriticalPathSolution(criticalPathNodes) {
// Construye una cadena con la solución del camino crítico
var solutionText = 'Camino Crítico (nodos):\n' + criticalPathNodes.join(' -> ');

// Actualiza el contenido de la caja de texto
criticalPathSolutionTextarea.value = solutionText;
}




  //Fin de la paginaS