## AlloyRender准备工作

本系列会带着大家一步一步使用ES6+制作一款HTML5 2D Canvas/SVG渲染引擎[AlloyRender](https://github.com/AlloyTeam/AlloyRender)。当你制作完该引擎的那一时刻，你就精通了:)

## 准备工作

* 你需要去了解ES6+的基础语法，比如let、Class、继承、箭头函数等等。特别是Class，因为整个架构基于面向对象体系去抽象。
* 你需要去了解webpack + babel ，他们能让你立刻马上使用 ES6+ 去书写你的Web程序，能让你编译出兼容性良好的ES5代码。
 
## Class介绍

比如我们定义动物类:

```js
class Animal {
    constructor(name) {
        this.name = name
    }
    
    say(){
        console.log('My name is ' + this.name +'.')
    }
}
```

其中constructor为动物的构造函数，可以看到动物有name属性以及say方法。怎么使用这个动物类？

```js
let animal = new Animal('alloy')
animal.say()
```

打开你的控制台，可以看到输出 My name is alloy.

## Class继承

Animal是基类，包含了动物的基本特性say和基本属性name（这里是个假设每个动物都有say）。通过继承，可以把Animal发展出许多种形态，比如Bird:

```js {5-7}
class Bird extends Animal {
    constructor(name) {
        super(name)
    }
    
    fly(){
    
    } 
}
```

可以看到，fly是鸟特有的。怎么使用这个Bird Class？同样是使用new关键字：

```js
let bird = new  Bird()
bird.say()
bird.fly()
```

可以看到bird可以直接使用父类定义好的say方法。

## 箭头函数

普通function函数和箭头函数的行为有一个重要区别，箭头函数没有它自己的this值，箭头函数内的this值继承自外围作用域。比如:

```js
class A {
    constructor(name) {
       document.body.onclick = e =>{
          this.name = 1;
        }
    }
}
```

没有箭头函数之前，我们需要这么做:

```js
var A = function(name) {
  var _this = this;

  document.body.onclick = function (e) {
    _this.name = 1;
  };
};
```

或者

```js ｛3｝
var A = function(name) {
  document.body.onclick = function (e) {
    this.name = 1;
  }.bind(this);
};
```

## 使用let

let和var不一样。比如let有了块级作用域:

```js
for (let i = 0; i < 100; i++){
  
}

console.log(i)  //i is not defined
```

可以看babel编出来的代码:

```js
for (var _i = 0; _i < 100; _i++) {}

console.log(i); //i is not defined
```

## webpack + babel

上面的各种语法，弥补了Javascript以前存在的各种问题。现在还需要搭建下webpack + babel环境让你开始书写ES6+。

在webpack.config.js中配置babel。

```js
...
 module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                query: {
                    presets: 'es2015'
                }
            }
        ]
    }
 ...
```

其中test是正则，代表匹配到的js后缀的文件都会经过babel编译。

webpack还有个功能，就是把build出来的东西以UMD的方式暴露。所以不仅仅是业务开发，类库框架开发也可以使用webpack。

在webpack.config.js中配置output:

```js
output: {
    path: 'dist/',
    library:'AlloyRender',
    libraryTarget: 'umd',
    filename:  '[name].js'
},
```

具体配置可以自行查看webpack.config.js文件。

## 小结

本文主要是做好相关的开发环境准备工作以及基本的只是储备，有了这些，就能一起上路开始精通HTML5 Canvas/SVG之旅。