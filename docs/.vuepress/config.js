module.exports = {
  title: '@yform',
  base: process.env.NODE_ENV === 'production' ? '/yform/' : '',
  description: '@yform 帮你快速搞定vue 中后台应用',
  plugins: ['demo-container'],
  themeConfig: {
    sidebar: [
      {
        title: '开发指南',
        path: '/guide/',
        // sidebarDepth: 1,
        collapsable: false,
        children: [
          {
            title: '安装',
            path: '/guide/install',
            // sidebarDepth: 2,
          },
          // {
          //   title: '快速上手',
          //   path: '/guide/quickStart',
          // }
        ]
      },
      {
        title: 'YFormCore 组件',
        path: '/yComponents/form',
        collapsable: false,
        children: [
          {
            title: 'Form',
            path: '/yComponents/form'
          },
          {
            title: 'Field',
            path: '/yComponents/field'
          },
          {
            title: 'Button',
            path: '/yComponents/button'
          },
          {
            title: 'queryTable',
            path: '/yComponents/queryTable'
          }
        ]
      },
      {
        title: '常见场景示例',
        path: '/examples',
        collapsable: false,
        children: [
          {
            title: '表单',
            path: '/examples/'
          },
          // {
          //   title: '查询列表',
          //   path: '/examples/queryTable'
          // },
          {
            title: '自定义查询列表',
            path: '/examples/customQueryTable'
          }
        ]
      }
    ]
  },
}