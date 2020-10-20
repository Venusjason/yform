<script>
import VueField from './field.vue'
import LabelWrap from './label-wrap.vue'

const FieldList = {
  ...VueField,
  name: 'YFieldList',
  provide() {
    return {
      YFieldList: this
    }
  },
  render(h) {
    return this.yVisible ? h('div', {
      class: {
        ...this.fieldClassNames,
        yfield: true,
      },
      key: this.name,
    }, [
      <LabelWrap
        isAutoWidth={this.labelStyle && this.labelStyle.width === 'auto'}
        updateAll={this.YForm.labelWidth === 'auto'}
      >
      {
        (this.label || this.$slots.label) && (
          <label for={this.name} style={this.labelStyle} class={{
            'yfield__label': true,
            [`size-${this.fieldSize}`]: true,
          }}>
            {this.label || this.$slots.label}{this.fieldColon}
          </label>
        )
      }
      </LabelWrap>,
      <div class={{
        'yfield__content': true,
        'is-inline': this.isInline,
        [`size-${this.fieldSize}`]: true,
      }} style={this.contentStyle} key={this.name}>
        {
          this.$scopedSlots.default({ value: this.value, action: this.actionFun() })
        }
        {
          this.errorMsg && (
            <div class="yfield__errors" >{this.errorMsg}</div>
          )
        }
      </div>
    ]) : null
  }
}

export default FieldList
</script>