/**
 * https://leetcode.com/problems/lru-cache/
 */

/**
 * es6 中引入的 Map 既有顺序，又可以保证get、put的时间复杂度为 O(1)
 */
class LRUCacheViaMap<T = any> {
  private capacity: number;
  private cache: Map<number, T>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: number): T | number {
    if (!this.cache.has(key)) {
      return -1;
    }

    const tmp = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, tmp);
    return tmp;
  }

  put(key: number, value: T): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value);
    }

    this.cache.set(key, value);
  }
}


/**
 * 更为经典的解法，采用双向链表
 * 通过 hash表 确保 get 的时间复杂度为 O(1)
 * 通过 双向链表 确保 put 的时间复杂度为 O(1)
 */

class LinkNode<T = any> {
  public key: number;
  public value: T;
  public prev: LinkNode<T> | null;
  public next: LinkNode<T> | null;

  constructor(key: number, value: T) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

const isNodeExist = (node?: LinkNode<any>) => typeof node !== 'undefined';
const fakeNodeKey = -1;
const fakeNodeValue = -1;

class LRUCache<T = any> {
  private capacity: number;
  private cache: Record<number, LinkNode<T>> = {};
  private head = new LinkNode(fakeNodeKey, fakeNodeValue as unknown as T);
  private tail = new LinkNode(fakeNodeKey, fakeNodeValue as unknown as T);

  constructor(capacity: number) {
    this.capacity = capacity;

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public get(key: number): T | number {
    const node = this.cache[key];
    if (!isNodeExist(node)) {
      return -1;
    }

    this._moveToHeader(node);

    return node.value;
  }

  public put(key: number, value: T): void {
    const node = this.cache[key];

    const newNode = new LinkNode(key, value);

    if (isNodeExist(node)) {
      this._removeNode(node);
    } else {
      if (Object.keys(this.cache).length >= this.capacity) {
        this._popTail();
      }
    }

    this._addNode(newNode);
  }

  private _moveToHeader(node: LinkNode<T>) {
    this._removeNode(node);
    this._addNode(node);
  }

  private _popTail(): LinkNode<T> {
    const tailNode = this.tail.prev;
    this._removeNode(tailNode);
    return tailNode;
  }

  private _addNode(node: LinkNode<T>) {
    node.prev = this.head;
    node.next = this.head.next;

    this.head.next.prev = node;
    this.head.next = node;

    this.cache[node.key] = node;
  }

  private _removeNode(node: LinkNode<T>) {
    if (!node) return;

    const prevNode = node.prev;
    const nextNode = node.next;

    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    node.prev = null;
    node.next = null;

    delete this.cache[node.key];
  }
}
