<script>
export default {
  props: {
    isAutoWidth: Boolean,
    updateAll: Boolean
  },
  computed: {
    YForm() {
      const getParentForm = (context) => {
        let parent = context.$parent
        let parentName = parent && parent.$options && parent.$options.componentName
        while (parentName !== 'YFORM') {
          parent = parent && parent.$parent
        }
        return parent
      }
      return getParentForm(this)
    },
    YField() {
      const getParentForm = (context) => {
        let parent = context.$parent
        let parentName = parent && parent.$options && parent.$options.componentName
        while (parentName !== 'YFIELD') {
          parent = parent && parent.$parent
        }
        return parent
      }
      return getParentForm(this)
    },
  },
  render() {
    const slots = this.$slots.default;
    if (!slots) return null
    console.log(this.isAutoWidth)
    if (this.isAutoWidth) {
      console.log(!this.YForm)
      if (!this.YForm) return slots[0]
      const autoLabelWidth = this.YForm.autoLabelWidth;
      console.log(autoLabelWidth)
      const style = {};
      if (autoLabelWidth && autoLabelWidth !== 'auto') {
        const marginLeft = parseInt(autoLabelWidth, 10) - this.computedWidth;
        if (marginLeft) {
          style.marginLeft = marginLeft + 'px';
        }
      }
      return (<div class="yfield__label-wrap" style={style}>
        { slots }
      </div>);
    } else {
      return slots[0];
    }
  },
  methods: {
    getLabelWidth() {
      if (this.$el && this.$el.firstElementChild) {
        const computedWidth = window.getComputedStyle(this.$el.firstElementChild).width;
        return Math.ceil(parseFloat(computedWidth));
      } else {
        return 0;
      }
    },
    updateLabelWidth(action = 'update') {
      if (this.$slots.default && this.isAutoWidth && this.$el.firstElementChild) {
        if (action === 'update') {
          this.computedWidth = this.getLabelWidth();
        } else if (action === 'remove') {
          this.YForm.deregisterLabelWidth(this.computedWidth);
        }
      }
    }
  },
  watch: {
    computedWidth(val, oldVal) {
      if (this.updateAll) {
        this.YForm.registerLabelWidth(val, oldVal);
        this.YField.updateComputedLabelWidth(val);
      }
    }
  },
  data() {
    return {
      computedWidth: 0
    };
  },
  mounted() {
    this.updateLabelWidth('update');
  },
  updated() {
    this.updateLabelWidth('update');
  },
  beforeDestroy() {
    this.updateLabelWidth('remove');
  }
};
</script>