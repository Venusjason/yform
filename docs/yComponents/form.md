### YForm

* YForm api 设计类似element-ui form, 但是比常见ui库的form功能特性要多

| 参数                             | 说明                                             | 类型                                           | 可选值                                             | 默认值                              |
| -----------------------         |:-------------:                                  |   -----:                                      | -----:                                             | -----:                              |
|v-model/value & onInput          |表单值，对应jsx: value、onInput                     | Object                                        | -                                                 | -                                  |
| inline | 行内表单模式             | Boolean                                         | -                                              |  false                                            |                                    |
| colon | 是否自动加label后缀       | Boolean 、String                                 | -                                              |  false                                            |                                     |
| labelPosition| label 对齐位置 | String | top/left/right |  - |
| size | 表单控件尺寸 | String | large/medium/small/mini |  medium |
| hideRequiredAsterisk | 是否隐藏required 前的 * | Boolean | - |  false |
| formStatus           | 表单状态               | String | edit/preview/disabled |  edit |
| validateOnRuleChange | 是否在 rules 属性改变后立即触发一次验证 | Boolean | - |  true |
| onSubmit             | 与YButton submit 联动   | Function(formValues) => Promise | - |  - |
| hideRequiredAsterisk | 是否隐藏required 前的 * | Boolean | - |  false |
| onValidate | 表单整体校验完成后回调 | Function(isValid, err): void | - |  - |
