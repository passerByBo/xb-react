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

// 推断过程和传入和绑定的值相关 优先级高于后
const m1 = minimuLength([1, 2, 3], 6);
const m2 = minimuLength('heool', 6);

//可以让typescript自行推断 也可以手动执行泛型的类型 来修改ts的自动推断结果

// 过多的类型参数或者在不需要的地方使用约束会让函数的使用者无法很很好的进行类型推断

// 定义的时候如果做了类型的约束，那么会影响调用期间动态的类型元素解析
// 使用类型参数本身 不做过多的约束 ts可以更好的在调用的时候做类型推断
function firstElement1<Type>(arr: Type[]) {
	return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
	return arr[0];
}
// a: number (good)
const f1 = firstElement1([1, 2, 3]);
// b: any (bad)
const f2 = firstElement2([1, 2, 3]);

// 不使用过多的函数，使用尽可能少的类型参数
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
	return arr.filter(func);
}

function filter2<Type, Func extends (arg: Type) => boolean>(
	arr: Type[],
	func: Func
): Type[] {
	return arr.filter(func);
}

// 不便于查看 效果相同
filter1([1, 2, 3, 4], (a) => a);
filter2([1, 2, 3, 4], (a) => a);

// 类型参数用于关联多个值，如果只使用一次 可以直接定义类型

// 可选参数使用? 操作符 定义在变量后， 也可以使用默认参数
// 回调函数中不编写可选参数

function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
	for (let i = 0; i < arr.length; i++) {
		callback(arr[i], i);
	}
}
myForEach([1, 2, 3], (a) => console.log(a));
myForEach([1, 2, 3], (a, i) => console.log(a, i));

function myForEach2(arr: any[], callback: (arg: any) => void) {
	for (let i = 0; i < arr.length; i++) {
		// I don't feel like providing the index today
		callback(arr[i]);
	}
}

// 函数重载
// 函数的实现必须能兼容到所有的重载， 含有两个重载实例，函数调用时会检测重载的类型，以重载的类型为准
// 避免重载前面和实现签名不符合
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
	if (d !== undefined && y !== undefined) {
		return new Date(y, mOrTimestamp, d);
	} else {
		return new Date(mOrTimestamp);
	}
}

// 函数如果有相同的参数数量和返回值，可以考虑使用联合类型的参数而不是函数的重载
// 能使用联合类型的参数就使用联合类型，不需要函数去查找重载类型
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
	return x.length;
}

len('');
len([]);

// 运行时的时候才能确定传入的参数，typescript只能将函数调用解析为单个重载
len(Math.random() > 0.5 ? '' : []);

// 函数中的this

const user = {
	id: 123,

	admin: false,
	becomeAdmin: function () {
		this.admin = true;
	}
};
type User = typeof user;
interface DB {
	filterUsers(filter: (this: User) => boolean): User[];
}

function getDB(): DB {
	return {
		filterUsers: (fn: () => boolean) => [user]
	};
}

const db = getDB();

// javascript 不允许自定义this  this为关键词，所以typescript定义一个this参数可以在函数的作用域中使用this
// 这种模式在回调函数的api中很有用
// 这里去掉this的显式定义也不会有错误提示，可能是tsconfig的配置有关系
const admins = db.filterUsers(function (this: User) {
	return this.admin;
});

// void 不同于 undefined js默认无返回值会返回undefined ts无返回值为void
// object不同与Object 在ts中基本上不会使用到Object  大写字母开头的为javbascript的类型  小写字母开头为ts的类型
// unknown类型可以表示任何类型，但是i更安全，unknown类型不可以进行任何操作，但是可以返回unknown类型
// Function 表示的太大 只针对 可调用等基础属性 bind call apply 如果要使用可以使用() => void 替代

// 剩余参数和扩展语法

// Inferred type is number[] -- "an array with zero or more numbers",
// not specifically two numbers
// 参数如果有数量限制，使用扩展语法行不通，可以使用as const 转换成常量类型就可以进行正确的推断
const args = [8, 5] as const;
const angle = Math.atan2(...args);

// 对象参数遵循解构语法

// 如果函数类型返回值类型定义为void  但是还是可以正常返回数据
type voidFunc = () => void;

const v1: voidFunc = () => true;
const v2: voidFunc = function () {
	return true;
};

//返回值为void类型
const vv1 = v1();
const vv2 = v2();

// 这种行为会导致如下的操作是有效的
const src = [1, 2, 3];
const dst = [0];
// forEach定义的函数返回值为void这里直接使用push语法作为返回值也是不会报错的
src.forEach((el) => dst.push(el));

// 函数通过function定义，上面可以不报错是因为函数通过名称定义赋值的
function ffd2(): void {
	return true;
}

const ffd3 = function (): void {
	return true;
};
