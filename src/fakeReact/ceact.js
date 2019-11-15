/**
 * 
 * @param {*} type 第一个参数 节点类型
 * @param {*} props 第二个参数 元素属性
 * @param  {...any} children 之后的参数作为一个children子节点数组
 */
function createElement(type, props, ...children) {
  // 返回虚拟DOM
  // console.log(arguments)
  props.children = children
  // 删除不想要的属性
  delete props.__self
  delete props.__source


  // 要能够区分组件类型
  // vtype: 1-原生html标签 2-函数组件 3-类组件
  // 那么这里就需要判断
  let vType = null
  if ( typeof type === 'string' ) {
    // 原生标签
    vType = 1
  } 
  else {
    // class与函数组件都是函数 无法通过类型区分 需要通过Component中声明的isReactComponent属性来判断
    console.log(typeof type)
    if ( type.isReactComponent ) {
      vType = 3
    } else {
      vType = 2
    }
  }
  
  return {
    vType,
    type,
    props,
  }
}

class Component {
  static isReactComponent = true
  constructor(props) {
    this.props = props
    this.state = {}
  }

  setState() {

  }

  forceUpdate() {

  }
}

// 这样导出可以通过import {Component} from 'react' 然后通过Component访问
export {Component}

// 这样导出可以通过import React from 'react', 然后通过React.Component访问
export default {
  createElement
}