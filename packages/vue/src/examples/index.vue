<script>
import ElementUi from './element-ui/index'
import EditForm from './element-ui/EditForm'

export default {
  data () {
    return {
      tab: '2',
    }
  },
  render () {
    const Tabs = {
      1: {
        component: ElementUi,
        name: '查询式table'
      },
      2: {
        component: EditForm,
        name: '复杂表单'
      }
    }

    return (
      <div>
        aaa333
        <el-tabs v-model={this.tab}>
          {
            Object.keys(Tabs).map(key => {
              const { name, component } = Tabs[key]
              return (
                <el-tab-pane key={key} label={name} name={key}>
                  <component />
                </el-tab-pane>
              )
            })
          }
        </el-tabs>
      </div>
    )
  }
}
</script>
