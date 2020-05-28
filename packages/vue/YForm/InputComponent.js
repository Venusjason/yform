/**
 * 表单控件
 */
import { getType } from '../../core/lib/utils'
import log from '../../core/lib/utils/log'

export const getMySlots = (fieldContext, context, slotName = '*') => {
  const slotNames = slotName.split(',')

  const keys = Object.keys(fieldContext.$slots)
  const acceptKeys = keys.filter(key => slotName === '*' || slotNames.includes(key))

  return acceptKeys.reduce((arr, key) => arr.concat(fieldContext.$slots[key]), []).map(vnode => {
    vnode.context = context._self
    return vnode
  })
}

export const isVnode = (h, component) => {
  const Vnode = h('div', '').constructor
  return component instanceof Vnode
}

export default (fieldContext) => {
  const {
    component,
    $attrs,
    $listeners,
    componentStyle,
    componentClass,
    fieldStatus,
    previewValue,
  } = fieldContext

  const { formStatus } = fieldContext.YForm

  const fieldStatusResult = fieldStatus || formStatus

  const isFieldDisabled = fieldStatusResult === 'disabled'

  const { fieldInstance } = fieldContext.$options

  const getClassNames = () => {
    const type = getType(componentClass)
    const names = {}
    if (type === 'string') {
      componentClass.split(' ').forEach(key => {
        if (key.trim() !== '') {
          names[key.trim()] = true
        }
      })
    } else if (type === 'array') {
      componentClass.forEach(key => {
        names[key.trim()] = true
      })
    } else if (type === 'object') {
      return componentClass
    } else {
      log.error(`componentClass 可选类型: string、array、object,不能为${type}`)
    }
    return names
  }

  const classNames = getClassNames()

  const YINPUTCOMPONENT = {
    name: 'YINPUTCOMPONENT',
    componentName: 'YINPUTCOMPONENT',
    render(h) {

      const slots = getMySlots(fieldContext, this, '*')
      /**
       * previewValue
       */

      return h(component, {
        props: {
          ...$attrs,
          value: fieldContext.value,
          disabled: isFieldDisabled,
        },
        attrs: {
          ...$attrs,
          value: fieldContext.value,
          disabled: isFieldDisabled,
        },
        class: {
          ...classNames,
        },
        style: {
          /**
           * 为了确保 label 与 input 能水平对齐
           */
          verticalAlign: 'middle',
          ...componentStyle,
        },
        on: {
          ...$listeners,
          input(e) {
            let value = e
            /**
             * 原生事件
             */
            if (fieldContext.yNative) {
              value = e.target.value
            }
            fieldInstance.onFieldInputChange(value)
            fieldContext.$listeners.input && fieldContext.$listeners.input(e)
          },
          change(e) {
            let value = e
            /**
             * 原生事件
             */
            if (fieldContext.yNative) {
              value = e.target.value
            }
            fieldInstance.onFieldInputChange(value)
            fieldContext.$listeners.change && fieldContext.$listeners.change(e)
          },
          focus(e) {
            fieldInstance.onFieldInputFocus()
            fieldContext.$listeners.focus && fieldContext.$listeners.focus(e)
          },
          blur(e) {
            fieldInstance.onFieldInputBlur()
            fieldContext.$listeners.blur && fieldContext.$listeners.blur(e)
          },
        },
      }, [
        slots,
      ])
    },
  }

  if (fieldStatusResult === 'preview') {
    return {
      render() {
        return previewValue ? (<div>{previewValue(fieldContext.value)}</div>) : (<span>{fieldContext.value}</span>)
      }
    }
  }

  return YINPUTCOMPONENT

}