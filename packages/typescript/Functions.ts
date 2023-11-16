// 函数除了可调用之外 还可以增加属性
type DescribableFunction = {
	description: string;
	// 调用签名
	(someArg: number): boolean;
	// 构造器签名
	new (): any;
};

type fn = () => void;

function doSomething(fn: DescribableFunction) {
	fn.description;
	fn(3);
}

// 使用泛型函数自动推断传入和返回的类型

function firstElement<T>(arr: T[]): T | undefined {
	return arr[0];
}
const s = firstElement(['a', 'b', 'c']); // string undefined
const n = firstElement([1, 2, 3]); // number undefined
const u = firstElement([]); // undefined

// 函数定义成根据调用传入的数据进行推断
function map<Input, Output>(
	arr: Input[],
	func: (arg: Input) => Output
): Output[] {
	return arr.map(func);
}

const parsed = map(['1', '2'], (n) => parseInt(n));

// 函数自动推断 增加限制 因为传入的数据类型未知 所以要在这里增加限制 因为函数内部使用了该属性 如果不限制 会报属性错误
function longest<Type extends { length: number }>(a: Type, b: Type) {
	if (a.length >= b.length) {
		return a;
	} else {
		return b;
	}
}

const longerArray = longest([1, 2], [1, 2, 3]);
const longerString = longest('alice', 'bob');
const notOK = longest(10, 100);

// 使用受限制的值
function minimuLength<Type extends { length: number }>(
	obj: Type,
	minimum: number
): Type {
	if (obj.length >= minimum) {
		return obj;
	} else {
		// 如果明确规定返回的类型就会强制检查返回值的类型，如果成功的话返回的数据没有任何意义 类型范围扩大不行
		// obj限制的子类型可以赋值成功
		return { length: minimum };
	}
}
