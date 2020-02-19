import { TransformService, BinaryTreeNode } from './index';

const transformService = new TransformService();
const testTree = new BinaryTreeNode('abc');
testTree.setLeftNode('dde');
testTree.setRightNode('gaw');
testTree.leftNode.setRightNode('bgws');
testTree.rightNode.setLeftNode('d123');
testTree.rightNode.setRightNode('asdd1');

const expectedString = "abc(dde()(bgws))(gaw(d123)(asdd1))";

describe('transformService', () => {
    test('should be defined', () => {
        expect(typeof transformService).toBeDefined()
    })

    describe('marshal method', () => {
        test('should be the function', () => {
            expect(typeof transformService.marshal).toBe('function')
        })

        test('throws error without params', () => {
            expect(() => transformService.marshal()).toThrow()
        })

        test('throws error with incorrect params', () => {
            expect(() => transformService.marshal('')).toThrow()
        })

        test('should works correct', () => {
            expect(transformService.marshal(testTree)).toBe(expectedString);
        })
    })

    describe('unmarshal method', () => {
        test('should be the function', () => {
            expect(typeof transformService.unmarshal).toBe('function')
        })

        test('throws error without params', () => {
            expect(() => transformService.unmarshal()).toThrow()
        })

        test('throws error with incorrect params', () => {
            expect(() => transformService.unmarshal(10)).toThrow()
        })

        test('should works correct', () => {
            const result = transformService.unmarshal(expectedString);

            expect(result).toBeInstanceOf(BinaryTreeNode)
            expect(result).toEqual(testTree)
        })
    })
})

