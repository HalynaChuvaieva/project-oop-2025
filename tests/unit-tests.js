import { describe, expect, test } from "@jest/globals";
import SimpleBST from "../src/SimpleBST";
import { AVLTree, BalancedBST } from "../src/trees";
import Graph from "../src/Graph";
import SimpleQueue from "../src/SimpleQueue";
import SimpleStack from "../src/SimpleStack";
// === BST_Insert ===
describe("BST_Insert", () => {
  test("inserts elements in correct order", () => {
    const bst = new SimpleBST<number>();
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    bst.insert(1);
    expect(bst.inorder()).toEqual([1, 3, 5, 7]);
  });

  test("does not insert duplicates", () => {
    const bst = new SimpleBST<number>();
    bst.insert(5);
    bst.insert(5);
    expect(bst.inorder()).toEqual([5]);
  });
});

// === AVL_Height ===
describe("AVL_Height", () => {
  test("balances correctly after insertion", () => {
    const avl = new AVLTree<number>();
    avl.insert(30);
    avl.insert(20);
    avl.insert(10); // should trigger right rotation
    expect(avl.inorder()).toEqual([10, 20, 30]);
  });

  test("handles multiple rotation cases", () => {
    const avl = new AVLTree<number>();
    avl.insert(10);
    avl.insert(30);
    avl.insert(20); // should trigger left-right rotation
    expect(avl.inorder()).toEqual([10, 20, 30]);
  });
});

// === BalancedBST_Remove (deleteNode) ===
describe("BalancedBST_Remove", () => {
  test("removes leaf node correctly", () => {
    const bst = new SimpleBST<number>();
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    bst.deleteNode(3);
    expect(bst.inorder()).toEqual([5, 7]);
  });

  test("removes node with two children correctly", () => {
    const bst = new SimpleBST<number>();
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);
    bst.insert(6);
    bst.insert(8);
    bst.deleteNode(7);
    expect(bst.inorder()).toEqual([3, 5, 6, 8]);
  });
});

// === BalancedBST getHeight ===
describe("BalancedBST Height", () => {
  test("calculates tree height correctly", () => {
    const tree = new BalancedBST<number>();
    tree.insert(10);
    tree.insert(5);
    tree.insert(15);
    expect(tree.getHeight()).toBe(2);
  });
});

// === Graph Tests ===
describe("Graph", () => {
  test("addVertex adds vertices", () => {
    const g = new Graph<number>();
    g.addVertex(1);
    g.addVertex(2);
    expect(g.vertices).toEqual([1, 2]);
  });

  test("addEdge adds edges in both directions", () => {
    const g = new Graph<number>();
    g.addEdge(1, 2);
    expect(g.edges).toContainEqual([1, 2]);
    expect(g.edges).toContainEqual([2, 1]);
  });

  test("toJSON and fromJSON work correctly", () => {
    const g = new Graph<number>();
    g.addEdge(1, 2);
    const data = g.toJSON();

    const g2 = new Graph<number>();
    g2.fromJSON(data);
    expect(g2.edges).toEqual(g.edges);
    expect(g2.vertices).toEqual(g.vertices);
  });

  test("clear removes all vertices and edges", () => {
    const g = new Graph<number>();
    g.addEdge(1, 2);
    g.clear();
    expect(g.vertices.length).toBe(0);
    expect(g.edges.length).toBe(0);
  });
});


describe("SimpleQueue", () => {

  test("initializes with empty array by default", () => {
    const q = new SimpleQueue();
    expect(q.toArray()).toEqual([]);
  });

  test("initializes with given array", () => {
    const q = new SimpleQueue([1, 2, 3]);
    expect(q.toArray()).toEqual([1, 2, 3]);
  });

  test("enqueue adds elements to the end", () => {
    const q = new SimpleQueue();
    q.enqueue(10);
    q.enqueue(20);
    expect(q.toArray()).toEqual([10, 20]);
  });

  test("dequeue removes elements from the front", () => {
    const q = new SimpleQueue([1, 2, 3]);
    q.dequeue();
    expect(q.toArray()).toEqual([2, 3]);
    q.dequeue();
    expect(q.toArray()).toEqual([3]);
  });

  test("dequeue on empty queue does nothing", () => {
    const q = new SimpleQueue();
    expect(q.dequeue()).toBeUndefined();
    expect(q.toArray()).toEqual([]);
  });

  test("toArray returns a copy of internal array", () => {
    const q = new SimpleQueue([1, 2]);
    const arr = q.toArray();
    arr.push(3);
    expect(q.toArray()).toEqual([1, 2]); // internal array not affected
  });

  test("clear empties the queue", () => {
    const q = new SimpleQueue([1, 2, 3]);
    q.clear();
    expect(q.toArray()).toEqual([]);
  });

});

describe("SimpleStack", () => {

  test("initializes with empty array by default", () => {
    const stack = new SimpleStack();
    expect(stack.toArray()).toEqual([]);
  });

  test("initializes with given array", () => {
    const stack = new SimpleStack([1, 2, 3]);
    expect(stack.toArray()).toEqual([1, 2, 3]);
  });

  test("push adds elements to the top", () => {
    const stack = new SimpleStack();
    stack.push(10);
    stack.push(20);
    expect(stack.toArray()).toEqual([10, 20]);
  });

  test("pop removes elements from the top", () => {
    const stack = new SimpleStack([1, 2, 3]);
    stack.pop();
    expect(stack.toArray()).toEqual([1, 2]);
    stack.pop();
    expect(stack.toArray()).toEqual([1]);
  });

  test("pop on empty stack does nothing", () => {
    const stack = new SimpleStack();
    expect(stack.pop()).toBeUndefined();
    expect(stack.toArray()).toEqual([]);
  });

  test("toArray returns a copy of internal array", () => {
    const stack = new SimpleStack([1, 2]);
    const arr = stack.toArray();
    arr.push(3);
    expect(stack.toArray()).toEqual([1, 2]); // internal array not affected
  });

  test("clear empties the stack", () => {
    const stack = new SimpleStack([1, 2, 3]);
    stack.clear();
    expect(stack.toArray()).toEqual([]);
  });

});

