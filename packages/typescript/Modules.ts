// 文件中如果没有任何的导入导出 那么这个文件被称为脚本  定义的属性和方法 作用与全局 通过script标签使用 但是要注意他的引用顺序  如果一个文件中没有任何的导入导出
// 但是又想将他当做模块使用 那么可以增加一个空的导出
export {}

// 导入后重新命名
// import {old as new}

// 将所有导出的对象 添加到一个新的空间中
import * as math from './xxx.ts'

// 导入类型
import type { createCatName } from "./animal.js";
// 行内导入类型
import { createCatName, type Cat, type Dog } from "./animal.js";

// commonjs语法规范兼容
import fs = require("fs");


// commonjs模块规范
// module.exports = {

// }
// const { squareTwo } = require("./maths");