<script lang="ts" setup>
import api from "@/api/banner";
import router from "@/router";
import {Ref} from "vue";

const {getBanner, getRecommendList, getAllTop, getNewAlbum} = api
onMounted(() => {
  getBannerData()
  getRecommendListData()
  getAllTopList()
  getNewAlbumData()
})
//轮播图列表
const bannerList:Ref<Array<{encodeId:string,imageUrl:string}>> = ref([] as Array<any>);
//热门推荐歌单
const recommendList:Ref<Array<{copywriter:string,name:string,picUrl:string,id:string}>> = ref([] as any[]);
//排行榜列表
const topList:Ref<Array<{coverImgUrl:string,name:string,updateFrequency:string,id:string}>> = ref([] as any[]);
//新专速递列表
const newAlbumList:Ref<Array<{subType:string,name:string,picUrl:string,id:string}>> = ref([] as any[])
//获取轮播图数据
const getBannerData = () => {
  getBanner({type: 0}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      bannerList.value = data.banners;
    }
  })
}
//获取全部榜单
const getAllTopList = () => {
  getAllTop().then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      topList.value = data.list
    }
  })
}
//获取推荐歌单列表
const getRecommendListData = () => {
  getRecommendList({}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      recommendList.value = data.result
    }
  })
}
//获取新歌速递
const getNewAlbumData = () => {
  getNewAlbum({}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      newAlbumList.value = data.albums
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
  <el-carousel indicator-position="outside" class="mx-auto">
    <el-carousel-item v-for="item in bannerList" :key="item.encodeId">
      <img :src="item.imageUrl" alt="">
    </el-carousel-item>
  </el-carousel>
  <div class="w-full h-16 font-bold text-4xl flex 2xl:items-center">推荐歌单</div>
  <div class="w-full h-auto flex flex-wrap justify-around">
    <div v-for="v in recommendList" :key="v.id" class="w-72 h-84 box-border p-2 relative">
      <img :src="v.picUrl" alt="" class="w-full rounded-2xl hover:shadow-2xl cursor-pointer mx-auto">
      <p class="text-left p-1 mt-0.5 h-12 overflow-hidden font-bold">{{ v.name }}</p>
      <p class="text-left p-1 mt-0.5 text-sm text-gray-400 ">{{ v.copywriter }}</p>
      <div class="cover absolute w-full h-3/4 bg-clip-text top-0 left-0 opacity-0">
        <div class="h-full relative">
          <div class="player_icon w-12 h-12 m-auto top-0 bottom-0 left-0 right-0 absolute" @click="showPlayList(v.id)">
            <svg viewBox="0 0 1024 1024"
                 xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
              <path fill="currentColor"
                    d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="w-72 h-0" v-for="i in 8" :key="i"></div>
  </div>
  <div class="w-full h-16 font-bold text-4xl flex 2xl:items-center">排行榜</div>
  <div class="w-full h-auto flex flex-wrap justify-around">
    <div v-for="v in topList" :key="v.id" class="w-72 h-84 box-border p-2 relative">
      <img :src="v.coverImgUrl" alt="" class="w-full rounded-2xl hover:shadow-2xl cursor-pointer mx-auto">
      <p class="text-left p-1 mt-0.5 h-8 text-xl overflow-hidden font-bold">{{ v.name }}</p>
      <p class="text-left p-1  text-sm text-gray-400">{{ v?.updateFrequency }}</p>
      <div class="cover absolute w-full h-3/4 bg-clip-text top-0 left-0 opacity-0">
        <div class="h-full relative">
          <div class="player_icon w-12 h-12 m-auto top-0 bottom-0 left-0 right-0 absolute">
            <svg viewBox="0 0 1024 1024"
                 xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
              <path fill="currentColor"
                    d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="w-72 h-0" v-for="i in 8" :key="i"></div>
  </div>
  <div class="w-full h-16 font-bold text-4xl flex 2xl:items-center">新专速递</div>
  <div class="w-full h-auto flex flex-wrap justify-around">
    <div v-for="v in newAlbumList" :key="v.id" class="w-72 h-84 box-border p-2 relative">
      <img :src="v.picUrl" alt="" class="w-full rounded-2xl hover:shadow-2xl cursor-pointer mx-auto">
      <p class="text-left p-1 mt-0.5 h-12 overflow-hidden font-bold">{{ v.name }}</p>
      <p class="text-left p-1 mt-0.5 text-sm text-gray-400 ">{{ v.subType }}</p>
      <div class="cover absolute w-full h-3/4 bg-clip-text top-0 left-0 opacity-0">
        <div class="h-full relative">
          <div class="player_icon w-12 h-12 m-auto top-0 bottom-0 left-0 right-0 absolute">
            <svg viewBox="0 0 1024 1024"
                 xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
              <path fill="currentColor"
                    d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 832a384 384 0 0 0 0-768 384 384 0 0 0 0 768zm-48-247.616L668.608 512 464 375.616v272.768zm10.624-342.656 249.472 166.336a48 48 0 0 1 0 79.872L474.624 718.272A48 48 0 0 1 400 678.336V345.6a48 48 0 0 1 74.624-39.936z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="w-72 h-0" v-for="i in 8" :key="i"></div>
  </div>
</template>
<style lang="scss" scoped>
.cover {
  &:hover {
    opacity: 1;
    transition: all .8s;
  }
}

.player_icon {
  $img: 'https://static.pexels.com/photos/373934/pexels-photo-373934.jpeg';
  border-radius: 50%;
  line-height: 2;
  margin: auto;
  color: #eff9;
  background: rgba(255, 255, 255, .3);
  cursor: pointer;
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

.grid_box {
  &::after {
    content: '';
    flex: auto;
  }
}
</style>