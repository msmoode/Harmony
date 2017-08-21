import React from 'react'
import ReactDOM from 'react-dom'

class ComponentRoot extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      children: []
    }

    this.addChild = this.addChild.bind(this)
  }

  addChild (component) {
    this.state.children.push(component)
    this.forceUpdate()
  }

  render () {
    return this.state.children.map((Child, key) => {
      var props = Child.props
      return <Child {...props} key={key} />
    })
  }
}

export default class {
  constructor (node) {
    this.node = node

    this.componentContainer = document.createElement('span')
    this.componentContainer.dataset.harmonyModule = this.constructor.name

    if (this.onMount === undefined) throw new Error('Method `onmount` not defined!')
    if (this.onUnmount === undefined) throw new Error('Method `onUnmount` not defined!')

    this.addComponent = this.addComponent.bind(this)
  }

  mount () {
    this.node.appendChild(this.componentContainer)
    this.onMount()
    ReactDOM.render(<ComponentRoot ref={ref => (this.componentRoot = ref)} />, this.componentContainer)
  }

  unmount () {
    this.node.removeChild(this.componentContainer)
    this.onUnmount()
    ReactDOM.unmountComponentAtNode(this.componentContainer)
  }

  addComponent (component) {
  }
}
