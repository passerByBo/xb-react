// 声明合并

// 接口合并
// 接口的值合并
// 接口的非函数成员是唯一的  如果两个接口都声明一个名称相同但是类型不同的非函数成员 编译器会报错
interface Box8 {
	height: number;
	width: number;
}
interface Box8 {
	scale: number;
	//名字相同 类型不同 会报错
	width: string;
}
let box: Box8 = { height: 5, width: 6, scale: 10 };
// 对于函数 相同名称函数但是参数不同都将被认为是同意函数的重载
// 后面声明的优先级高于先声明的
interface Cloner {
	clone(animal: Animal): Animal;
}
interface Cloner {
	clone(animal: Sheep): Sheep;
}
interface Cloner {
	clone(animal: Dog): Dog;
	clone(animal: Cat): Cat;
}
// 上面编译器自动合并成如下的样子
interface Cloner {
	clone(animal: Dog): Dog;
	clone(animal: Cat): Cat;
	clone(animal: Sheep): Sheep;
	clone(animal: Animal): Animal;
}

// 合并后顺序的变化
interface Document {
	createElement(tagName: any): Element;
}
interface Document {
	createElement(tagName: 'div'): HTMLDivElement;
	createElement(tagName: 'span'): HTMLSpanElement;
}
interface Document {
	createElement(tagName: string): HTMLElement;
	createElement(tagName: 'canvas'): HTMLCanvasElement;
}

interface DocumentMerge {
	createElement(tagName: 'canvas'): HTMLCanvasElement;
	createElement(tagName: 'div'): HTMLDivElement;
	createElement(tagName: 'span'): HTMLSpanElement;
	createElement(tagName: string): HTMLElement;
	createElement(tagName: any): Element;
}

//   命名空间合并
// 同名的命名空间也会进行合并

namespace Animals {
	export class Zebra {}
	export interface A {
		a: 1;
	}
}
namespace Animals {
	export interface Legged {
		numberOfLegs: number;
	}
	export class Dog {}

	export interface A {
		B: 1;
	}
}

// 合并后
namespace AnimalsMerged {
	export interface Legged {
		numberOfLegs: number;
	}
	export class Zebra {}
	export class Dog {}
}

// 未导出的成员只能在定义的命名空间内使用，所以合并后新的作用域中 未导出的这些并不共用

// 类和命名空间合并
class Album {
	label: Album.AlbumLabel;
}
namespace Album {
	export class AlbumLabel {}
}

// 函数和命名空间合并
function buildLabel(name: string): string {
	// 可以使用命名空间内部导出的
	return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
	export let suffix = '';
	export let prefix = 'Hello, ';
}
console.log(buildLabel('Sam Smith'));

// 使用命名空间扩展静态成员的枚举
enum Color {
	red = 1,
	green,
	blue
}

namespace Color {
	export function mixColor(colorName: string) {
		if (colorName === 'yellow') {
			return Color.red + Color.green;
		} else if (colorName == 'white') {
			return Color.red + Color.green + Color.blue;
		} else if (colorName == 'magenta') {
			return Color.red + Color.blue;
		} else if (colorName == 'cyan') {
			return Color.green + Color.blue;
		}
	}
  
}

// 没看懂
// This works fine in TypeScript too, but the compiler doesn’t know about Observable.prototype.map. You can use module augmentation to tell the compiler about it:
// export class Observable<T> {
//     // ... implementation left as an exercise for the reader ...
//   }
//   // map.ts
//   import { Observable } from "./observable";
//   declare module "./observable" {
//     interface Observable<T> {
//       map<U>(f: (x: T) => U): Observable<U>;
//     }
//   }
//   Observable.prototype.map = function (f) {
//     // ... another exercise for the reader
//   };
//   // consumer.ts
//   import { Observable } from "./observable";
//   import "./map";
//   let o: Observable<number>;
//   o.map((x) => x.toFixed());