// 工作循环  调用beginWork和completeWork

import { beginWork } from './beginWork';
import { completeWork } from './complateWork';
import { FiberNode, FiberRootNode, createWorkInProgress } from './fiber';
import { HostRoot } from './workTags';

//全局的指针指向正在工作的FiberNode

let workInProgress: FiberNode | null = null;

function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// TODO 调度功能
	const root = markUpdateFromFiberToRoot(fiber);
	renderRoot(root);
}

function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;
	let parent = node.return;
	while (parent !== null) {
		node = parent;
		parent = parent.return;
	}
	if (node.tag === HostRoot) {
		return node.stateNode;
	}

	return null;
}

function renderRoot(root: FiberNode) {
	//初始化
	prepareFreshStack(root);

	do {
		try {
			workLoop();
			break;
		} catch (e) {
			console.error('workLoop发生错误', e);
		}
	} while (true);
}

function workLoop() {
	while (workInProgress !== null) {
		preformUnitOfWork(workInProgress);
	}
}

function preformUnitOfWork(fiber: FiberNode) {
	const next = beginWork(fiber);
	fiber.memoizedProps = fiber.pendingProps;

	if (next === null) {
		completeUnitWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitWork(fiber: FiberNode) {
	// 如果有子节点遍历子节点，没有子节点遍历兄弟节点

	let node: FiberNode | null = fiber;
	do {
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
			return;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
