import { createStore } from 'vuex'
import createPersistedStata from 'vuex-persistedstate'//引持续化插件
import state from './state'
import mutations from './mutations'
import actions from './actions'
export default createStore({
  state,
  mutations,
  actions,
  plugins:[
    createPersistedStata()
  ]
})
