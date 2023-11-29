// ----------------------------------------------Utility-------------------------------------------------
// ts官方提供的类型
// Awaited<Type>
// 获取promise的返回值类型
type A1 = Awaited<Promise<string>>;
type C1 = Awaited<boolean | Promise<number>>;

// Partial<Type>
// 将Type的所有属性设置为可选属性

// Awaited<Type>
// 将Type的所有属性设置为必填属性

// Readonly<Type>
// 将Type的所有属性设置为readonly
// 冻结属性 属性只读
// function freeze<Type>(obj: Type): Readonly<Type>;

// Pick<Type, Keys>
// 在Type中选取keys生成一个新的类型

// Omit<Type, Keys>
// 与Pick相反 删除keys中的字段 生成一个新的类型

// Exclude<UnionType, ExcludedMembers>
// 从UnionType 排除ExcludedMembers 都是联合类型

// Extract<Type, Union>
// 从Union中选取 可以赋值给Type的联合类型

// NonNullable<Type>
// 从Type中排除未定义的

// Parameters<Type>
// 获取参数类型的数组

// ConstructorParameters<Type>
// 根据构造函数构造元组或者数组类型，如果Type不是函数则不会生成类型

// ReturnType<Type>
// 获取函数类型的返回值

// InstanceType<Type>
// 构造函数实例的类型

// ThisParameterType<Type>
// 判断this中是否存在该类型
function toHex3(this: Number) {
	return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex3>) {
	return toHex3.apply(n);
}

// OmitThisParameter<Type>
// 从Type中移除此参数

function toHex2(this: Number) {
	return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex2> = toHex2.bind(5);

console.log(fiveToHex());


// ThisType<Type>
// noImplicitThis 如果要使用需要启动配置
type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
  };
   
  function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
  }
   
  let obj2 = makeObject({
    data: { x: 0, y: 0 },
    methods: {
      moveBy(dx: number, dy: number) {
        this.x += dx; // Strongly typed this
        this.y += dy; // Strongly typed this
      },
    },
  });
   
  obj2.x = 10;
  obj2.y = 20;
  obj2.moveBy(5, 5);

// 模板字符串类型
//   Uppercase<StringType>
// Lowercase<StringType>
// Capitalize<StringType>
// Uncapitalize<StringType>

// ----------------------------------------------Decorators-------------------------------------------------
// 装饰器