// 静态类型系统描述程序在运行时的行为和内容

type a = 1;

type b = 1 extends a ? true : false;

// ts会根据上下文代码的分支逻辑  推断出所在分支缩紧后的分支类型
// 类型守卫  类型收窄
// typeof
// Array.isArray
// !操作符判断是否存在 非空断言
// === !== != ==switch语句缩小范围
// in操作符 用于确定对象或者原型链上是否存在该属性
// instanceof 操作符  判断原型链中是否包含 被判断对象的prototype
// 赋值操作  给变量赋值的时候会缩小左侧变量的类型范围
// use this is type 可以缩小class中的范围

// 流程控制 和如上推断分支相同  控制流分析 当分析到一个变量时 控制流可以合并和分离并且观察该变量再每个点具有的不同类型

// 当类型缩小到没有的时候  会推断为never类型

// 类型谓词 is操作符
function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim !== undefined;
}

// 通过类型谓词判断后的pet 不仅能推断出来Fish 后续的分支逻辑中也能推断出Bird
// if (isFish(pet)) {
// 	pet.swim();
//   } else {
// 	pet.fly();
//   }

function example(x: string | number, y: string | boolean) {
	// 根据判断条件 自动推算出x y的类型
	if (x === y) {
		x.toLocaleLowerCase(); // x string
		y.toLocaleLowerCase(); // y string
	} else {
		console.log(x); // string | number
		console.log(y); // string | boolean
	}
}

// 非严格的比较过滤
interface Container {
	value: number | null | undefined;
}

function multiplyValue(container: Container, facotory: number) {
	if (container.value != null) {
		console.log((container.value *= facotory)); // value 是number类型 过滤了null和undefined
	}
}

type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
	if ('swim' in animal) {
		return animal.swim();
	}

	return animal.fly();
}

Boolean('hello'); // 类型转换 type boolean value true
!!'hello'; // 隐式类型转换 type true value true

// 结构化类型系统

// 接口和类型定义的区别  接口可扩展性更强
// 类型可以使用&符号进行扩展
type Animal = {
	name: string;
};

type Bear = Animal & {
	honey: boolean;
};

// interface 多次定义可自动合并， 类型则是会报错提示重复定义

// 断言只允许断言成更具体的子类型或者更不具体的大类型， 如果要强行进行类型断言 可以双层断言进行操作

// const x = 'hello' as number;

// let var 声明的类型是 基础类型  const声明的字符串是字符串常量类型

// let letStr = 'str';
// const cStr = 'cStr';

declare function handleRequest(url: string, method: 'GET' | 'POST'): void;
const req = { url: 'https://example.com', method: 'GET' } as const;
handleRequest(req.url, req.method);

// 可以使用类型断言
// 也可以使用as const将整个对象转换为文本类型

//strictNullChecks
// 建议开启， null和undefined可以赋值给任何类型，如果不开启检查会错过很多运行时错误， 开启后代码中需要增加对空的判断

// typescript语法不显示检验null和undefined
function liveDangerously(x?: number | null) {
	// No error
	console.log(x!.toFixed());
}

// const firstName = Symbol('name');
// const secondName = Symbol('name');

// if (firstName === secondName) {
// 	// Can't ever happen
// }

// ---------------------------------------------- 联合类型------------------------------------------------
// interface Shape {
// 	kind: 'circle' | 'square';
// 	radius?: number;
// 	sideLength?: number;
// }

// function getArea(shape: Shape) {
// 	if (shape.kind === 'circle') {
// 		// 使用非空断言 使用可选属性
// 		return Math.PI * shape.radius! ** 2;
// 	}
// }

interface Circle {
	kind: 'circle';
	radius: number;
}

interface Square {
	kind: 'square';
	sideLength: number;
}

// 可辨识的联合类型 通过判断常量类型来缩小范围
type Shape = Circle | Square;

// function getArea(shape: Shape) {
// 	if (shape.kind === 'circle') {
// 		//
// 		return Math.PI * shape.radius ** 2;
// 	}
// }

// function getArea(shape: Shape) {
// 	switch (shape.kind) {
// 		case 'circle':
// 			shape.radius;
// 			break;
// 		case 'square':
// 			break;
// 	}
// }

function getArea(shape: Shape) {
	switch (shape.kind) {
		case 'circle':
			return Math.PI * shape.radius ** 2;
		case 'square':
			return shape.sideLength ** 2;
		default:
			shape; // never 类型
	}
}
