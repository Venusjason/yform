## CHANGELOG

### 0.1.32

- feat: 新增 scrollToFirstError api: 表单提交时是否需要自动定位到错误项

### 0.1.31

- feat: yTable 支持slot 来写 columns
- feat: inputComponent componentStyle 支持字符串


### 0.1.30

- fix: trigger 过滤不对的问题

### 0.1.29

- fix: form.element-ui 支持初始化配置 useYFormLog、extendRules
- todo: field.name 多字段校验

### 0.1.28

- fix: yform 注册时 name

### 0.1.27

- ADDED: field.name 支持多字段
- ADDED: form.core 支持初始化配置 useYFormLog、extendRules

### 0.1.26

- Added：增加 field.yVisible api 用于处理动态渲染字段 vue key需要手动设置

### 0.1.25
 - fix: field.name push
 - fix: form.validate await
 - upd: attrs 过滤掉Object
 - upd: quertTable 内置 runServe 对外暴露
 - fix: Yform里fields.length === 0时 直接返回校验成功
 - Added: field 全局注册增加 componentProps 配置
 - change: validateOnRuleChange 默认为false