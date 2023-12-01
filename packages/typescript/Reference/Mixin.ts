// ts的mixin依赖于extends
class Sprite {
	name = '';
	x = 0;
	y = 0;

	constructor(name: string) {
		this.name = name;
	}
}
// 使用工厂函数扩展基类
type Constructor = new (...args: any[]) => {}

function Scale<TBase extends Constructor>(Base: TBase){
    return class Scaling extends Base{
        _scale = 1;

        setScale(scale: number){
            this._scale = scale
        }

        get scale():number{
            return this._scale
        }
    }
}

const EightBitSprite = Scale(Sprite);

const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

// 受限的mixin
// 修改原始类型接受泛型 创建公共的类
type Constructor2 = new (...arg: any[]) => {}
type GConstructor<T = {}> = new (...arg: any[]) => T

// 使用泛型类创建新的类型
type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;
type Spritable = GConstructor<Sprite>;
type Loggable = GConstructor<{ print: () => void }>;

// 创建混合函数，混合函数只有在特定的基础上才可以正常运行
function Jumpable<TBase extends Positionable>(Base: TBase){
    return class Jumpable extends Base{
        jump(){
            this.setPos(0, 20);
        }
    }
}