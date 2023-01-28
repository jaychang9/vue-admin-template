<template>
  <div class="app-container">
    <h1>系统用户</h1>
  </div>
</template>

<script>
export default {
  name: 'User',
  components: { },
  filters: {
  },
  data() {
    return {
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      console.log('fetchData')
    }
  }
}
</script>
