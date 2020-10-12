<script>
export default {
  name: 'YCol',
  inject: ['YLayout'],
  props: {
    offset: Number,
    pull: Number,
    push: Number,
    span: Number,
    // 不同分辨率下的布局
    layouts: {
      type: Object,
    },
    // 展开 收起 功能
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  collapseButtonComponent: {
    tag: 'a',
    props: {
      type: 'text',
    }
  },
  data() {
    return {
      // resultSpan: 0,
      isShowWhencollapsed: false,
      collapsed: false,
    }
  },
  computed: {
    resultSpan() {
      let span = 24 / this.YLayout.itemSizes
      if (this.span !== undefined) {
        span = this.span
      }
      if (this.layouts && this.layouts[this.YLayout.mediaScreen] && this.layouts[this.YLayout.mediaScreen].span !== undefined) {
        span = this.layouts[this.YLayout.mediaScreen].span
      }
      return span
    },
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
      this.YLayout.hideSomeChildren()
    }
  },
  render(h) {
    const { gutter, mediaScreens, mediaScreen, collapsing } = this.YLayout
    let classList = []
    const style = {}
    if (gutter) {
      const px = gutter / 2 + 'px'
      Object.assign(style, {
        paddingLeft: px,
        paddingRight: px,
      })
    }
    if (!this.isShowWhencollapsed && collapsing && !this.collapse) {
      style.display = 'none'
    }

    ['span', 'offset', 'pull', 'push'].forEach(prop => {
      if ((this[prop] || this[prop] === 0) && prop !== 'span') {
        classList.push(
          `y-col-${prop}-${this[prop]}`
        )
      }
    })

    if (this.layouts) {
      // const { span } = this.layouts
      mediaScreens.forEach(element => {
        if (this.layouts[element] && element === mediaScreen) {
          classList = [];
          ['span', 'offset', 'pull', 'push'].forEach(prop => {
            const val = this.layouts[element][prop]
            if ((val || val === 0) && prop !== 'span') {
              classList.push(
                `y-col-${prop}-${val}`
              )
            }
          })
        }
      })
    }

    classList.push(`y-col-${this.resultSpan}`)

    // let size = this.span / itemSizes
    // size = size > 1 ? 1 : size
    const { collapseButtonComponent } = this.$options
    return (
      <div class={['y-col', ...classList]} style={style}>
        {this.$slots.default}
        {
          this.collapse && (
            h(collapseButtonComponent.tag, {
              class: 'y-collapse--wrap',
              props: collapseButtonComponent.props,
              attrs: collapseButtonComponent.props,
              on: {
                ...this.$listeners,
                click: this.toggleCollapsed,
              }
            }, [
              this.collapsed ? '展开' : '收起',
              <i class={['y-collapse--arrow', this.collapsed ? 'down' : 'up']}></i>
            ])
          )
        }
      </div>
    )
  },
}
</script>
<style lang="less">

.y-col {
  float: left;
  box-sizing: border-box;
}
each(range(24), {
  .y-col-@{value} {
    width: (@value / 24) * 100%;
  }

  .y-col-offset-@{value} {
    margin-left: (@value / 24) * 100%;
  }

  .y-col-pull-@{value} {
    position: relative;
    right: (@value / 24) * 100%;
  }

  .y-col-push-@{value} {
    position: relative;
    left: (@value / 24) * 100%;
  }
})

.y-collapse--wrap {
  display: inlile-block;
  margin-left: 8px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

  .y-collapse--arrow {
    border: solid;
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 3px;
    margin-left: 8px;

    &.up {
      transform: rotate(-135deg);
      -webkit-transform: rotate(-135deg);
    }

    &.down {
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      position: relative;
      top: -2px;
    }
  }
}
</style>