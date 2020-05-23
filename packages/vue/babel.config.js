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
  ]
}
