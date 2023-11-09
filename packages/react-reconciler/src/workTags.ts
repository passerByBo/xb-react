// functionComponent classComponent
export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0;
//根节点挂载的dom节点
export const HostRoot = 3;
// <div></div>
export const HostComponent = 5;
// div下的文本
export const HostText = 6;
