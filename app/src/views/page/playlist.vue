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
const songsListData: Ref<Array<{
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
interface IComment {
  comments: Array<{
    content: string,
    time: string,
    likedCount: number,
    user: {
      nickname: string,
      avatarUrl: string
    }
  }>,
  total: number,
  code?: number
}

const commentListData: Ref<IComment> = ref({
  comments: [],
  total: 0,
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
      getPlayListComment({id}).then((data: IComment) => {
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
  <div class="h-[300px] flex flex-nowrap">
    <div class="w-[300px] relative">
      <img class="rounded-[20px] w-[300px] m-auto absolute top-0 left-0 right-0 bottom-0 hover:shadow-amber-100"
           :src="playListData.coverImgUrl"
           alt="">
    </div>
    <div class="flex-1 h-full pl-[20px] box-border">
      <div class="truncate h-1/6 flex items-center font-bold text-[28px]">{{ playListData.name }}</div>
      <div class="truncate flex items-center h-1/6 text-[22px]">Playlist by &nbsp; <span
          class="hover:underline cursor-pointer"> {{ playListData?.creator?.nickname }}</span></div>
      <div class="truncate h-[40px] text-[13px] text-gray-400">
        最后更新于{{ dataFormat(new Date(playListData.updateTime), 'YYYY年MM月DD日') }} ·
        {{ playListData.trackCount }} 首歌
      </div>
      <div class="flex items-center h-1/6 text-[12px] text-gray-400 multilineText py-[5px]">
        {{ playListData.description }}
      </div>
      <div class="h-1/3 my_text_left pt-2.5">
        <div class="my_ctrl_btn">播放</div>
        <div class="my_ctrl_btn">收藏</div>
        <div class="my_ctrl_btn">其他</div>
      </div>
    </div>
  </div>
  <div class="h-auto py-0.5">
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
      <el-tab-pane label="歌曲列表" name="first">
        <div v-for="(v,i) in songsListData" :key="v.id"
             class="relative flex flex-wrap h-[84px] p-0.5 hover:bg-blue-200 rounded-sm cursor-pointer  my_text_between"
             @dblclick="playMusicForId(v)"
             :class="{'bg-gray-100':i&1===1}">
          <div class="flex-wrap  flex h-full">
            <div>
              <img class="w-2 h-2 rounded-[10px]" :src="v.al.picUrl" alt="">
            </div>
            <div class="ml-[25px]">
              <div class="my_text_left w-full h-1/2 truncate">{{ v.name }}</div>
              <div class="my_text_left w-full h-1/2 text-[14px]] truncate text-gray-400">{{ v.ar[0].name }}</div>
            </div>
          </div>
          <div class="my_text_left w-5 h-full overflow-y-hidden absolute left-[44%]">
            {{ v.al.name }}
          </div>
          <div class="flex items-center flex-wrap w-5 my_text_center h-full">
            {{
              ("00" + Math.floor(Math.floor(v.dt / 1000) / 60)).slice(-2)
            }}:{{ ("00" + Math.floor(v.dt / 1000) % 60).slice(-2) }}
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'歌曲评论('+commentListData.total+')'" name="second">
        <div v-for="(v,i) in commentListData.comments" class="flex my-0.5 hover:bg-blue-200 rounded-[12px]" :key="i"
             :class="{'bg-gray-100':i&1===1}">
          <img :src="v.user.avatarUrl" alt="" class="w-1.5 h-1.5 rounded-full m-0.5">
          <div class="flex-1 py-0.5  box-border">
            <span class="text-[14px] text-[#aaff]">{{ v.user.nickname }}</span>: <span class=" max-h-[77px] ml-[10px]">{{
              v.content
            }}</span>
          </div>
          <div class="my_text_center p-0.5">{{ dataFormat(new Date(v.time), 'YYYY年MM月DD日 HH:mm:ss') }}</div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.my_ctrl_btn {
  @apply mt-0.5 my_text_center overflow-ellipsis transition duration-500 ease-in-out transform hover:-translate-y-[1px] hover:scale-110 mx-0.5 cursor-pointer h-1.5  inline-flex justify-center  px-1 border border-transparent shadow-sm text-[14px] font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700
}
</style>