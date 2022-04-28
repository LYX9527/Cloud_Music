<script lang="ts" setup>
import api from "@/api/banner";
import router from "@/router";
import * as NProgress from "nprogress";

const {getBanner, getRecommendList, getAllTop, getNewAlbum} = api
onMounted(() => {
  NProgress.start();
  getBannerData()
  getRecommendListData(12)
  getAllTopList()
  getNewAlbumData(12)
  NProgress.done();
})
//轮播图列表
const bannerList: Ref<Array<{ encodeId: string, imageUrl: string }>> = ref([]);
//热门推荐歌单
const recommendList: Ref<Array<{ copywriter: string, name: string, picUrl: string, id: string }>> = ref([]);
//排行榜列表
const topList: Ref<Array<{ coverImgUrl: string, name: string, updateFrequency: string, id: string }>> = ref([]);
//新专速递列表
const newAlbumList: Ref<Array<{ subType: string, name: string, picUrl: string, id: string }>> = ref([])
//当前新专速递偏移量
const nowAlbumOffset: Ref<number> = ref(0)
//获取轮播图数据
const getBannerData = () => {
  getBanner({type: 0}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      bannerList.value = data.banners;
    }
  })
}
//获取全部榜单
const getAllTopList = (num?: number) => {
  getAllTop().then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      topList.value = data.list.slice(0, num || 12)
    }
  })
}
//获取推荐歌单列表
const getRecommendListData = (limit?: number,) => {
  getRecommendList({limit}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      recommendList.value = data.result
    }
  })
}
//获取新歌速递
const getNewAlbumData = (limit?: number, offset?: number) => {
  getNewAlbum({limit, offset: offset || nowAlbumOffset.value*12}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      newAlbumList.value = [...newAlbumList.value, ...data.albums]
    }
  })
}
//跳转到歌单内容列表
const showPlayList = (id: string) => {
  router.push({
    path: '/index/playlist',
    query: {id}
  })
}
</script>
<template>
  <el-carousel indicator-position="outside" type="card">
    <el-carousel-item v-for="item in bannerList" :key="item.encodeId">
      <div class="my_xy_full relative bg-contain bg-no-repeat bg-center"
           :style="{backgroundImage:`url(${item.imageUrl})`}">
        <!--        <img :src="item.imageUrl" alt="" class="absolute top-0 bottom-0 left-0 right-0 h-[300px] mx-auto">-->
      </div>
    </el-carousel-item>
  </el-carousel>
  <div class="music_list_title">推荐歌单<span class="music_list_side_ctl" @click="getRecommendListData(99)">显示全部</span>
  </div>
  <div class="music_list_content">
    <div v-for="v in recommendList" :key="v.id" class="lg:w-1/6 w-[150px] box-border p-0.5">
      <div class="relative">
        <img v-imgLazy="v.picUrl" alt="" class="w-full rounded-[20px] hover:shadow-2xl cursor-pointer mx-auto">
        <div class="cover absolute my_xy_full bg-clip-text top-0 left-0 opacity-0">
          <div class="h-full relative">
            <div class="player_icon w-2 h-2 m-auto top-0 bottom-0 left-0 right-0 absolute" @click="showPlayList(v.id)">
              <svg viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p class="text-left  mt-[10px] text-[18px]  overflow-ellipsis font-bold">{{ v.name }}</p>
      <p class="text-left mt-[10px] text-[16px] text-gray-400 overflow-ellipsis">{{ v.copywriter }}</p>
    </div>
    <div class="lg:w-1/6 w-[150px] box-border p-0.5 relative" v-for="i in 8" :key="i"></div>
  </div>
  <div class="music_list_title">排行榜
    <span class="music_list_side_ctl" @click="getAllTopList(99)">显示全部</span></div>
  <div class="music_list_content">
    <div v-for="v in topList" :key="v.id" class="lg:w-1/6 w-[150px] box-border p-0.5 ">
      <div class="relative">
        <img v-imgLazy="v.coverImgUrl" alt="" class="w-full rounded-[20px] hover:shadow-2xl cursor-pointer mx-auto">
        <div class="cover absolute my_xy_full bg-clip-text top-0 left-0 opacity-0">
          <div class="h-full relative">
            <div class="player_icon w-2 h-2 m-auto top-0 bottom-0 left-0 right-0 absolute">
              <svg viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p class="text-left  mt-[10px] text-[18px]  overflow-ellipsis font-bold">{{ v.name }}</p>
      <p class="text-left mt-[10px] text-[16px] text-gray-400 overflow-ellipsis">{{ v?.updateFrequency }}</p>
    </div>
    <div class="lg:w-1/6 w-[150px] box-border p-0.5 relative" v-for="i in 8" :key="i"></div>
  </div>
  <div class="music_list_title">新专速递</div>
  <div class="music_list_content">
    <div v-for="v in newAlbumList" :key="v.id" class="lg:w-1/6 w-[150px] box-border p-0.5 ">
      <div class="relative">
        <img v-imgLazy="v.picUrl" alt="" class="w-full rounded-[20px] hover:shadow-2xl cursor-pointer mx-auto">
        <div class="cover absolute my_xy_full bg-clip-text top-0 left-0 opacity-0">
          <div class="h-full relative">
            <div class="player_icon w-2 h-2 m-auto top-0 bottom-0 left-0 right-0 absolute">
              <svg viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <p class="text-left  mt-[10px] text-[18px]  overflow-ellipsis font-bold">{{ v.name }}</p>
      <p class="text-left mt-[10px] text-[16px] text-gray-400 overflow-ellipsis">{{ v.subType }}</p>
    </div>
    <div class="lg:w-1/6 w-[150px] box-border p-0.5 relative" v-for="i in 8" :key="i"></div>
  </div>
  <div class="h-3 my_text_center">
    <div class="text-[25px] font-bold bg-[#f1f1f5] p-0.5 rounded-3xl px-1.5 cursor-pointer" @click="getNewAlbumData(12,++nowAlbumOffset*12)">加载更多
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cover {
  &:hover {
    opacity: 1;
    transition: all .8s;
  }
}

.music_list_title {
  @apply w-full h-5 font-bold text-[36px] flex 2xl:items-center relative py-1 px-0.5;
}

.music_list_content {
  @apply w-full h-auto flex flex-wrap justify-around
}

.music_list_side_ctl {
  @apply absolute right-0.5 text-[18px] cursor-pointer hover:underline;
}
</style>