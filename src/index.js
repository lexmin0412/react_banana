// 可以发现 这里只要导入一个具名的React, babel就会找到React下的createElement方法去转换jsx 所以这里的React默认导出对象下必须要有一个createElement的方法
import React, { Component } from './fakeReact/ceact'
import ReactDOM from './fakeReact/ceactDOM'

function Comp(props) {
return <h2>hi {props.name}</h2>
}

class Comp2 extends Component {
  render() {
    return (
      <div >hi comp2</div>
    )
  }
}

function demoClick() {
  console.log('demo click')
}

function handleInput(e) {
  console.log('e',e)
}

const foo = 'bar'
const userList = [
  {
    name: 'jerry'
  },
  {
    name: 'tom'
  }
]
// jsx就是js对象 就是vdom
const jsx = (
  <div id="demo" className={foo} onClick={demoClick}>
    <input type="text" onInput={handleInput} />
    <span style={{
      background: '#45aafa',
      color: '#ffe400'
    }}>hi</span>
    <Comp name="函数组件" />
    {/* 这个组件经过React.createElement转换后 vDom会是如下的结构 Comp2 --> div --> 123 最后一个文本节点不会经过React.createElement转换，就是一个单纯的字符串, 不是一个对象， 存在于上一级的div的children数组中 */}
    <Comp2 name="类组件" >
      <div>123</div>
    </Comp2>
    {/* map形式转换为虚拟DOM时不再是一个对象，而是虚拟dom对象组成的数组 */}
    {
      userList.map(user=><div>
        {user.name}
      </div>)
    }
  </div>
)

console.log('jsx',jsx)

ReactDOM.render(jsx, document.querySelector('#root'))