<template>
  <div>
    <pc-header v-show='routerShow'/>
    <router-view/>
    <pc-footer/>
  </div>
</template>

<script>
import pcHeader from '@/components/layout/header'
import pcFooter from '@/components/layout/footer'

export default {
  data () {
    return {
      routerShow: true
    }
  },
  components: {
    pcHeader,
    pcFooter
  }
}
</script>
