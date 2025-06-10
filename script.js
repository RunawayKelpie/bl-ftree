
const rawData = {
  nodes: [
    { id: "Mister Coffee", label: "Mister Coffee", image: "https://via.placeholder.com/100?text=Mister+Coffee", shape: "image" },
    { id: "Beacons", label: "Beacons", image: "https://via.placeholder.com/100?text=Beacons", shape: "image" },
    { id: "My Trainwreck of a Life", label: "My Trainwreck of a Life", image: "https://via.placeholder.com/100?text=Trainwreck", shape: "image" },
    { id: "Allan Hessey Big Band", label: "Allan Hessey Big Band", image: "https://via.placeholder.com/100?text=Hessey", shape: "image" },
    { id: "Area 7", label: "Area 7", image: "https://via.placeholder.com/100?text=Area+7", shape: "image" },
    { id: "Fiercebeard", label: "Fiercebeard", image: "https://via.placeholder.com/100?text=Fiercebeard", shape: "image" }
  ],
  edges: [
    { from: "Mister Coffee", to: "Beacons", title: "Jimma Hobson, Tommy Gaffney, D. 'Ocker' O’Connell, Miranda ‘Diz’ De’Ath, Dougie Rankin, Andy Gardiner" },
    { from: "Mister Coffee", to: "My Trainwreck of a Life", title: "Jimma Hobson, D. 'Ocker' O’Connell" },
    { from: "Mister Coffee", to: "Allan Hessey Big Band", title: "D. 'Ocker' O’Connell" },
    { from: "Mister Coffee", to: "Area 7", title: "D. 'Ocker' O’Connell, Andy Gardiner" },
    { from: "Mister Coffee", to: "Fiercebeard", title: "D. 'Ocker' O’Connell, Andy Gardiner" },
    { from: "Area 7", to: "Beacons", title: "Andy Gardiner, D. 'Ocker' O’Connell" },
    { from: "Area 7", to: "My Trainwreck of a Life", title: "D. 'Ocker' O’Connell" },
    { from: "Area 7", to: "Allan Hessey Big Band", title: "D. 'Ocker' O’Connell" },
    { from: "Area 7", to: "Fiercebeard", title: "Andy Gardiner" },
    { from: "Beacons", to: "My Trainwreck of a Life", title: "Jimma Hobson" },
    { from: "Beacons", to: "Allan Hessey Big Band", title: "D. 'Ocker' O’Connell" },
    { from: "Beacons", to: "Fiercebeard", title: "Andy Gardiner" },
    { from: "My Trainwreck of a Life", to: "Allan Hessey Big Band", title: "D. 'Ocker' O’Connell" },
    { from: "My Trainwreck of a Life", to: "Fiercebeard", title: "D. 'Ocker' O’Connell" },
    { from: "Allan Hessey Big Band", to: "Fiercebeard", title: "D. 'Ocker' O’Connell" }
  ]
};

function drawGraph() {
  const seed = document.getElementById('seedInput').value.trim();
  const depth = parseInt(document.getElementById('depthInput').value);
  const errorEl = document.getElementById("error");
  errorEl.innerText = "";

  const nodeMap = Object.fromEntries(rawData.nodes.map(n => [n.id.toLowerCase(), n]));
  const seedNode = nodeMap[seed.toLowerCase()];

  if (!seedNode) {
    errorEl.innerText = "Seed band not found in data.";
    return;
  }

  const queue = [{ id: seedNode.id, level: 0 }];
  const visitedNodes = new Set();
  const visitedEdges = new Set();
  const nodes = [];
  const edges = [];

  while (queue.length) {
    const current = queue.shift();
    if (visitedNodes.has(current.id) || current.level > depth) continue;
    visitedNodes.add(current.id);

    const node = rawData.nodes.find(n => n.id === current.id);
    if (node) nodes.push(node);

    const connectedEdges = rawData.edges.filter(e => e.from === current.id || e.to === current.id);
    for (const edge of connectedEdges) {
      const edgeKey = [edge.from, edge.to].sort().join("::");
      if (!visitedEdges.has(edgeKey)) {
        edges.push({ ...edge, label: "", title: edge.title }); // Hide label, keep hover
        visitedEdges.add(edgeKey);
      }

      const otherId = edge.from === current.id ? edge.to : edge.from;
      if (!visitedNodes.has(otherId)) {
        queue.push({ id: otherId, level: current.level + 1 });
      }
    }
  }

  const container = document.getElementById("network");
  container.innerHTML = "";
  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };
  const options = {
    nodes: {
      shape: 'image',
      size: 50,
      font: { size: 14, color: '#000', strokeWidth: 2, strokeColor: '#fff' }
    },
    edges: {
      arrows: 'to',
      color: 'gray',
      font: { size: 10 },
      smooth: { type: 'dynamic' }
    },
    interaction: {
      hover: true
    },
    layout: {
      improvedLayout: true
    },
    physics: {
      enabled: true,
      solver: 'repulsion',
      repulsion: { nodeDistance: 200, springLength: 300 }
    }
  };
  new vis.Network(container, data, options);
}
