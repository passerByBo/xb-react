// 自定义标签报错-增加如下定义
// declare namespace JSX {
// 	interface IntrinsicElements {
// 		[elemName: string]: any;
// 	}
// }

// 通过引入值得方式定义组件，函数组件、类组件 如果都不能解析 那么会曝出错误

// interface FooProp {
// 	name: string;
// 	X: number;
// 	Y: number;
//   }
//   declare function AnotherComponent(prop: { name: string }):JSX.Element
//   function ComponentFoo(prop: FooProp) {
// 	return <AnotherComponent name={prop.name} />;
//   }
//   const Button = (prop: { value: string }, context: { color: string }) => (
// 	<button />
//   );

//   declare namespace JSX {
// 	interface ElementClass {
// 	  render: any;
// 	}
//   }
//   class MyComponent {
// 	render() {}
//   }
//   function MyFactoryFunction() {
// 	return { render: () => {} };
//   }
//   <MyComponent />; // ok
//   <MyFactoryFunction />; // ok
//   class NotAValidComponent {}
//   function NotAValidFactoryFunction() {
// 	return {};
//   }
//   <NotAValidComponent />; // error
//   <NotAValidFactoryFunction />; // error

// declare namespace JSX {
// 	interface IntrinsicElements {
// 		foo: { bar?: boolean };
// 	}
// }

// <foo bar />;



// declare namespace JSX {
// 	interface ElementAttributesProperty {
// 	  props; // specify the property name to use
// 	}
//   }
//   class MyComponent {
// 	// specify the property on the element instance type
// 	props: {
// 	  foo?: string;
// 	};
//   }
//   // element attributes type for 'MyComponent' is '{foo?: string}'
//   <MyComponent foo="bar" />;
