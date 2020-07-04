## CHANGELOG

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