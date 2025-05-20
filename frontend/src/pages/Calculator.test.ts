import { describe, test, expect } from 'vitest'

enum NodeType {
	Add = "+",
	Minus = "-",
	Multiply = "x",
	Divide = "÷",
	Modulus = "%",
	// number 
	Number = ""
}


interface AstNode {
	type: NodeType,
	value?: string,
	left?: AstNode,
	right?: AstNode
}

function assert(exp: boolean, errMsg: string) {
	if (!exp) {
		throw new Error(errMsg);
	}
}

/**
 * parse ast and get result.
 */
function parseAst(node: NonNullable<AstNode>): number {
	if (node.type === NodeType.Number) {
		if (!node.value) {
			assert(node.value !== undefined, `node.value should not be undefined`);
		} else {
			return Number(node.value);
		}
	}
	assert(node.left !== undefined, 'node.left should not ne undefined');
	assert(node.right !== undefined, 'node.left should not ne undefined');
	const leftNode = node.left!;
	const rightNode = node.right!;
	const leftResult = parseAst(leftNode);
	const rightResult = parseAst(rightNode);
	switch (node.type) {
		case NodeType.Add:
			return leftResult + rightResult;
		default:
			throw new Error(`unsupported node type: ${node.type}`)
	}
}

describe('ast', () => {
	describe("parseAst", () => {
		test('add', () => {
			const node = {
				type: NodeType.Add,
				left: {
					type: NodeType.Number,
					value: "1",
				},
				right: {
					type: NodeType.Number,
					value: "2",
				}
			}
			expect(parseAst(node)).toBe(3);
		})
	})
})


describe('test', () => {
	test("1+1", () => {
		expect(1 + 1).toBe(2);
	})
})
