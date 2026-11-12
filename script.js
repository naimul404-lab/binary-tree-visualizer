const treeRoot = document.getElementById('treeRoot');
const traversalSelect = document.getElementById('traversalSelect');
const insertValueInput = document.getElementById('insertValue');
const insertBtn = document.getElementById('insertBtn');
const generateBtn = document.getElementById('generateBtn');
const traverseBtn = document.getElementById('traverseBtn');
const algorithmDescription = document.getElementById('algorithmDescription');
const complexity = document.getElementById('complexity');

const traversalInfo = {
  inorder: {
    title: 'Inorder Traversal',
    description: 'Visit the left subtree, then the current node, then the right subtree. This yields sorted order in a BST.',
    complexity: 'Time: O(n) | Space: O(h)'
  },
  preorder: {
    title: 'Preorder Traversal',
    description: 'Visit the current node first, then the left subtree, then the right subtree. This is useful for copying a tree structure.',
    complexity: 'Time: O(n) | Space: O(h)'
  },
  postorder: {
    title: 'Postorder Traversal',
    description: 'Visit the left subtree, then the right subtree, then the current node. It is often used when deleting a tree or evaluating expressions.',
    complexity: 'Time: O(n) | Space: O(h)'
  }
};

let root = null;
let traversalQueue = [];
let isAnimating = false;
let timeoutIds = [];

function setTraversalInfo() {
  const info = traversalInfo[traversalSelect.value];
  algorithmDescription.innerHTML = `<strong>${info.title}</strong><br>${info.description}`;
  complexity.innerHTML = `<strong>Complexity:</strong> ${info.complexity}`;
}

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function createSampleTree() {
  const values = [35, 20, 50, 10, 30, 40, 80, 5, 15, 25, 45, 75, 90];
  root = null;

  values.forEach((value) => insertNode(value));
  renderTree();
}

function insertNode(value) {
  if (!root) {
    root = new TreeNode(value);
    return;
  }

  let current = root;
  while (true) {
    if (value < current.value) {
      if (!current.left) {
        current.left = new TreeNode(value);
        break;
      }
      current = current.left;
    } else {
      if (!current.right) {
        current.right = new TreeNode(value);
        break;
      }
      current = current.right;
    }
  }
}

function renderTree() {
  treeRoot.innerHTML = '';
  if (!root) return;

  const nodeMap = new Map();
  const visited = new Set();
  const queue = [{ node: root, x: 50, y: 40 }];

  while (queue.length) {
    const current = queue.shift();
    const { node, x, y } = current;
    if (!node) continue;

    nodeMap.set(node, { x, y });
    const el = document.createElement('div');
    el.className = 'node';
    if (node === root) el.classList.add('current');
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = node.value;
    treeRoot.appendChild(el);

    if (node.left) {
      queue.push({ node: node.left, x: x - 35, y: y + 90 });
      const parentPoint = nodeMap.get(node) || { x, y };
      const line = document.createElement('div');
      line.className = 'line';
      line.style.left = `${parentPoint.x + 25}px`;
      line.style.top = `${parentPoint.y + 25}px`;
      line.style.width = `${Math.abs((x - 35) - x)}px`;
      line.style.transform = `rotate(${0}deg)`;
      treeRoot.appendChild(line);
    }

    if (node.right) {
      queue.push({ node: node.right, x: x + 35, y: y + 90 });
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    timeoutIds.push(id);
  });
}

async function traverseTree() {
  if (isAnimating || !root) return;
  isAnimating = true;
  traversalQueue = [];

  const traverse = (node, order) => {
    if (!node) return;

    if (order === 'inorder') {
      traverse(node.left, order);
      traversalQueue.push(node);
      traverse(node.right, order);
    } else if (order === 'preorder') {
      traversalQueue.push(node);
      traverse(node.left, order);
      traverse(node.right, order);
    } else {
      traverse(node.left, order);
      traverse(node.right, order);
      traversalQueue.push(node);
    }
  };

  traverse(root, traversalSelect.value);

  for (let i = 0; i < traversalQueue.length; i++) {
    if (!isAnimating) return;
    const node = traversalQueue[i];
    const allNodes = Array.from(treeRoot.querySelectorAll('.node'));
    allNodes.forEach((element) => element.classList.remove('current'));

    const nodeValue = node.value;
    const targetNode = Array.from(allNodes).find((element) => element.textContent.trim() === String(nodeValue));
    if (targetNode) targetNode.classList.add('current');

    renderTree();
    await sleep(Number(700));
  }

  isAnimating = false;
}

function resetTimer() {
  timeoutIds.forEach((id) => clearTimeout(id));
  timeoutIds = [];
  isAnimating = false;
}

insertBtn.addEventListener('click', () => {
  const value = Number(insertValueInput.value);
  if (Number.isNaN(value)) return;
  insertNode(value);
  renderTree();
  insertValueInput.value = '';
});

generateBtn.addEventListener('click', () => {
  resetTimer();
  createSampleTree();
});

traversalSelect.addEventListener('change', setTraversalInfo);
traverseBtn.addEventListener('click', traverseTree);

setTraversalInfo();
createSampleTree();
