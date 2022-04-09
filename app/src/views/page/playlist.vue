<script lang="ts" setup>
import api from "@/api/banner";
import {dataFormat} from "@/hooks/utils/dataFormat"

const {getPlayListDetail, getSongDetail, getSongUrl, getPlayListComment} = api
import {ICtrlMusicList, ICtrlPlayingMusic, ICtrlPlayState, setMusicList, setPlayingMusic, setPlayState} from "@/hooks"
import {PlayingMusic} from "@/typings";
import type {TabsPaneContext} from 'element-plus'
import {Ref} from "vue";

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const {setplaystate}: ICtrlPlayState = setPlayState();
const {setplayingmusic}: ICtrlPlayingMusic = setPlayingMusic();
const {setmusiclist}: ICtrlMusicList = setMusicList();
const route = useRoute()
onMounted(() => {
  const id = route.query.id || "";
  if (id !== "") {
    getPlayListDetailData(id)
  }
})
//监听路由Id变化
watch(() => route.query.id, (id) => {
  if (id !== "") {
    getPlayListDetailData(id)
  }
})
//歌单详情数据
const playListData: Ref<{
  coverImgUrl: string,
  name: string,
  creator: {
    nickname: string,
    avatarUrl: string
  },
  updateTime: string,
  trackCount: number,
  description: string
}> = ref({
  coverImgUrl: '',
  name: '',
  creator: {
    nickname: '',
    avatarUrl: ''
  },
  updateTime: '',
  trackCount: -1,
  description: ''
})
//歌单中歌曲详情列表
const songsListData:Ref<Array<{
  id: string,
  name: string,
  dt: number,
  al: {
    picUrl: string,
    name: string
  },
  ar: Array<{
    name: string
  }>,
}>> = ref([])
//歌单评论列表数据
const commentListData = ref({
  comments: [],
  total: 0
})
//获取歌单详情
const getPlayListDetailData = (id: any) => {
  getPlayListDetail({id}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      playListData.value = data.playlist;
      const ids: Array<number> = [];
      data.playlist.trackIds.forEach((item: { [key: string]: any }) => {
        ids.push(item.id)
      })
      const str = ids.join(",");
      getSongDetail({ids: str}).then((data: { [key: string]: any }) => {
        if (data.code == 200) {
          songsListData.value = data.songs
        }
      })
      getPlayListComment({id}).then((data: { [key: string]: any }) => {
        if (data.code == 200) {
          commentListData.value.comments = data.comments
          commentListData.value.total = data.total
          console.log(data)
        }
      })
    }
  })
}
//双击播放歌曲
const playMusicForId = (info: { [key: string]: any }) => {
  getSongUrl({id: info.id}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      const playingMusic: PlayingMusic = {id: "", name: "", url: "", author: "", size: 0, picUrl: ''};
      playingMusic.id = info.id
      playingMusic.url = data.data[0].url
      playingMusic.author = info.ar[0].name
      playingMusic.size = info.dt
      playingMusic.picUrl = info.al.picUrl
      playingMusic.name = info.name
      setplayingmusic(playingMusic);
      setmusiclist(songsListData.value);
    }
  })
  setplaystate(true);
}
</script>
<template>
  <div class="h-80 flex flex-nowrap">
    <div class="w-1/4 relative">
      <img class="rounded-3xl w-80 m-auto absolute top-0 left-0 right-0 bottom-0" :src="playListData.coverImgUrl"
           alt="">
    </div>
    <div class="w-3/4 h-full pl-4 box-border">
      <div class="h-1/6 flex items-center font-bold text-4xl">{{ playListData.name }}</div>
      <div class=" flex items-center h-1/6 text-xl">Playlist by &nbsp; <span
          class="hover:underline cursor-pointer"> {{ playListData?.creator?.nickname }}</span></div>
      <div class="h-1/6 text-sm text-gray-400">最后更新于{{ dataFormat(new Date(playListData.updateTime), 'YYYY年MM月DD日') }} ·
        {{ playListData.trackCount }} 首歌
      </div>
      <div class=" flex items-center h-1/6 text-sm text-gray-400">{{ playListData.description }}</div>
      <div class="h-1/3 flex">
        <div
            class="mt-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 mx-1.5 cursor-pointer h-10 leading-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          播放
        </div>
        <div
            class="mt-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 mx-1.5 cursor-pointer h-10 leading-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          收藏
        </div>
        <div
            class="mt-8 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110 mx-1.5 cursor-pointer h-10 leading-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          其他
        </div>
      </div>
    </div>
  </div>
  <div class="h-auto py-4">
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
      <el-tab-pane label="歌曲列表" name="first">
        <div v-for="v in songsListData" :key="v.id"
             class="relative flex flex-wrap h-16 p-2 hover:bg-blue-200 rounded-xl cursor-pointer px-4"
             @dblclick="playMusicForId(v)">
          <img class="w-12 h-12 rounded-xl" :src="v.al.picUrl" alt="">
          <div class="absolute left-24 flex-wrap w-36 flex h-full leading-8">
            <div class="w-full h-1/2 truncate">{{ v.name }}</div>
            <div class="w-full h-1/2 text-sm text-gray-400">{{ v.ar[0].name }}</div>
          </div>
          <div class="absolute left-0 right-0 mx-auto flex items-center w-36 h-full top-0 overflow-y-hidden leading-8">
            {{ v.al.name }}
          </div>
          <div class="flex items-center absolute right-12 flex-wrap w-36  h-full top-0">
            {{
              ("00" + Math.floor(Math.floor(v.dt / 1000) / 60)).slice(-2)
            }}:{{ ("00" + Math.floor(v.dt / 1000) % 60).slice(-2) }}
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'歌曲评论('+commentListData.total+')'" name="second">
        <div v-for="v in commentListData.comments" class="flex">
          <img :src="v.user.avatarUrl" alt="" class="w-12 h-12 rounded-full mx-2.5">
          <div class="flex-1">
            {{ v.user.nickname }}:{{ v.content }}
          </div>
          <div>{{ dataFormat(new Date(v.time), 'YYYY年MM月DD日 HH:mm:ss') }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>

</style>