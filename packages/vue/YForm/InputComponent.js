/**
 * 表单控件
 */
import { getType, filterAttrs } from '../../core/lib/utils'
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

export default {
  name: 'YINPUTCOMPONENT',
  componentName: 'YINPUTCOMPONENT',
  inject: ['YField'],
  computed: {
    fieldStatusResult() {
      const { fieldStatus } = this.YField
      const { formStatus } =  this.YField.YForm
      const fieldStatusResult = fieldStatus || formStatus || 'edit'
      return fieldStatusResult
    }
  },
  mounted() {
    const { wrappedComponentRef } = this.YField
    this.$watch('fieldStatusResult', function(val) {
      if (val === 'edit') {
        wrappedComponentRef && wrappedComponentRef(this.$refs.VModelComponent)
      }
    }, {
      immediate: true
    })
  },
  render(h) {

    const fieldContext = this.YField
    
    const {
      component,
      $attrs,
      $listeners,
      componentStyle,
      componentClass,
      previewValue,
      dataSourceSlots,
      componentProps,
    } = fieldContext
    
    const { EM } = fieldContext.YForm

  
    // const { fieldInstance } = fieldContext.$options
  
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

    const slots = getMySlots(fieldContext, this, '*')

    const {
      defaultComponent,
      // genPlaceholder 废弃
      // genPlaceholder,
      // 全局默认 props
      componentProps: globalComponentProps = {},
    } = fieldContext.$options.globalOptions

    const {
      placeholder: globalComponentPropsPlaceholder,
      ...globalComponentPropsRest
    } = getType(globalComponentProps) === 'object' ? globalComponentProps : globalComponentProps(fieldContext)

    let defaultPlaceholder = ''

    if (getType(globalComponentPropsPlaceholder) === 'string') {
      defaultPlaceholder = globalComponentPropsPlaceholder
    } else if (getType(globalComponentPropsPlaceholder) === 'function') {
      defaultPlaceholder = globalComponentPropsPlaceholder(fieldContext) || ''
    } else if (globalComponentPropsPlaceholder){
      log.warn(`全局注册 placeholder 不能为${getType(globalComponentPropsPlaceholder)}`)
    }

    let placeholder = fieldContext.$attrs.placeholder || defaultPlaceholder

    const isFieldDisabled = this.fieldStatusResult === 'disabled'

    const VModelComponent = h(component || defaultComponent, {
      props: {
        ...globalComponentPropsRest,
        ...$attrs,
        ...componentProps,
        value: fieldContext.value,
        disabled: isFieldDisabled,
        placeholder,
      },
      attrs: filterAttrs({
        ...globalComponentPropsRest,
        ...$attrs,
        ...componentProps,
        value: fieldContext.value,
        disabled: isFieldDisabled,
        placeholder,
      }),
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
      key: fieldContext.name || '',
      ref: 'VModelComponent',
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
          EM.emit('FIELD_INPUT_CHANGE', {
            field: fieldContext,
            value
          })
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
          EM.emit('FIELD_INPUT_CHANGE', {
            field: fieldContext,
            value
          })
          fieldContext.$listeners.change && fieldContext.$listeners.change(e)
        },
        focus(e) {
          EM.emit('FIELD_INPUT_FOCUS', {
            field: fieldContext,
          })
          fieldContext.$listeners.focus && fieldContext.$listeners.focus(e)
        },
        blur(e) {
          EM.emit('FIELD_INPUT_BLUR', {
            field: fieldContext,
          })
          fieldContext.$listeners.blur && fieldContext.$listeners.blur(e)
        },
      },
    }, [
      ...(dataSourceSlots || []),
      ...slots,
    ])

    if (this.fieldStatusResult === 'preview') {
      return previewValue ? (<div>{previewValue(fieldContext.value)}</div>) : (<span>{fieldContext.value}</span>)
    }

    return VModelComponent

  },
}
