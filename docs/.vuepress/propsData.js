/* yform 基本属性 */
const yformProps = [
  { prop: 'v-model/value & onInput', desc: '表单值，对应jsx: value、onInput', type: 'Object', options: '-', default: '{}' },
  { prop: 'inline', desc: '行内表单模式', type: 'Boolean', options: 'true/false', default: 'false' },
  { prop: 'labelWidth', desc: 'label的宽度(inline=false时生效)', type: 'String', options: '100px', default: 'auto' },
  { prop: 'colon', desc: '是否自动加label后缀', type: 'Boolean/String', options: 'String/true/false', default: 'false' },
  { prop: 'labelPosition', desc: 'label 对齐位置', type: 'String', options: 'top/left/right', default: 'right' },
  { prop: 'size', desc: '表单控件尺寸', type: 'String', options: 'large/medium/small/mini', default: 'medium' },
  { prop: 'hideRequiredAsterisk', desc: '是否隐藏required 前的 *', type: 'Boolean', options: 'true/false', default: 'false' },
  { prop: 'formStatus', desc: '表单状态', type: 'String', options: 'edit/preview/disabled', default: 'edit' },
  { prop: 'validateOnRuleChange', desc: '是否在 rules 属性改变后立即触发一次验证', type: 'Boolean', options: 'true/false', default: 'false' },
  { prop: 'onSubmit', desc: '与YButton submit 联动', type: 'Function(formValues) => Promise', options: '-', default: '-' },
  { prop: 'onValidate', desc: '表单整体校验完成后回调', type: 'Function(isValid, err): void', options: '-', default: '-' }
]
/* yfield 全局注册options */
const yfieldOptions = [
  { prop: 'name', desc: '标签名称', type: 'String', options: '-', default: 'YField' },
  { prop: 'defaultComponent', desc: 'component 默认值', type: 'String', options: 'vNode', default: '-' },
  { prop: 'componentProps', desc: '默认配置component-props', type: 'Object', options: 'Fuction(fieldContext) => Object', default: '-' }
]
/* yfield 基本属性 */
const yfieldProps = [
  { prop: 'name (required)', desc: '字段', type: 'String', options: '-', default: 'null' },
  { prop: 'label', desc: 'label描述', type: 'String', options: '-', default: '-' },
  { prop: 'component', desc: '组件名称', type: 'String/VNode', options: '-', default: 'yfield配置的默认组件' },
  { prop: 'rules', desc: '同 elment-ui form', type: 'String/Array/Object', options: '-', default: '-' },
  { prop: 'fieldStatus', desc: '字段状态，优先级高于Form.formStatus', type: 'String', options: 'edit/preview/disabled', default: 'edit' },
  { prop: 'previewValue', desc: '自定义预览ui', type: 'Function(value): vNode', options: 'String', default: '-' },
  { prop: 'colon', desc: '优先级高于Form.colon', type: 'Boolean/String', options: 'String/true/false', default: '-' },
  { prop: 'componentProps', desc: 'component props,组件需接收的props', type: 'Object', options: '-', default: '{}' },
  { prop: 'componentStyle', desc: 'component 组件样式', type: 'Object', options: '-', default: '{}' },
  { prop: 'componentClass', desc: 'component 组件class名', type: 'String/Array', options: '-', default: '-' },
  { prop: 'componentOn', desc: 'component 组件events', type: 'Object', options: '-', default: '{}' },
  { prop: 'componentNativeOn', desc: 'component 组件nativeEvents', type: 'Object', options: '-', default: '{}' },
  { prop: 'errorClassName', desc: 'field 校验出错时的 className ', type: 'string', options: '-', default: 'is-error' },
  { prop: 'wrappedComponentRef', desc: '回调函数，返回component组件实例', type: 'Function(value: vNode): void', options: '-', default: '-' },
  { prop: 'yVisible', desc: '同v-if，使用该属性可以省去key设置', type: 'Boolean', options: 'true/false', default: '-' },
  { prop: 'component的自身其他属性', desc: '组件自身属性', type: '-', options: '-', default: '-' }
]
/* yquerytable 基本属性 */
const yquerytableProps = [
  { prop: 'serve', desc: '列表数据获取方法', type: 'Promise', options: '-', default: '-' },
  { prop: 'columns', desc: 'table-column 的jsx形式', type: 'Array', options: '-', default: '[]' },
  { prop: 'manual', desc: '是否手动调用serve', type: 'Boolean', options: '-', default: 'false' },
  { prop: 'filterParamInvalidValue', desc: '自动过滤serve中无效入参', type: 'Boolean', options: 'true/false', default: 'true' },
  { prop: 'pagination', desc: '控制分页， 使用ui库的分页api', type: 'Object', options: '-', default: '-' },
  { prop: 'paginationPosition', desc: 'pagination 组件对齐方式', type: 'String', options: 'left/center/right', default: 'right' },
  { prop: 'showLoading', desc: '展示loading', type: 'Boolean', options: 'true/false', default: 'true' },
  { prop: 'wrappedTableRef', desc: '使用ui库的table内置方法，可以用这个方法获取ref', type: 'Function(ref) => void', options: '-', default: '-' }
]

export default {
  yformProps,
  yfieldOptions,
  yfieldProps,
  yquerytableProps
}