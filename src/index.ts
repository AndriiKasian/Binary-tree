type NodeType = TreeNode<string, NodeType> | null;

export interface TreeNode<T extends string, P extends NodeType> {
    name: T;
    parentNode: P;
    leftNode: P;
    rightNode: P;
    setLeftNode(name: T): void;
    setRightNode(name: T): void;
}

export class BinaryTreeNode<T extends string, P extends NodeType> implements TreeNode<string, NodeType> {
    name: T;
    leftNode: P;
    rightNode: P;
    parentNode: P;

    constructor(name: T, parentNode?: P) {
        this.name = name;
        this.leftNode = null;
        this.rightNode = null;
        this.parentNode = parentNode || null;
    }

    public setLeftNode(this: P, nodeName: T): void {
        this.leftNode = new BinaryTreeNode<T, P>(nodeName, this);
    }

    public setRightNode(this: P, nodeName: T): void {
        this.rightNode = new BinaryTreeNode<T, P>(nodeName, this);
    }
}

interface Marshaling<T, P> {
    marshal(binaryTree: P): string;
    unmarshal(value: T): P;
}

export class TransformService<T extends string, P extends NodeType> implements Marshaling<T, P> {
    private charIndex: number = 0;

    /**
     * transform the tree into a string
     */
    public marshal(binaryTree: P): T {
        if (!(binaryTree instanceof BinaryTreeNode)) {
            throw new Error('Passed data should be instance of BinaryTreeNode')
        }

        return this._makeMarshaling(binaryTree);
    }

    private _makeMarshaling(binaryTree?: P): T {
        if (!binaryTree) {
            return '' as T;
        }

        let str = '';
        str += binaryTree.name;

        // if leaf node, then return
        if (binaryTree.leftNode === null && binaryTree.rightNode === null) {
            return str as T;
        }

        // for left subtree
        str += '(';
        str += this._makeMarshaling(binaryTree?.leftNode as P);
        str += ')';

        // only if right child is present to
        // avoid extra parenthesis
        if (binaryTree.rightNode !== null) {
            str += '(';
            str += this._makeMarshaling(binaryTree?.rightNode as P);
            str += ')';
        }

        return str as T;
    }

    /**
     * read string and create a tree data structure from it
     */
    public unmarshal(str: T): P {
        if (typeof str !== 'string' || !str.length || !this._shouldMatchPattern(str) ) {
            throw new Error('Passed data should be a string');
        }

        return this._makeUnmarshaling(str);
    }

    private _makeUnmarshaling(str: T, parentNode?: P): P {
        if (!str.length) {
            return null;
        }
        let root = null;
        if (str.charAt(this.charIndex) !== '(') {
            const treeName = this._getValFromString(str);
            if (treeName.length) {
                root = new BinaryTreeNode<T, P>(treeName, parentNode);
            }
        }

        let leftNode = null;
        let rightNode = null;
        if (this.charIndex < str.length && str.charAt(this.charIndex) === '(') { // for the possible leftNode, if '(' met.
            this.charIndex++;
            leftNode = this._makeUnmarshaling(str, root as  P);
        }
        if (this.charIndex < str.length && str.charAt(this.charIndex) === '(') { // for the possible rightNode, if '(' met.
            this.charIndex++;
            rightNode = this._makeUnmarshaling(str, root as P);
        }
        // if not '(' it must be ')' or charIndex == str.length
        // so we return the current stack
        if (root) {
            root.leftNode = leftNode as P;
            root.rightNode = rightNode as P;
        }

        this.charIndex++;
        return root as P;
    }

    private _getValFromString(str: T): T {
        if (typeof str !== 'string' || !str.length ) {
            return '' as T;
        }

        let newString = '';
        while (this.charIndex < str.length) {
            if (str.charAt(this.charIndex) === '(' || str.charAt(this.charIndex) === ')') {
                break;
            }
            newString += str.charAt(this.charIndex);
            this.charIndex++;
        }

        return newString as T;
    }

    private _shouldMatchPattern(str: T): boolean {
        const root = this.getRootValue(str);
        const leftParentheses = this._countSymbols(str, '(' as T);
        const rightParentheses = this._countSymbols(str, ')' as T);

        return root.length && leftParentheses === rightParentheses;
    }

    public getRootValue(str: T): T {
        return str.slice(0, str.indexOf("(")) as T;
    }

    private _countSymbols(str: T, symbol: T): number {
        const regExp = new RegExp(`/\\${symbol}/`, 'g');
        const result = [...str['matchAll'](regExp)];

        return result.length;
    }
}

const transformService = new TransformService<string, NodeType>();

//Create test Binary Tree data structure
const testTree = new BinaryTreeNode<string, NodeType>('abc');
testTree.setLeftNode('dde');
testTree.setRightNode('gaw');
testTree.leftNode.setRightNode('bgws');
testTree.rightNode.setLeftNode('d123');
testTree.rightNode.setRightNode('asdd1');

const stringFromTree = transformService.marshal(testTree);
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#result').innerHTML = stringFromTree;
})
console.log('STRING_FROM_TREE: ', stringFromTree); // Result should be "abc(dde()(bgws))(gaw(d123)(asdd1))"

const treeFromString = transformService.unmarshal(stringFromTree);
console.log('TREE_FROM_STRING: ', treeFromString);
