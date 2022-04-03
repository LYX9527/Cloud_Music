<script lang="ts" setup>
import api from "@/api/banner";
const {getBanner,getAllTop} = api
onMounted(() => {
  getAllTopList()
})
//获取全部榜单
const getAllTopList = () => {
  // getAllTop().then(data => {
  //   console.log(data)
  // })
}
</script>
<template>
  FOUND
</template>
<style lang="scss" scoped>

</style>