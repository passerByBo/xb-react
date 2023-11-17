// ----------------------------------------泛型-------------------------------------------
// 泛型
function identity<Input>(arg: Input): Input {
	return arg;
}

let myIdentity: <Input>(arg: Input) => Input = identity;

//  泛型可以编写成对象的类型

let myIdentity2: {
	// 函数的调用签名
	<Input>(arg: Input): Input;
} = identity;

// 接口类型
interface GenericIdentityFn {
	<Type>(arg: Type): Type;
}

// class使用泛型
class GenericNumber<NumType> {
	zeroValue: NumType;
	add: (x: NumType, y: NumType) => NumType;
}

// class的 类型分两个方面  静态和实例的类型，泛型只针对于实例的类型，不能作用于静态成员

// 为了在类中使用一些公共的属性和方法，那么就需要给传入的泛型进行类型约束 使用extends关键字

function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
	return obj[key];
}

let x1 = { a: 1, b: 2, c: 3 };

getProperty(x1, 'm');
getProperty(x1, 'a');

// 工厂函数
function create<Type>(c: { new (): Type }) {
	return new c();
}

type MyContainer<T, U> = {
	children: U;
	element: T;
};

declare function myCreate<T extends HTMLElement = HTMLElement, U = T>(
	element?: T,
	children?: U
): MyContainer<T, U>;

const div = myCreate();
const p = myCreate(new HTMLParagraphElement());

// type AA<T extends string  = '1'> = {
//     a: string
// }

// type BB = {
//     a: string
// } & AA

// const AAA: BB = {
//     a: '2'
// }

// 泛型如果有默认值则认为它是可选的
// 可选参数不能赋值给必填参数
// 如果存在泛型约束那么默认的类型必须满足约束
// 类型参数如果未指定，则会显示ts推断出的类型
// 当推断的类型和默认指定的类型冲突，以默认指定的类型为准

// ----------------------------------------keyof-------------------------------------------
// keyof操作符可以获取对象类型的key的联合类型

//如果含有索引签名 会返回索引对应的类型
type Arrish = { [n: number]: unknown };
type Arrish2 = { [n: string]: unknown };
// number
type keyofArrish = keyof Arrish;
// string和number
type keyofArrish2 = keyof Arrish2;
// ----------------------------------------typeof------------------------------------------
// 获取值或者属性的类型
// 类型编程中 js的值和类型不是一回事 无法参与到类型的推断中   所以可以使用typeof获取值和属性的类型 从而参与到类型的推断中

// 使用限制：在值即变量名或者属性上使用才是合法的

// ----------------------------------------index索引类型-------------------------------------------
// 使用索引类型可以获取到属性的类型
type Person2 = { age: number; name: string; alive: boolean };
type Age = Person2['age'];

// 通过索引可以获取到联合类型
type I1 = Person2['age' | 'name'];
type I2 = Person2[keyof Person];
type AliveOrName = 'alive' | 'name';
type I3 = Person2[AliveOrName];
// 如果尝试索引不存在的类型将会报错
type I4 = Person2['a'];
// 使用number来获取数组元素的索引
const MyArray = [
	{ name: 'Alice', age: 15 },
	{ name: 'Bob', age: 23 },
	{ name: 'Eve', age: 38 }
];

type Person3 = (typeof MyArray)[number];
type Age2 = (typeof MyArray)[number]['age'];
type Age3 = Person3['age'];
// 索引的时候只能使用类型，不能使用常量来索引
const Key2 = 'age';
type Age5 = Person[Key2];

type key = 'age';
type Age4 = Person[key];

// ----------------------------------------条件类型-------------------------------------------
// extends ? : 条件类型类似于三目运算
// (condition ? trueExpression : falseExpression)
// extends左边可以赋值给右边时 走true分支

// 条件类型和泛型结合使用
interface IdLabel {
	id: number /* some fields */;
}
interface NameLabel {
	name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
	throw 'unimplemented';
}

const id1  = {id:1}
const name1  = {name:'1'}
// 使用条件类型加泛型重构
type NameOrId<T extends number | string> = T extends number
	? IdLabel
	: NameLabel;

function createLabel2<T extends number | string>(idOrName: T): NameOrId<T> {
	if (typeof idOrName === 'string') {
        // 检测浅 泛型不能根据运行时的类型做推断， 所以需要使用同样为可变参数的类型来做泛型传递
		return name1 as NameOrId<typeof idOrName>;
	} else {
		return id1 as NameOrId<typeof idOrName>;
	}
}

const c1 = createLabel2('123')
const c2 = createLabel2(123)

// 通常条件类型缩小泛型的范围， 根据条件类型的分支进一步约束泛型
type MessageOf<T extends {message: unknown}> = T['message']
interface Email2 {
    message:string;
}
interface Dog {
    bark(): void;
  }
type Email2Message = MessageOf<Email2>
// 进一步根据条件类型来判断MessageOf
type MessageOf2<T> = T extends {message: unknown} ? T['message'] : never
type DogMessageContents = MessageOf2<Dog>;

// 使用条件类型自动推断出类型，而不是使用索引类型进行取值
type Flatten2<T> = T extends Array<infer A> ? A : T

// 从函数中取函数返回值的类型
type GetReturnType<T> = T extends (...args: never[]) => infer Return ? Return : never 
type Num = GetReturnType<() => number>;

// 当遇到函数重载的时候 将从最后的实现签名中进行推断， 不可能根据参数类型执行重载的解析
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;
 
type T1 = ReturnType<typeof stringOrNum>;


// 分布式条件类型  当条件类型作用于泛型类型时将变为分布式条件类型
// 返回的是联合类型，将传入的联合类型分别进行组合返回联合类型
type ToArray<Type> = Type extends any ? Type[] : never;
 
type StrArrOrNumArr = ToArray<string | number>;

// 通常情况下分布式更和合理如果要避免这种情况可以使用[]包裹
type ToArrayNonDist<Type> = [Type] extends any ? [Type] : never
type ArrOfStrOrNum = ToArrayNonDist<string | number>;