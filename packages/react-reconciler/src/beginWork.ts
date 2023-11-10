import { ReactElementType } from 'shared/ReactTypes';
import { mountChildFibers, reconcileChildFibers } from './childFibers';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostRoot, HostText, HostComponent } from './workTags';

// 递归中的递阶段
export const beginWork = (wip: FiberNode) => {
	// reactElement和fiberNode比较返回子fiberNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);
		case HostText:
			return null;
		default:
			if (__DEV__) {
				console.warn('beginWork未实现的类型');
			}
	}

	return null;
};

function updateHostRoot(wip: FiberNode) {
	const baseState = wip.momoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;

	const { memoizedState } = processUpdateQueue(baseState, pending);

	wip.momoizedState = memoizedState;

	const nextChildren = wip.momoizedState;

	// 创建子fibernode
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	// HostComponent <div><span>213</span></div> 工作流程为创建子fiberNode
	reconcileChildren(wip, nextChildren);

	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;
	// mount阶段有大量的DOM生成和插入，更新阶段少量的数据更新
	if (current !== null) {
		// update
		wip.child = reconcileChildFibers(wip, current?.child, children);
	} else {
		// mount
		wip.child = mountChildFibers(wip, null, children);
	}
}
