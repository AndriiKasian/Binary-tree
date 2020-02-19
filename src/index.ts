type NodeType = TreeNode | null;

interface TreeNode {
    name: string;
    parentNode: TreeNode;
    leftNode: NodeType;
    rightNode: NodeType;
    setLeftNode(name: string): void;
    setRightNode(name: string): void;
}

export class BinaryTreeNode implements TreeNode {
    name: string;
    leftNode: NodeType;
    rightNode: NodeType;
    parentNode: TreeNode;

    constructor(name: string, parentNode?: TreeNode) {
        this.name = name;
        this.leftNode = null;
        this.rightNode = null;
        this.parentNode = parentNode || null;
    }

    setLeftNode(nodeName: string): void {
        this.leftNode = new BinaryTreeNode(nodeName, this);
    }

    setRightNode(nodeName: string): void {
        this.rightNode = new BinaryTreeNode(nodeName, this);
    }
}

interface Marshaling {
    marshal(binaryTree: BinaryTreeNode): string;
    unmarshal(value: string): BinaryTreeNode;
}

export class TransformService implements Marshaling {
    private charIndex: number = 0;

    /**
     * transform the tree into a string
     */
    marshal(binaryTree: BinaryTreeNode): string {
        if (!(binaryTree instanceof BinaryTreeNode)) {
            throw new Error('Passed data should be instance of BinaryTreeNode')
        }

        return this.makeMarshaling(binaryTree);
    }

    private makeMarshaling(binaryTree: BinaryTreeNode): string {
        if (!binaryTree) {
            return '';
        }

        let str = '';
        str += binaryTree.name;

        // if leaf node, then return
        if (binaryTree.leftNode === null && binaryTree.rightNode === null) {
            return str;
        }

        // for left subtree
        str += '(';
        str += this.makeMarshaling(binaryTree.leftNode);
        str += ')';

        // only if right child is present to
        // avoid extra parenthesis
        if (binaryTree.rightNode !== null) {
            str += '(';
            str += this.makeMarshaling(binaryTree.rightNode);
            str += ')';
        }

        return str;
    }

    /**
     * read string and create a tree data structure from it
     */
    unmarshal(str: string): BinaryTreeNode {
        if (typeof str !== 'string' || !str.length || !this.shouldMatchPattern(str) ) {
            throw new Error('Passed data should be a string');
        }

        return this.makeUnmarshaling(str);
    }

    private makeUnmarshaling(str: string, parentNode?: BinaryTreeNode): BinaryTreeNode {
        if (!str.length) {
            return null;
        }
        let root = null;
        if (str.charAt(this.charIndex) !== '(') {
            const treeName = this.getValFromString(str);
            if (treeName.length) {
                root = new BinaryTreeNode(treeName, parentNode);
            }
        }

        let leftNode = null;
        let rightNode = null;
        if (this.charIndex < str.length && str.charAt(this.charIndex) === '(') { // for the possible leftNode, if '(' met.
            this.charIndex++;
            leftNode = this.makeUnmarshaling(str, root);
        }
        if (this.charIndex < str.length && str.charAt(this.charIndex) === '(') { // for the possible rightNode, if '(' met.
            this.charIndex++;
            rightNode = this.makeUnmarshaling(str, root);
        }
        // if not '(' it must be ')' or charIndex == str.length
        // so we return the current stack
        if (root) {
            root.leftNode = leftNode;
            root.rightNode = rightNode;
        }

        this.charIndex++;
        return root;
    }

    private getValFromString(str: string): string {
        if (typeof str !== 'string' || !str.length ) {
            return '';
        }

        let newString = '';
        while (this.charIndex < str.length) {
            if (str.charAt(this.charIndex) === '(' || str.charAt(this.charIndex) === ')') {
                break;
            }
            newString += str.charAt(this.charIndex);
            this.charIndex++;
        }

        return newString;
    }

    private shouldMatchPattern(str: string): boolean {
        const root = this.getRootValue(str);
        const leftParentheses = this.countSymbols(str, '(');
        const rightParentheses = this.countSymbols(str, ')');

        return root.length && leftParentheses === rightParentheses;
    }

    public getRootValue(str: string): string {
        return str.slice(0, str.indexOf("("));
    }

    private countSymbols(str: string, symbol: string): number {
        const regExp = new RegExp(`/\\${symbol}/`, 'g');
        const result = [...str['matchAll'](regExp)];

        return result.length;
    }
}

const transformService = new TransformService();

//Create test Binary Tree data structure
const testTree = new BinaryTreeNode('abc');
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
