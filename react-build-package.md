
## 工程构建
pnpm init

创建packages文件

配置pnpm pnpm-workspace.yaml
packages:
  - "packages/*"

pnpm i esling -D -w

npx eslint --init

pnpm i -D -w @typescript-eslint/eslint-plugin @typescript-eslint/parser

pnpm i prettier -D -w
增加.prettierrc.json 文件  并且增加自定义配置

prettier做代码格式化  eslint 做代码格式检查  结合两个

prettier集成到eslint中 eslint-config-prettier 覆盖eslint本身的规则配置， eslint-plugin-prettier 修复代码(eslint --fix)
pnpm i -D -w eslint-config-prettier eslint-plugin-prettier

package.json 中增加脚本  lint: "eslint --ext .ts,.jsx,.tsx --fix --quiet ./packages"

git commit 代码格式检查  

pnpm i husky -D -w

npx husky install 生成hook文件

使用脚本增加pre-commit   npx husky add .husky/pre-commit "pnpm lint"

commit 的内容进行检查  pnpm i @commitlint/cli commitlint @commitlint/config-conventional -D -w

增加.commitlintrc.js 配置文件


commitlint 集成到husky中 npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS" 
提交类型：摘要信息
<type>: <sbuject>
常用的type如下
- feat： 添加新功能
- fix：修复bug
- chore：一些不影响功能的更改
- docs： 专指文档的修改
- perf： 性能方面的优化
- refactor：代码重构
- test：添加一些测试 代码


配置tsconfig.json文件，增加配置

打包工具，简洁 打包产物可读性比较强 
pnpm i rollup -D -w 

JSX转换
编译时
运行时


实现打包流程


解析package.json文件获取公共的配置

rollup-plugin-typescript2
@rollup/plugin-commonjs


删除上一次打包的产物 pnpm i -D -w rimraf

生成packagejson文件 rollup-plugin-generate-package-json


pnpm link --global  全局路径下的react就指向了dist/node_modules下的react
pnpm link react --global 将项目中的react依赖指向全局
