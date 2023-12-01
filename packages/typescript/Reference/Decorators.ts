import 'reflect-metadata';

// ---------------------------------------装饰器-----------------------------------------
// 5.0和4.x版本的装饰器有大的更新
// 装饰起提供了为类声明和成员添加注释以及元编程的方式

// tsconfig开启装饰器支持   experimentalDecorators

// 装饰器可以单行和多行使用 如下可以看作是f(g(x)) 函数嵌套执行的结果
// @f @g x
// @f
// @g
// x

// 装饰器执行 自顶向下
// 装饰器的返回值  自底向上

// 装饰器工厂定义
function first() {
	console.log('first(): factory evaluated');
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		console.log('first(): called');
	};
}

function second() {
	console.log('second(): factory evaluated');
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		console.log('second(): called');
	};
}

class ExampleClass {
	@first()
	@second()
	method() {}
}

// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called

// 1、参数装饰器
// 2、方法装饰器
// 3、属性装饰器
// 4、访问器装饰器
// 5、构造器装饰器
// 6、类装饰器

// 类的装饰起应用于类的构造函数，可用于查看、修改、替换类的定义
// 类装饰器将在运行时作为函数被调用，类的构造函数为装饰器的参数
function sealed(constructor: Function) {
	Object.seal(constructor);
	Object.seal(constructor.prototype);
}
@sealed
class BugReport {
	type = 'report';
	title: string;

	constructor(t: string) {
		this.title = t;
	}
}

// 装饰器 给类的构造器添加默认值
function reportableClassDecorator<T extends { new (...arg: any): {} }>(
	constructor: T
) {
	return class extends constructor {
		reportingURL = 'http:www.....';
	};
}

@reportableClassDecorator
class BugReport2 {
	type = 'report';
	title: string;

	constructor(t: string) {
		this.title = t;
	}
}

const bug = new BugReport2('Needs dark mode');
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"
// 装饰器不会改变类型系统
bug.reportingURL;

// 方法装饰器
// 方法装饰器应用于方法的属性描述，修改和替换方法的定义
function enumerable(value: boolean) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		// 修改方法的可枚举属性
		descriptor.enumerable = value;
	};
}
class Greeter {
	greeting: string;
	constructor(message: string) {
		this.greeting = message;
	}

	@enumerable(false)
	greet() {
		return 'Hello, ' + this.greeting;
	}
}

// 存取器的装饰器
// 应用于访问器的属性描述，可以修改替换访问器的定义
// 参数说明
// 1、静态成员类的构造函数或者实例成员的类的原型
// 2、成员的名称
// 3、成员的属性描述符

class Point5 {
	private _x: number;
	private _y: number;

	constructor(x: number, y: number) {
		this._x = x;
		this._y = y;
	}

	get x() {
		return this._x;
	}

	get y() {
		return this._y;
	}
}

// 修改descriptor的 可配置属性
function configurable(value: boolean) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		descriptor.configurable = value;
	};
}

// 属性装饰器
// 属性装饰器在运行时当作函数调用，两个参数如下：
// 1、静态成员类的构造函数，或者实例成员的类的原型
// 2、成员的名称
// 属性的元数据
class Greeter7 {
	@format('Hello, %s')
	greeting: string;
	constructor(message: string) {
		this.greeting = message;
	}
	greet() {
		let formatString = getFormat(this, 'greeting');
		return formatString.replace('%s', this.greeting);
	}
}

const formatMetadataKey = Symbol('format');
function format(formatString: string) {
	// 设置元数据库中的数据
	return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
	// 读取元数据库中的数据
	return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

//   参数装饰器
// 应用于构造函数或者是方法声明的函数参数中
// 3个参数
// 1、类的构造函数或者是实例的类的原型
// 2、成员名称
// 3、函数参数的序号索引
// 忽略返回值
class BugReport4 {
	type = 'report';
	title: string;

	constructor(t: string) {
		this.title = t;
	}

	@validate
	print(@required verbose: boolean) {
		if (verbose) {
			return `type: ${this.type}\ntitle: ${this.title}`;
		} else {
			return this.title;
		}
	}
}

const requiredMetadataKey = Symbol('required');
function required(
	target: Object,
	propertyKey: string | symbol,
	parameterIndex: number
) {
	let existingRequiredParameters: number[] =
		Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
	existingRequiredParameters.push(parameterIndex);
	Reflect.defineMetadata(
		requiredMetadataKey,
		existingRequiredParameters,
		target,
		propertyKey
	);
}

// 方法装饰器
function validate(
	target: any,
	propertyName: string,
	desciptor: TypedPropertyDescriptor<Function>
) {
	let method = desciptor.value!;
	desciptor.value = function () {
		let requiredParameters: number[] = Reflect.getOwnMetadata(
			requiredMetadataKey,
			target,
			propertyName
		);
		if (requiredParameters) {
			for (let parameterIndex of requiredParameters) {
				if (
					parameterIndex >= arguments.length ||
					arguments[parameterIndex] === undefined
				) {
					throw new Error('Missing required argument.');
				}
			}
		}
		return method.apply(this, arguments);
	};
}

// Metadata 元数据  元编程

// 如果要使用元编程需要安装插件
// npm install reflect-metadata --save

// tsconfig中增加配置emitDecoratorMetadata  experimentalDecorators
// {
// 	"compilerOptions": {
// 	  "target": "ES5",
// 	  "experimentalDecorators": true,
// 	  "emitDecoratorMetadata": true
// 	}
//   }
