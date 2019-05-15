let mixin = {
  data () {
    return {}
  },
  methods: {
    getUrlParam (name) {
      // let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      // let result = window.location.search.substr(1).match(reg)
      // return result ? decodeURIComponent(result[2]) : null
      return this.$route.query.name
    },
    loadPage (routerName, param) {
      if (param) {
        this.$router.push({name: routerName, query: param})
      } else {
        this.$router.push({name: routerName})
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    goHome () {
      this.loadPage('Index')
    },
    goSignIn () {
      this.loadPage('Login')
    },
    goSignUp () {
      this.loadPage('Register')
    }
  }
}

export default mixin
