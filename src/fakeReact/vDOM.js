// 执行和vDOM相关的操作

export function initVNode(vNode) {
  let { vType } = vNode
  console.warn('enter initVNode',vType, vNode)
  // 判断 如果没有vType 则是文本节点
  if ( !vType ) {
    const textNode = document.createTextNode(vNode)
    console.log('textNode',textNode)
    return textNode
  }
  if ( vType === 1 ) {
    // 生成原生标签 div span等
    return createNativeElement(vNode)
  }
  else if ( vType === 2 ) {
    return createFunctionComp(vNode)
  } 
  else {
    return createClassComp(vNode)
  }
}

/**
 * DOM事件名称映射
 */
const events = {
  'onClick': 'click',
  'onInput': 'input',
  'onChange': 'change',
}

// 生成原生标签
function createNativeElement(vNode) {
  const { type, props } = vNode
  console.log('type',vNode,  type)
  
  // 创建真实DOM节点
  const node = document.createElement(type)

  // 过滤特殊属性 key, children不是真实dom的属性 需要特殊处理
  // 其他的属性解析出来是一个对象
  const { key, children, ...rest } = props
  console.log('rest props', rest)
  Object.keys(rest).forEach(k=>{
    // 需特殊处理的htmlFor className等
    if ( k === 'className' ) {
      node.setAttribute('class', rest[k])
    }
    else if ( k === 'htmlFor' ) {
      node.setAttribute('for', rest[k])
    }
    // style属性处理
    else if ( k === 'style' ) {
      console.error('k', rest[k])
      let styleStr = ''
      for (const key in rest[k]) {
        if (rest[k].hasOwnProperty(key)) {
          const element = rest[k][key];
          styleStr += `${key}:${element};`
        }
      }
      console.log('styleStr',styleStr)
      node.setAttribute('style', styleStr)
    }
    // 事件处理
    else if ( events[k] ) {
      node.addEventListener(events[k], rest[k])
    }
    // 通用属性 在dom节点上直接设置同名属性
    else {
      node.setAttribute(k, rest[k])
    }
  })

  console.log('开始递归处理子节点', children)

  // 递归处理子节点
  // 这里其实不需要判断children的类型了 因为文本节点不会进这个方法， 这里的children肯定是数组 
  // if ( typeof children === 'array' ) {
    children.forEach(child=>{
      // map操作
      if ( Array.isArray(child) ) {
        child.forEach(c=>{
          node.appendChild(initVNode(c)) 
        })
      } 
      // 单个元素
      else {
        node.appendChild(initVNode(child)) 
      }
      console.log('after appendChild')
    })
  // }
  
  return node
}

// 生成函数组件
function createFunctionComp(vNode) {
  // 这里的type是一个函数 返回一个jsx 就是一个DOM对象
  const { type, props } = vNode
  console.log('createFunctionComp',vNode)
  console.log('types(props)',type(props))
  return initVNode(type(props))
}

// 生成类组件
function createClassComp(vNode) {
  console.log('classVNode', vNode)
  // 这里的
  const { type, props } = vNode
  const component = new type(props)
  
  console.log('component', component)
  return initVNode(component.render())
}