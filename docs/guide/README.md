# @yform/vue

@yform 定位是快捷处理中后台应用的表单、列表库，不限于开发框架、ui框架

* 当前vue版本已经实现，文档提到的都是vue生态
* 当前 vue 生态 ui库 element-ui已完成适配层, 文档提到的都是element-ui, iview 等其他ui库适配 后续规划中


### 理解yform 使用场景

* yform 提供了非常灵活的api， 可以根据业务需求，自由定制componentProps
* yform 与 element-ui 没有任何关系， 所以 element-ui的组件api在yform底层没有任何处理（除了table 定义了一个 render）
* yform 不是一个组件库，仅仅提供了表单布局上的ui，所以组件都来自与第三方ui库 或者 开发者自行实现