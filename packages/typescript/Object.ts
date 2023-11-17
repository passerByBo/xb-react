// 匿名函数 interface type 都可以用来定义描述对象的类型
// 可选属性 ?

// strictNullCheck 开启  可选属性在读取和使用的时候会提示可能不存在

interface PaintOptions {
	shape: Shape;
	xPos?: number;
	yPos?: number;
}

function paintShape(opts: PaintOptions) {
	//number
	let xPos = opts.xPos === undefined ? 0 : opts.xPos;
	//number | undefined
	let yPos = opts.yPos;
}

// 可以指定默认值，可以减少后续的空判断

// 解构+匿名或者具名类型

// 只读属性不会影响对象的兼容
interface Person {
	name: string;
	age: number;
}

interface ReadonlyPerson {
	readonly name: string;
	readonly age: number;
}

let writablePerson: Person = {
	name: 'Person McPersonface',
	age: 42
};

// works
let readonlyPerson: ReadonlyPerson = writablePerson;

// -readonly 删除readonly限制

// 索引签名
// 如果传入数字可以推断出获取到的属性为string类型
interface StringArray {
	[index: number]: string;
}

// 可以同时支持两种索引签名（字符串索引和数字索引）但是同时使用的时候必须数字索引为字符串索引的子类型，索引使用的时候先转为字符串然后使用
interface Animal2 {
	name: string;
}

interface Dog2 extends Animal2 {
	breed: string;
}

//同时使用的时候必须数字索引为字符串索引的子类型，索引使用的时候先转为字符串然后使用
interface NotOkay {
	[x: number]: Animal2;
	[x: string]: Dog2;
}

interface NumberDic {
	[index: string]: number;
	length: number;
	// 字符串索引已经包含了name  值和索引类型不匹配
	name: string;
}

interface NumberDic2 {
	// 使用联合类型规避
	[index: string]: number | string;
	length: number;
	name: string;
}

// 索引签名可以设置为只读，防止篡改

interface ReadonlyStringArray {
	[index: number]: string;
}

let myArray: ReadonlyStringArray = ['1', '2', '3'];
// 索引签名只读
myArray[2] = 'Mallory';

// Excess Property Checks
// 超出参数检测
interface SquareConfig {
	color?: string;
	width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
	return {
		color: config.color || 'red',
		area: config.width ? config.width * config.width : 20
	};
}

let mySquare = createSquare({ colour: 'red', width: 100 });
// 可以使用类型断言 绕过检查 或者类型定义增加索引签名涵盖所以的字符串索引的可能性
let mySquare2 = createSquare({ colour: 'red', width: 100 } as SquareConfig);

// 使用额外的数据接一下  squareOptions不会进行额外的类型检查， 这里如果删除width 那么同样汇报错
// 只要包含一个满足条件的公共属性 重合  那么就会是宽泛的检查，不会检查额外的属性
let squareOptions = { colour: 'red', width: 100 };
let mySquare3 = createSquare(squareOptions);

// interface可以继承，如果有对象扩展可以使用interface的继承

// 使用交集 &运算符
interface Colorful {
	color: string;
}
interface Circle {
	radius: number;
}

type ColorfulCircle = Colorful & Circle;

// 使用interface的继承和 交叉类型的区别是  处理解决冲突  inteface子类型的优先级更高，交叉类型 定义在后面的优先级更高

// 可以使用interface的泛型和type的泛型来定义对象

// 只读的数组，但是不可以当做构造器使用
const ra: ReadonlyArray<number> = [1, 2, 3, 4];
ra[1] = 3;
// 也可以使用Array简写方式定义
const ra2: readonly number[] = [1, 2, 3, 4];
ra2[1] = 3;

// 需要注意与只读属性修饰符不同  只读数组和常规数组 赋值不是双向的
let x: readonly string[] = [];
let y: string[] = [];
x = y;
y = x;

// 元组是一种特殊的数组类型，元祖知道含有多少个元素并且每个位置上都有什么不同的元素类型
// 元祖可以包含不同类型的元素
// 元祖可以通过数组解构来解构元素

// 自定义  简易元组
interface StringNumberPair {
	length: 2;
	0: string;
	1: number;

	slice(start?: number, end?: number): Array<string | number>;
}

const snp: StringNumberPair = ['1', 2];

// 元组的可选属性
// 可选属性必须放到最后
type Either2dOr3d = [number, number, number?];
function setCoordinate(coord: Either2dOr3d) {
	const [x, y, z] = coord;
}
// 元祖也可以是用剩余元素 rest

function readButtonInput(...args: [string, number, ...boolean[]]) {
	const [name, version, ...input] = args;
	// ...
}

// 元组 只读
function doSomething(pair: readonly [string, number]){

}

// 常量元组
let point = [3, 4] as const;
// 赋值的时候父类型可以赋值给子类型    子类型不能赋值给父类型
function distanceFromOrigin([x, y]: [number, number]) {
  return Math.sqrt(x ** 2 + y ** 2);
}
 
distanceFromOrigin(point);
