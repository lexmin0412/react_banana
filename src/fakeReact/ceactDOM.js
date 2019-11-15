import { initVNode } from './vDOM'

/**
 * 仿ReactDom.render方法
 * @param {object} vdom 虚拟dom对象，即React.createElement的返回结果
 * @param {node} container 渲染节点容器
 */
function render(vdom, container) {
  console.log('reactDOM.render',vdom, container)
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
  container.appendChild(initVNode(vdom))
}

export default {
  render
}