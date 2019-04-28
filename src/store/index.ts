import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState} from './types'
import { i18n } from './i18n/index'
import { login } from './login/index'
import { terms } from './terms/index'

Vue.use(Vuex)

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    i18n,
    login,
    terms,
  },
}

export default new Vuex.Store<RootState>(store)