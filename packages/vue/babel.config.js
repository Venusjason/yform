module.exports = {
  presets: [
    // '@vue/cli-plugin-babel/preset',
    ['@vue/app', {
      useBuiltIns: 'entry'
    }],
    ['@vue/babel-preset-jsx',
    {
        "injectH": false
    }],
    // ["es2015", { "modules": false }],
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ],
}
