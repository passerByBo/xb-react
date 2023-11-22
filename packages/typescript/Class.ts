// ts中的class相比js中的class 增加了类型的注释和一些其他的语法

// class的成员如果没有定义默认为any，也可以设置初始值 当被实例化后将会自动运行
// 初始值可以推断类型
class Point {
	x = 0;
	y = 0;
}

const p1 = new Point();

// 声明的属性必须再本身内部进行实例化，派生类会对该属性或者方法进行重写但是不一定会进行初始化
class GoodGreeter {
	name: string;

	constructor(name: string) {
		// 再构造函数中进行初始化
		this.name = name;
	}
}

// 如果打算再构造函数以外的其他地方进行属性的初始化 可以使用非空断言
class OKGreeter {
	// Not initialized, but no error
	name!: string;
}

// 属性可以增加readonly操作符 将属性或者方法定义为只读的

// 类的构造器与函数非常相似，可以添加类型注释、默认值和重载参数
class Point2 {
	x: number;
	y: number;

	// Normal signature with defaults
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Point3 {
	// Overloads
	constructor(x: number, y: string);
	constructor(s: string);
	constructor(xs: any, y?: any) {
		// TBD
	}
}

// 构造函数不能有类型参数和返回值

// typescript 如果要调用基类的构造器函数 可以使用和javascript同样的方式 super()

// Getter/Setter
class C {
	_length = 0;
	get length() {
		return this._length;
	}
	set length(value) {
		this._length = value;
	}
}
//   - 如果存在get 没有set 那么该属性为只读
// - 如果没有指定set，则从getter的返回值类型推断类型
// getter  setter必须含有相同的成员可见性 provide protected等访问控制器定义

// class可以声明索引签名，和其他对象类型类似

// 索引签名需要捕获方法的类型。所以为了更有效的使用这些类型比较麻烦 最好将索引数据存在其他的基类或者接口中
class MyClass {
	[s: string]: boolean | ((s: string) => boolean);

	check(s: string) {
		return this[s] as boolean;
	}
}

// 和其他面向对象编程一样的是，可以通过实现interface来扩展class

interface Pingable {
	ping(): void;
}

class Sonar implements Pingable {
	ping(): void {
		console.log('Ping ');
	}
}
class Ball implements Pingable {
	pong() {}
}

// 类可以实现多接口 类似class C implements A, B{}

// 常见错误
// 定义一个interface，class 实现了这个基类   class中实现的属性中参数的类型不能正常推断出来
interface Checkable {
	check(name: string): boolean;
}
// 是否基于其他的接口实现并不会影响class中属性和方法的推断方式
class NameChecker implements Checkable {
	// class 自己的推断 和interface 无关
	check(s) {
		return s.toLowerCase() === 'ok';
	}
}

interface A {
	x: number;
	y?: number;
}
// 实现的时候需要把inteface的所有属性都实现一遍 所以子类型中类型的检测不会参照interface
class C2 implements A {
	x = 0;
}
const c = new C();
c.y = 10;

// extends继承
// 类可以从其他类扩展，派生类具有基类的所有属性和方法，并且可以扩展成员属性和方法
class Animal2 {
	move() {
		console.log('Moving along!');
	}
}
class Dog extends Animal2 {
	woof(times: number) {
		for (let i = 0; i < times; i++) {
			console.log('woof!');
		}
	}
}

const d = new Dog();
// Base class method
d.move();
// Derived class method
d.woof(3);

// 方法重写
// 派生类可以重写基类的属性和方法
// 虽然可以重写基类的方法 但是派生类永远是基类的子类型

class Base {
	greet() {
		console.log('Hello, world!');
	}
}

class Derived extends Base {
	// 扩展的类型也必须是子类型 能包含基类
	greet(name?: string) {
		if (name === undefined) {
			super.greet();
		} else {
			console.log(`Hello, ${name.toUpperCase()}`);
		}
	}
}

//基类可以赋值给子类  子类可以赋值给基类
let b: Base = new Derived();
let c3: Derived = new Base();
// 可以通过基类引用派生类

const d = new Derived();
d.greet();
d.greet('reader');

// 派生类如果不遵守基类的规则，那么实例也没法正常使用
// 当设置target >= ES2022或者设置useDefineForClassFields=true的时候
// 构造函数完成字段的初始化，如果只是想给字段声明更具体的类型 那么可以使用declare  定义后的类型不具备运行时的效果
interface Animal2 {
	dateOfBirth: any;
}

interface Dog extends Animal2 {
	breed: any;
}

class AnimalHouse {
	resident: Animal2;
	constructor(animal: Animal2) {
		this.resident = animal;
	}
}
class DogHouse extends AnimalHouse {
	// Does not emit JavaScript code,
	// only ensures the types are correct
	//可以在构造函数中对其进行重新赋值，覆盖父类型中的字段
	// 进行重新声明定义 只具备定义更准确的功能 而不是覆盖
	declare resident: Dog;
	constructor(dog: Dog) {
		super(dog);
		// 增加该代码进行覆盖
		//   this.resident = dog
	}
}

//字段赋值顺序 构造函数执行顺序
// 1、基类字段初始化
// 2、基类构造函数执行
// 3、派生类字段初始化
// 4、派生类构造函数执行
class Base3 {
	name = 'base';
	constructor() {
		console.log('My name is ' + this.name);
	}
}

class Derived3 extends Base3 {
	name = 'derived';
}

// Prints "base", not "derived"
const d3 = new Derived3();
// 基类看到的是自己内部的name  派生类还未初始化

// 继承js内部的一些基类Map Error Array等
class MsgError extends Error {
	constructor(m: string) {
		super(m);
	}
	sayHello() {
		return 'hello ' + this.message;
	}
}

const m3 = new MsgError('work');
m3.sayHello();

// es2015中隐式的将this的值替换为super的调用方，生成的构造函数需要捕获super潜在的返回值将其替换为this
// 手动修正原型
class MsgError2 extends Error {
	constructor(m: string) {
		super(m);

		// Set the prototype explicitly.
		Object.setPrototypeOf(this, MsgError.prototype);
	}

	sayHello() {
		return 'hello ' + this.message;
	}
}
