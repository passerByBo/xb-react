// 迭代器和生成器

// 如果对象有Symbol.iterator的实现 则说明该对象是可迭代的

function toArray<X>(xs: Iterable<X>): X[] {
	return [...xs];
}


const a1 = toArray('111')
const a2 = toArray(['111'])
// 可迭代 校验不通过
const a3 = toArray(111)