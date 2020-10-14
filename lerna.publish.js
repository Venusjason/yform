var execSh  = require("exec-sh")

execSh(
  'npm i' + 
  '& cd packages/core' +
  '& npm i' + 
  '& npm run build' +
  '& cd ../vue' +
  '& npm i' +
  '& npm run compile:vue' +
  '& npm run compile:element-ui'
  ,
  {},
  (err) => {
    if (err) {
      console.warn('执行遇到错误，已中断')
      console.error(err)
    } else {
      console.log('编译完成，准备发包')
      lernaRun()
    }
  }
)

const lernaRun = () => {
  return execSh('lerna publish', {}, err => {
    if (err) {
      console.warn('发布未完成')
    } else {
      console.log('发布成功')
    }
  })
}