<template>
<div :class="['y-layout', `y-layout-${mediaScreen}`]">
  <slot></slot>
</div>
</template>

<script>

export default {
  name: 'YLayout',
  breakpointWidth: {
    xs: 480,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600,
  },
  // 布局方案 可以局部配置 也可全局设置
  props: {
    // 栅格间隔 ，默认8，paddingLeft: 4, paddingRight: 4
    gutter: {
      type: Number,
      default: 8,
    },
  },
  provide() {
    return {
      YLayout: this
    }
  },
  data() {
    return {
      width: 0,
      itemSizes: 1,
      mediaScreens: ['xs', 'sm', 'md', 'lg', 'xl'],
      mediaScreen: 'xs',
      collapsing: false,
    }
  },
  created() {
    this.mediaScreens = Object.keys(this.$options.breakpointWidth).map(key => key)
    this.cols = Object.keys(this.$options.breakpointWidth).map(key => this.$options.breakpointWidth[key])
    this.mediaScreen = this.mediaScreens[0]
  },
  mounted() {
    this.onResize()
    this.$el.addEventListener('resize', this.onResize)
    window.addEventListener('resize', this.onResize)
  },
  beforeDestory() {
    this.$el.removeEventListener('resize', this.onResize)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      const _this = this
      _this.width = _this.$el.clientWidth
      // 判断 width 在哪个区间
      const l = _this.cols.length
      let itemSizes = 1
      _this.cols.forEach((col, i) => {
        if (i === 0 && _this.width < _this.cols[i]) {
          // console.log(`宽度区间 ${_this.cols[i]} 以下`)
          itemSizes = 1
          this.mediaScreen = this.mediaScreens[0]
        } else if (i === l - 1) {
          if (_this.width > _this.cols[i]) {
            // console.log(`宽度区间 ${_this.cols[i]} 以上`)
            itemSizes = i + 1
            this.mediaScreen = this.mediaScreens[i]
          }
        } else {
          if (_this.cols[i] < _this.width && _this.width < _this.cols[i + 1]) {
            // console.log(`宽度区间 ${_this.cols[i]} ~ ${_this.cols[i + 1]}`)
            itemSizes = i + 2
            this.mediaScreen = this.mediaScreens[i + 1]
          }
        }
      })
      this.itemSizes = itemSizes
      // console.log(`宽度${ _this.width}, 最多放置 ${itemSizes} 个子元素, 尺寸${this.mediaScreen}`)
    },
    hideSomeChildren() {
      let collapseSpan = 0
      const cols = this.$children.filter(child => {
        if (child && child.$options.name === 'YCol' && child.collapse) {
          collapseSpan = child.resultSpan
          this.collapsing = child.collapsed
        }
        return child && child.$options.name === 'YCol'
      })
      cols.reduce((prev, current, i) => {
        const count = prev + current.resultSpan
        if (this.collapsing) {
          current.isShowWhencollapsed = i === 0 || !(count > 24)
        } else {
          current.isShowWhencollapsed = true
        }
        return count
      }, collapseSpan)

    },
  },
}
</script>
<style lang="less">
// .y-layout:after {
//   display: block;
//   content: "";
//   clear: both;
//   visibility: hidden;
//   height: 0;
//   font-size:0;
// }

.y-layout {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
}
</style>