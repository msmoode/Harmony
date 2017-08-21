import {Component} from 'react'
import {createRenderer} from 'fela'
import {render} from 'fela-dom'
import monolithic from 'fela-monolithic'

const config = {
  enhancers: [monolithic()],
  selectorPrefix: '_'
}

const renderer = createRenderer(config)

render(renderer)

export default class extends Component {
  constructor (props) {
    super(props)

    this.localProperties = {}
    this._styles = this.createStyleSheet()
    this.cssHelper = this.cssHelper.bind(this)
  }

  updateStyle (props = {}) {
    Object.assign(this.localProperties, props)
    this._styles = this.createStyleSheet()
    this.forceUpdate()
  }

  createStyleSheet () {
    if (!this.style) {
      return {}
    }

    const style = this.style()

    if (typeof style !== 'object') {
      throw new TypeError("Template method 'styles' returns a non-object")
    }

    const _styles = {}

    for (const _class in style) {
      const className = renderer.renderRule(style[_class], {})
      // Avoid empty className for a rule with no children
      if (className.length > 0) {
        const component = this.constructor.name
          .toString()
          .toLowerCase()
        _styles[_class] = [className, `${component}_${_class}`]
      }
    }

    return _styles
  }

  cssHelper (...args) {
    const classes = args
      .map(_class => {
        if (_class && this._styles[_class]) {
          return this._styles[_class].join(' ')
        }
        return null
      })
      .filter(v => Boolean(v))
    return classes.length ? classes.join(' ') : null
  }

  render () {
    if (!this.template) {
      throw new TypeError("Template doesn't define 'template' method")
    }

    return this.template(this.cssHelper)
  }
}
