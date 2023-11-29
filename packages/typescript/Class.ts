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

// 成员可见性
// 属性可以设置public protected provide 设置属性或者方法成员可见性

// public默认的所有成员可见
// protected 自身和子类中可访问  子类实例也不可以访问
class Base2 {
	protected x: number = 1;
}
class Derived1 extends Base2 {
	protected x: number = 5;
}
class Derived2 extends Base2 {
	// 继承过来的  子类内部可以访问
	f1(other: Derived2) {
		other.x = 10;
	}
	// 访问的是Derived1实例的属性  不在Derived1的定义中 所以不可以访问
	f2(other: Derived1) {
		other.x = 10;
	}
}

//   provite 不允许在自身实例中访问，也不允许衍生类中使用 只能在自己内部使用
class Base4 {
	private x = 0;
}
// 不允许再次进行定义 protected允许进行定义
class Derived4 extends Base4 {
	x = 1;
}

// ts允许使用夸实例访问私有属性没有报错
class Z {
	private x = 10;

	public sameAs(other: Z) {
		// No error
		// 跨实例访问私有属性
		return other.x === this.x;
	}
}

// 只做静态类型检查如果在JavaScript中使用  还是会允许打印
class MySafe {
	private secretKey = 12345;
}
// In a JavaScript file...
const s111 = new MySafe();
// Will print 12345
console.log(s111.secretKey);
// 通过i这种方法还是可以访问到该属性
console.log(s111['secretKey']);

// javascript 使用#开头定义私有的属性和方法
// 编译到es2021 或者更低的版本时 ts将使用weakMap代替#做私有化定义
// 闭包 weakMap 私有字段等 实现内部不可改变的属性   但是会有一定的性能损耗
// "use strict";
// var _Dog_barkAmount;
// class Dog111 {
//     constructor() {
//         _Dog_barkAmount.set(this, 0);
//         this.personality = "happy";
//     }
// }
// _Dog_barkAmount = new WeakMap();

// 静态成员
// 静态成员通过构造函数本身进行访问
// 静态成员可以通过
class MyClass111 {
	static x = 0;
	static printX() {
		console.log(MyClass111.x);
	}
}

// 静态属性可以继承
class Base5 {
	static getGreeting() {
		return 'hello word';
	}
}

class Derived5 extends Base5 {
	// 静态属性继承
	myGreeting = Derived5.getGreeting();
}

class S {
	// 与内置的name冲突
	// 构造函数可能会调用内部自身的name 通过name去调用等场景
	static name = 'S!';
}

// static class 是应为其他语言强制要求数据和方法必须再class中 ts没有这种限制 所以就不存在static class
// Unnecessary "static" class
class MyStaticClass {
	static doSomething2() {}
}

// Preferred (alternative 1)
function doSomething2() {}

// Preferred (alternative 2)
const MyHelperObject = {
	dosomething2() {}
};

// 静态块允许使用自己作用域中编写的私有属性和方法，可以使用该功能初始化代码并且不会泄露变量，允许完全访问类内部的结构
class Foo {
	static #count = 0;

	get count() {
		return Foo.#count;
	}

	static {
		try {
			const lastInstances = loadLastInstances();
			Foo.#count += lastInstances.length;
		} catch {}
	}
}

// 编写通用类  类和接口类似可以使用泛型  new实例化泛型类时 类新的推断方式和函数的推断类似
class Box<Type> {
	contents: Type;
	constructor(value: Type) {
		this.contents = value;
	}
}
// 类型自动推断
const b2 = new Box('hello!');

// 类运行时的this
class MyClass2 {
	name = 'MyClass';
	getName() {
		return this.name;
	}
}
const c22 = new MyClass2();

const obj = {
	name: 'obj',
	getName: c22.getName
};

// Prints "obj", not "MyClass"
// this是运行时动态绑定的  调用者是obj 所以name也就是obj的name
console.log(obj.getName());

//   为了避免如上的问题，可以使用箭头函数，箭头函数的this取决于定义它的位置
// 使用箭头函数的定义方式  再派生类中无法获取基类的方法 this永远指向基类的实例中
class MyClass3 {
	name = 'MyClass';
	getName = () => {
		return this.name;
	};
}
const c33 = new MyClass3();
const g3 = c33.getName;
// Prints "MyClass" instead of crashing
// 这里函数赋值给g3 window.g3 但是依然能输出name MyClass
console.log(g3());

//   ts的函数中  定义this的类型很有用 编译成javascript会自动过滤this参数的定义
// TypeScript input with 'this' parameter
function fn45(this: SomeType, x: number) {
	/* ... */
}
// JavaScript output
function fn46(x) {
	/* ... */
}

// ts检查this 通过上下文确定，如果不想使用箭头函数 并且需要保证this的正确性，可以参数顶强制指定this的类型
// 可以继续使用super让基类进行调用
// 函数绑定到类上而不是具体的实例上
class MyClass4 {
	name = 'MyClass';
	getName(this: MyClass4) {
		return this.name;
	}
}
const c4 = new MyClass4();
// OK
// 正常可以调用
c4.getName();

// Error, would crash
const g = c4.getName;
// 错误的调用会提示错误
// 根据上下文推断this的指向不正确
console.log(g());

// 动态推断this
class Box2 {
	contents: string = '';
	set(value: string) {
		this.contents = value;
		return this;
	}
}

class ClearableBox extends Box2 {
	clear() {
		this.contents = '';
	}
}

const a12 = new ClearableBox();
// 推断出的b12为ClearableBox类型 而不是Box2类型
const b12 = a12.set('123');

// this可以推断运行时的对象

// 参数传递的时候根据运行时推断出的this 如果是基类 只能传入基类的实例
class Box3 {
	content: string = '';
	sameAs(other: this) {
		return other.content === this.content;
	}
}

class DerivedBox extends Box3 {
	otherContent: string = '?';
}

const base = new Box3();
const derived = new DerivedBox();
// 只能接受同一个派生类的实例  基类不满足条件
derived.sameAs(base);

// this类型安全  类型收缩
// 可以再类和接口的方法的返回值使用this is Type 对返回值i类型进行收缩 将this缩小范围到指定的类型

// class FileRep{}
// class Directory{}
// class NetWorked{}
class FileSystemObject {
	isFile(): this is FileRep {
		return this instanceof FileRep;
	}
	isDirectory(): this is Directory {
		return this instanceof Directory;
	}
	isNetworked(): this is Networked & this {
		return this.networked;
	}
	// 加了访问修饰符的自动添加到实例中，如果没有添加访问修饰符需要手动进行赋值
	constructor(
		public path: string,
		private networked: boolean
	) {}
}

class FileRep extends FileSystemObject {
	constructor(
		path: string,
		public content: string
	) {
		super(path, false);
	}
}

class Directory extends FileSystemObject {
	children: FileSystemObject[] = [];
}
const fso: FileSystemObject = new FileRep('foo/bar.txt', 'foo');
interface Networked {
	host: string;
}
// 根据条件缩减推断出具体的类型
if (fso.isFile()) {
	// fso FileRep
	fso.content;
} else if (fso.isDirectory()) {
	// fso Directory
	fso.children;
} else if (fso.isNetworked()) {
	// fso Networked & FileSystemObject
	fso.host;
}

// this的类型保护 常见的使用时对特定字段进行惰性验证（运行时） 当hasValue为true 这种情况会从box删除一个未定义value
class Box5<T> {
	value?: T;
	hasValue(): this is { value: T } {
		return this.value !== undefined;
	}
}

const box5 = new Box5();
box5.value = '123';
// 可选的
box5.value;
if (box5.hasValue()) {
	// ? 可选属性被删除
	box5.value;
}

// ts可以将构造函数的参数转换为相同名称的实例属性，添加访问修饰符即可 public private protected readonly

// 使用表达式的方式定义类
const someClass = class {};

// 构造函数签名  InstanceType
class Point4 {
	createdAt: number;
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.createdAt = Date.now();
		this.x = x;
		this.y = y;
	}
}

// 泛型参数为类型 这里class 属于值
type PointInstance = InstanceType<typeof Point4>;
function moveRight(point: PointInstance) {
	point.x += 5;
}

const point4 = new Point4(3, 4);
moveRight(point4);
point4.x; // => 8

//   抽象类和成员
// ts中类和方法以及字段可以是抽象的
// 抽象方法或者抽象字段是指未提供实现的方法和字段，这些成员必须存在于不能实例化的抽象类中
// 抽象类 所有抽象成员组成的抽象类 作为其他类型的基类
abstract class Base6 {
	abstract getName(): string;

	printName() {
		console.log('Hello, ' + this.getName());
	}
}

//   抽象类不可以实例化
const b6 = new Base6();
// 抽象类中的抽象属性和方法必须实现
class Derived6 extends Base6 {
	getName() {
		return 'world';
	}
}

const d6 = new Derived6();
d6.printName();

// 接受某个抽象类为构造函数 创建实例
function greet7(ctor: typeof Base6){
	// 提示抽象类不可以进行实例化
	const instance  = new ctor()
	instance.getName()
}

// 使用得时候不会报错 但是不推荐使用
greet7(Base6);

// 优化提示  使用的时候报错
// new () => Base6缩小范围  new构造器
// 派生类约束
function greet8(ctor: new () => Base6){
	const instance  = new ctor()
	instance.getName()
}
// 提示抽象类不可实例化 不满足条件
greet8(Base6);
// 抽象类的子类可以
greet8(Derived6);

// 类型通过结构进行比较如果相同可以进行赋值操作
// 通过结构判断 即使没有显式的继承关系也存在父子类的关系

// 空类没有成员 再结构系统中 没有成员的类型是任何其他类型的 超类型 如果编写一个空的类型  任何实例都可以赋值给他 都是它的子类型
class Empty{}
function fn10(x: Empty){

}

fn10({})
fn10(fn10)
fn10(window)
fn10(1)