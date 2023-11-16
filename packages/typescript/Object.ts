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