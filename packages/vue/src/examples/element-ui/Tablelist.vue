<script>
import {
  ElForm,
  ElField,
  ElQueryTable,
  ElButton
} from '../../../element-ui/index.js'
import axios from 'axios'

export default {
  data () {
    return {
      values: {}
    }
  },

  render() {
    
    const serve = async ({ params, formValues }) => {
      const res = await axios.post('https://yapi.weierai.com/mock/171/api/sardine/wechat/pageList', {
        ...formValues,
        pageIndex: params.currentPage,
        pageSize: params.pageSize
      })
      const { data } = res.data
      return {
        total: data.total,
        data: data.results
      }
    }

    const columns = [
      { type: 'selection' },
      { label: '工作微信号', prop: 'wechatId' },
      { label: '微信手机号', prop: 'wechatPhone' },
      { label: '微信状态', prop: 'wechatOnline' },
      { label: '设备IMEI', prop: 'deviceId' },
      { label: '所属客服', prop: 'customerNick' },
      { label: '好友总数', prop: 'friendNum', sortable: true }
    ]

    return (
      <ElForm v-model={this.values} inline>
        <div>
          <ElField label="工作微信号" name="wechatId" clearable />
          <ElField label="工作手机号" name="wechatPhone" clearable />
          <ElButton do="search" ref="searchBtn"/>
        </div>
        <ElQueryTable
          serve={serve}
          columns={columns}
        />
      </ElForm>
    )

  },
}
</script>