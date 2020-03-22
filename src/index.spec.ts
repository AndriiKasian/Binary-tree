import { TransformService, BinaryTreeNode, NodeType } from './index';

const transformService = new TransformService<string, NodeType>();
const testTree = new BinaryTreeNode<string, NodeType>('abc');
testTree.setLeftNode('dde');
testTree.setRightNode('gaw');
testTree.leftNode.setRightNode('bgws');
testTree.rightNode.setLeftNode('d123');
testTree.rightNode.setRightNode('asdd1');

const expectedString = "abc(dde()(bgws))(gaw(d123)(asdd1))";

describe('transformService', () => {
    it('should be defined', () => {
        expect(typeof transformService).toBeDefined()
    })

    describe('marshal method', () => {
        it('should be the function', () => {
            expect(typeof transformService.marshal).toBe('function')
        })

        it('throws error without params', () => {
            expect(() => transformService.marshal()).toThrow()
        })

        it('throws error with incorrect params', () => {
            expect(() => transformService.marshal('')).toThrow()
        })

        it('should works correct', () => {
            expect(transformService.marshal(testTree)).toBe(expectedString);
        })
    })

    describe('unmarshal method', () => {
        it('should be the function', () => {
            expect(typeof transformService.unmarshal).toBe('function')
        })

        it('throws error without params', () => {
            expect(() => transformService.unmarshal()).toThrow()
        })

        it('throws error with incorrect params', () => {
            expect(() => transformService.unmarshal(10)).toThrow()
        })

        it('should works correct', () => {
            const result = transformService.unmarshal(expectedString);

            expect(result).toBeInstanceOf(BinaryTreeNode)
            expect(result).toEqual(testTree)
        })
    })
})

