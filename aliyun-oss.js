const WebpackAliyunOss = require('@weier/webpack-aliyun-oss');
const path = require('path')
const pkg = require('./packages/vue/package.json')
// 上传配置，请勿修改
const accessKeys = require(path.resolve(process.env.HOME || process.env.USERPROFILE, '.aliyunoss.js'))

const { accessKeyId, accessKeySecret } = accessKeys.weier_prod

new WebpackAliyunOss({
    from: ['./packages/vue/lib/**', '!./packages/vue/lib/**/*.html'],
    dist: `libs/yform/${pkg.version}`,
    buildRoot: 'packages/vue/lib', // 构建目录，如果已传setOssPath，可忽略
    region: 'oss-cn-hangzhou',
    accessKeyId,
    accessKeySecret,
    bucket: 'weier-resources',
    // setOssPath(filePath) {
    //   // filePath为当前文件路径。函数应该返回路径+文件名。如果返回/new/path/to/file.js，则最终上传路径为 path/in/alioss/new/path/to/file.js
    //   console.log(filePath);
    //   return `oss://weier-resources/weier-element-ui/${filePath}`
    // },
    setHeaders(filePath) {
      // some operations to filePath
      return {
        'Cache-Control': 'max-age=31536000'
      }
    }
}).apply(); 