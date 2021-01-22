/**
 * 表单控件
 */
import { getType, filterAttrs, toHump } from '../../core/lib/utils'
import log from '../../core/lib/utils/log'

const inlineStyleToJsStyle = (str) => {
  const strs = str.split(';')
  const style = {}
  strs.forEach(item => {
    const [name, value] = item.split(':')
    style[toHump(name.trim())] = value.trim()
  })
  return style
}

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
      componentOn,
      componentNativeOn,
      previewValue,
      dataSourceSlots,
      componentProps,
    } = fieldContext
    
    const { EM } = fieldContext.YForm

    const componentStyleResult = getType(componentStyle) === 'string' ? inlineStyleToJsStyle(componentStyle) : componentStyle

    const fieldEvents = fieldContext.$listeners
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
        ...componentStyleResult,
      },
      key: fieldContext.name || '',
      ref: 'VModelComponent',
      on: {
        ...$listeners,
        ...componentOn,
        input(e) {
          let value = e
          /**
           * 原生事件
           */
          if (fieldContext.yNative) {
            value = e.target.value
          }
          EM.emit('FIELD_INPUT_CHANGE', {
            trigger: 'input',
            field: fieldContext,
            value
          })
          componentOn.input && componentOn.input(e)
          fieldEvents.input && fieldEvents.input(e)
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
            trigger: 'change',
            field: fieldContext,
            value
          })
          componentOn.change && componentOn.change(e)
          fieldEvents.change && fieldEvents.change(e)
        },
        focus(e) {
          let value = e
          /**
           * 原生事件
           */
          if (fieldContext.yNative) {
            value = e.target.value
          }
          EM.emit('FIELD_INPUT_FOCUS', {
            trigger: 'focus',
            field: fieldContext,
            value,
          })
          componentOn.focus && componentOn.focus(e)
          fieldEvents.focus && fieldEvents.focus(e)
        },
        blur(e) {
          let value = e
          /**
           * 原生事件
           */
          if (fieldContext.yNative) {
            value = e.target.value
          }
          EM.emit('FIELD_INPUT_BLUR', {
            trigger: 'blur',
            field: fieldContext,
            value,
          })
          componentOn.blur && componentOn.blur(e)
          fieldEvents.blur && fieldEvents.blur(e)
        },
      },
      nativeOn: componentNativeOn,
    }, [
      ...(dataSourceSlots || []),
      ...slots,
    ]) 

    if (this.fieldStatusResult === 'preview') {
      const previewSlot = fieldContext.$scopedSlots.preview
      const previewResult = previewSlot ? previewSlot(fieldContext.value) : (
        previewValue ? (<div class={`yfield-preview__${fieldContext.name}`}>{previewValue(fieldContext.value)}</div>) : (<span class={`yfield-preview__${fieldContext.name}`} >{fieldContext.value}</span>)
      )
      return previewResult
    }

    return VModelComponent

  },
}
