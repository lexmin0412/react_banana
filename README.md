# React笔记

createElement、Component、render三个api

seteState原理剖析

虚拟DOM原理剖析


## React.createElement

1. 什么是JSX？？
jSX是语法糖，是React.createElement的调用的语法糖

2. 为什么需要JSX
- 执行速度快，因为它在编译为js代码之后进行了优化
- 类型安全
- 更加简单快速

3. 原理
babel-loader会将所有的jsx都转换为React.createElement

jsx会转化为React.createElement, React.createElement会返回虚拟dom, 虚拟dom就是一个js对象，这个对象的结构就是用来描述DOM的。

jsx就是js对象 就是vdom

这里的转换与vue不同，vue是模版式，react是声明式 vue的模版语法要经过ast等一系列复杂的转换，jsx只是一个转换为React.createElement

实现步骤：
1. 创建ceact, 实现createElement，
2. 创建ceactDom, 实现render，能够将ceactDOM返回的dom追加至container
3. 创建vDOM, 能够将vDOM转换为真实dom


class组件的特点，就是拥有特殊状态并且可以通过setState更新状态，从而重新渲染视图。
现在有了另一种选择hooks

面试：setState里面执行了什么函数？

setState并不会立即渲染，而是执行了一个异步的updater队列 使用一个类来专门管理

批量操作 可以减少dom操作的次数

updater - 管理当前组件中的所有变更
this.$updater = new Updater(this)

forceUpdate跳过所有生命周期执行强制更新，直接render

setState只是添加异步队列 不是每次setState都更新
this.$updater

```jsx
// nextState可能是对象或函数
setState(nextState, callback) {
  // 添加异步队列 不是每次都更新
  this.$updater.addCallback(callback)  // 添加回调函数
  this.$updater.addState(nextState)   // pending state
}

addState(nextState) {
  if ( nextState ) {
    // 放入更新队列 pendingState 用于存放所有待更新的代码
    this.pendingState.push(nextState)
    // 如果当前队列没有工作则直接更新 reactDOM.render时会把isPending置为true 所以大部分会处于true的状态
    if ( !this.isPending ) {
      this.emitUpdate()
    }
  }
}
```

updateQueue 更新队列

更新队列是最外层的容器

每一次创建一个组件时会生成一个updater, 在一个updater中会有一个pendingCallbacks存放回调函数，会有一个pendingStates存放所有待更新的状态

一个更新队列中可能会包含多个updater

有一种机制会触发updater的批量更新 也就是batchUpdate 

react有一个事件系统event-systems，比如一个点击事件，除了用户指定的回调函数之外，还会执行dispatchEvent 所以说界面中任何的用户事件都会导致batchUpdate的更新

<!-- 不异步的方式 -->

<!-- 1. 定时器 -->
```js
// 这种方式的setState是不会异步的
setTimeout(()=>{
  this.setState((
    foo: 'bar'
  ))
})
```
<!-- 2. 原生事件 -->
```js
dom.addEventListener('click',()=>{
  this.setState({
    foo: 'bar'
  })
})
```

以上两种方式是不会走react的事件系统的，也就不会调用到dispacthEvent，也就不会调用到batchEvent, 所以这两种方式的setState是同步的，不会产生异步的行为。

batchUpdate的执行会导致它管理的所有updater的执行

updateComponent




shouldUpdate 决定是否应该更新组件
这个函数中会有一个生命周期函数会被调用 也就是shouldComponentUpdate
如果shouldComponentUpdate返回的值是false组件的状态将不会更新，否则会执行forceUpdate，也就是强制更新组件状态，渲染页面

forceUpdate

这个方法中可能会调用componentWillUpdate componentDidUpdate
涉及到了diff算法
会比较老的虚拟dom和新的虚拟dom
会执行setState传过来的回调函数
更新完成之后 会将isPending置为false， 可以进行下一次更新


1. 执行组件setState
2. 向组件对应的updater中调用addState方法，push一个待更新的状态  (updater类似于vue中的watcher)
3. addState多半会触发updateQueue.add(updater)这个方法，也就是说会把当前这个任务追加到全局的updateQueue中
vue和react的更新策略是不同的 vue的dep有多个 react的updateQueue全局只有一个
4. 触发updateQueue.batchUpdate()
5. 进入updater.updateComponent
6. 进入shouldUpdate，如果应该更新 则下一步
7. 进入Component.shouldComponentUpdate, 如果确实需要更新 则走下一步
8. Component.forceUpdate()
9. Component.componentWillUpdate()
10. renderComponent算出新的虚拟dom
11. 比较老的虚拟dom和新的虚拟dom，更新，进入下一步
12. Component.componentDidUpdate()
13. callback()


setState可以传入一个数组

注意：batchUpdate的激活时机：所有的事件和生命周期中的setState都会激活batchUpdate(批量更新)



### 虚拟DOM

什么是虚拟DOM?
是一个能够描述真实DOM结构的js对象

#### 为什么需要虚拟DOM?
DOM操作会引起重排和重绘，性能很差。
相对于dom对象，js对象处理起来非常轻便。
通过diff算法对比新旧vDOM之间的差异，可以批量的，最小化的执行DOM操作，从而提高性能。

如何在不使用虚拟DOM的情况下优化重排重绘？



#### 虚拟DOM的工作原理？

#### Diff算法？

1. 同级比较 webUI中DOM节点跨层级的移动操作特别少 可以忽略不计
1级比较1级 2级比较2级 ...
2. 拥有相同类的两个组件会生成相似的树型结构，拥有不同类的两个组件将会生成不同的树型结构，
例如：如果div变成了p, 或者CompA变成了CompB 那么就没有向下比较的意义了，直接replace
3. 对于同一层级的一组子节点，通过唯一的key进行区分

基于以上三个前提策略，React分别对tree diff, component diff以及element diff进行算法优化，事实证明这三个前提策略是合理且准确的，能够保证整体的页面构建的性能。
这样的话一千个节点只需要进行一千次对比, 而不是1000*1000*1000
- tree diff
- compoennt diff
- element diff

##### element diff

elemnt diff会比较以下的四种操作，最终应用于真实dom
1. 替换原来的节点，如把div变成了p, Comp1换成了Comp2
2. 重排（移动、删除、更新子节点），例如ul中的多个子节点li出现了顺序互换；
3. 修改了节点的属性，如节点的类名发生了变化
4. 对于文本节点，文本内容可能会改变

重排(reorder)操作：INSERT_MARKUP(插入)、MOVE_EXISTING(移动)、REMOVE_NODE(删除)
- INSERT_MARKUP: 新的component类型不在老的集合里，即是全新的节点，需要对新节点执行插入操作
- MOVE_EXISTING: 在老集合里有新的component类型，则只需要做移动操作，可以复用之前的DOM节点
- REMOVE_NODE: 老的component类型，在新集合里有，但对应的element不同 则不能复用和更新，需要执行删除操作 或者老的component类型在新集合中没有，则也要执行删除操作。




比如一个ul中的四个子节点，如果直接替换，则需要删除四个节点，插入四个dom节点；而经过diff算法，只需要移动部分节点的位置即可，减少了大量dom操作。

虚拟dom相对于真实dom，会在diff算法消耗一些时间，但是可以减少大量的DOM操作，相比之下微不足道。\
\


react的性能优化需要手动去做，而vue的性能优化是自动的，但是vue的响应式机制也有问题，当state特别多的时候，Watcher也会很多，会导致卡顿，所以大型应用（状态特别多）一般使用react，更加可控。