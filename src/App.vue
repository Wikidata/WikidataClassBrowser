<template>
<div id="app">
  <app-navbar/>
  <router-view/>
  <app-footer/>
</div>
</template>

<style lang="less">
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import EntityLink from '@/components/EntityLink.vue'
import Snak from '@/components/Snak.vue'
import DataValue from '@/components/DataValue.vue'
import SqidImage from '@/components/SqidImage.vue'
import SqidBars from '@/components/SqidBars.vue'
import SqidCollapseButton from '@/components/SqidCollapseButton.vue'
import SqidCollapsibleCard from '@/components/SqidCollapsibleCard.vue'

Vue.component('entity-link', EntityLink)
Vue.component('snak', Snak)
Vue.component('data-value', DataValue)
Vue.component('sqid-image', SqidImage)
Vue.component('sqid-bars', SqidBars)
Vue.component('sqid-collapse-button', SqidCollapseButton)
Vue.component('sqid-collapsible-card', SqidCollapsibleCard)

@Component({
  components: {
    'app-navbar': AppNavbar,
    'app-footer': AppFooter,
  }})
export default class App extends Vue {
  @Action private loadTranslation!: (lang: string) => void

  private created() {
    const preferredLanguage = navigator.language.split('-')[0]
    this.loadTranslation(preferredLanguage)
  }
}
</script>

<style src="nprogress/nprogress.css" />
<style src="bootstrap/dist/css/bootstrap.css" />
<style src="bootstrap-vue/dist/bootstrap-vue.css" />
