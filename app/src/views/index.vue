<script lang="ts" setup>
import api from "@/api/banner"
import {animateCSS, ICtrlPlayingMusic, setPlayingMusic} from "@/hooks"
import Cookies from "js-cookie";
import Lyric from 'lrc-file-parser'
import {IState, PlayingMusic} from "@/typings";
import {ICtrlPlayState, setPlayState} from "@/hooks"
import {Ref} from "vue";

const router = useRouter();
const {setplayingmusic}: ICtrlPlayingMusic = setPlayingMusic();
const {getSongUrl, getUserPlayList, getMusicLyric} = api
//获取audio元素
const audio = ref(null)
//获取vuex的store
const store = useStore()
const {setplaystate}: ICtrlPlayState = setPlayState();
const lyricList: Ref<Array<lines>> = ref([])
const musicInfo = reactive({
  name: '',
  url: '',
  author: '',
  size: 0,
  picUrl: '',
  id: '',
  lyric: '',
})
//歌词界面状态
const lyricShowState = ref(false)

interface lines {
  time: Number,
  text: String,
}

//歌词
const lrcCtrl = new Lyric({
  onPlay(line: Number, text: String) {
    // console.log(line, text)
    nowPlayingLyric.value = {
      line,
      text
    }
    for (let key in lyricList.value) {
      if (+key == line) {
        if (line > 5) {
          document.getElementById("my_lyric")!.scrollTop = 100 * ((line as number) - 5);
        }
      }
    }
  },
  onSetLyric(lines: lines[]) {
    // console.log(lines)
    lyricList.value = lines
  },
  offset: 0,
  isRemoveBlankLine: true,
  lyric: '',
  translationLyric: '',
})
const sidebarWidth = ref(0);
const playStatus = computed(() => store.state.playState)
const playingMusic = computed(() => store.state.playingMusic)
const musicListData = computed(() => store.state.musicList);
const userInfo = computed(() => store.state.userInfo);
const listStatus = ref(false)
const audioUrl = ref("");
const musicProgress = ref(0)
const nowPlayingLyric: Ref<{ line: Number, text: String }> = ref({line: 0, text: ''})
//双击播放歌曲
const playMusicForId = (info: { [key: string]: any }) => {
  getSongUrl({id: info.id}).then(async (data: { [key: string]: any }) => {
    if (data.code == 200) {
      const playingMusic: PlayingMusic = {id: "", name: "", url: "", author: "", size: 0, picUrl: '', lyric: ''};
      playingMusic.id = info.id
      playingMusic.url = data.data[0].url
      playingMusic.author = info.ar[0].name
      playingMusic.size = info.dt
      playingMusic.picUrl = info.al.picUrl
      playingMusic.name = info.name
      playingMusic.lyric = await getMusicLyricData(info.id)
      setplayingmusic(playingMusic);
    }
  })
  setplaystate(true);
  try {
    document.getElementById("my_lyric")!.scrollTop = 0;
  } catch (e) {
    console.log("切换失败")
  }
}
//获取歌词
const getMusicLyricData = async (id: string): Promise<string> => {
  let lyc = ""
  await getMusicLyric({id}).then((data: { [key: string]: any }) => {
    if (data.code == 200) {
      lyc = data.lrc.lyric
    } else {
      lyc = "暂无歌词"
    }
  })
  return lyc
}
//设置定时器
let timer: NodeJS.Timer;
onMounted(() => {
  setplaystate(false);
  clearInterval(timer)
})
onUnmounted(() => {
  clearInterval(timer)
})
//监听播放自动下一首
watch([playStatus, playingMusic], (newVal: [boolean, PlayingMusic], oldVal: [boolean, PlayingMusic]) => {
  const AudioPlayer = (audio.value as any)
  if (newVal[1].id !== oldVal[1].id) {
    console.log("我换歌了")
    audioUrl.value = playingMusic.value.url;
    musicInfo.picUrl = playingMusic.value.picUrl;
    musicInfo.name = playingMusic.value.name
    musicInfo.author = playingMusic.value.author
    musicInfo.size = playingMusic.value.size
    musicInfo.id = playingMusic.value.id
    musicInfo.lyric = playingMusic.value.lyric
    nextTick(() => {
      AudioPlayer.play();
      lrcCtrl.setLyric(musicInfo.lyric)
      lrcCtrl.play(0)
      timer = setInterval(() => {
        if (audio.value == null) {
          clearInterval(timer)
          ElMessage.error("系统未知错误，请刷新页面再试")
        }
        musicProgress.value = AudioPlayer.currentTime
        if ((musicInfo.size / 1000 + 1) > AudioPlayer.currentTime && (musicInfo.size / 1000 - 1) < AudioPlayer.currentTime) {
          let nowIndex = 0;
          musicListData.value.forEach((music: { [key: string]: string }, index: number) => {
            if (musicInfo.id == music.id) {
              if (index == musicListData.value.length - 1) {
                nowIndex = 0;
              } else {
                nowIndex = index;
              }
              return
            }
          })
          clearInterval(timer);
          playMusicForId(musicListData.value[nowIndex + 1]);
        }
      }, 1000)
    })
  } else {
    if (newVal[0]) {
      nextTick(() => {
        AudioPlayer.play();
        lrcCtrl.play(AudioPlayer.currentTime * 1000)
      })
      console.log("我没有换歌 我开始播放了")

    } else {
      nextTick(() => {
        AudioPlayer.pause();
        lrcCtrl.pause()
      })
      console.log("我没有换歌 我暂停了")
    }
  }
})

interface IUserPlayList {
  id: string;
  name: string;
  picUrl: string;
  playCount: number;
  trackCount: number;
  userId: string;
  coverImgUrl: string;
}

//用户收藏歌单
const userCollectionPlayListData: Ref<Array<IUserPlayList>> = ref([]);
//用户创建歌单
const userCreatePlayListData: Ref<Array<IUserPlayList>> = ref([]);
//上一首
const lastMusic = () => {
  let nowIndex = 0;
  musicListData.value.forEach((music: { [key: string]: string }, index: number) => {
    if (musicInfo.id == music.id) {
      if (index == 0) {
        nowIndex = 1;
      } else {
        nowIndex = index;
      }
      return
    }
  })
  playMusicForId(musicListData.value[nowIndex - 1]);
}
//下一首
const nextMusic = () => {
  let nowIndex = 0;
  musicListData.value.forEach((music: { [key: string]: string }, index: number) => {
    if (musicInfo.id == music.id) {
      if (index == musicListData.value.length - 1) {
        nowIndex = 0;
      } else {
        nowIndex = index;
      }
      return
    }
  })
  playMusicForId(musicListData.value[nowIndex + 1]);
}
//控制进度条
const changeProgress = () => {
  nextTick(() => {
    if (audio.value != null) {
      (audio.value as any).currentTime = musicProgress.value
      lrcCtrl.play(musicProgress.value * 1000)
    }
  })
}
//跳转到登录
const alertLogin = () => {
  router.push({
    path: "/login"
  })
}

//控制播放与暂停
const playCtrl = () => {
  setplaystate(!playStatus.value);
}
//控制侧边栏
const ctrlSidebar = () => {
  if (userInfo.value.account && userInfo.value.account.id && userInfo.value.account.id != '') {
    sidebarWidth.value = sidebarWidth.value === 0 ? 300 : 0;
    getUserPlayListData(userInfo.value.account.id);
  } else {
    ElMessage.error("请先登录");
  }
}
/**
 * 获取用户歌单
 * @param uid 用户id
 */
const getUserPlayListData = (uid: string) => {
  getUserPlayList({uid}).then((data: { [key: string]: any }) => {
    console.log(data)
    if (data.code == 200) {
      userCollectionPlayListData.value = data.playlist.filter((item: IUserPlayList) => {
        return item.userId != uid
      })
      userCreatePlayListData.value = data.playlist.filter((item: IUserPlayList) => {
        return item.userId == uid
      })
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
//歌词界面显示状态
const lyricShow = () => {
  lyricShowState.value = true;
}
//隐藏歌词
const hideLyric = () => {
  animateCSS(".my_lyric_page", "slideOutDown").then(() => {
    lyricShowState.value = false;
  })
}
</script>
<template>
  <div class="common-layout my_xy_full">
    <el-container class="my_xy_full">
      <el-aside :style="{width:`${sidebarWidth}px`}" class="animate__animated "
                :class="{'animate__zoomOutLeft':!sidebarWidth,'animate__zoomInLeft':sidebarWidth}">
        <div class="w-full h-2 font-bold text-[28px] text-center leading-[.5rem]">我的歌单</div>
        <div class="song_list_title">我创建的歌单</div>
        <div v-for="v in userCreatePlayListData" :key="v.id" class="song_list"
             @click="showPlayList(v.id)">
          <img :src="v.coverImgUrl" alt="" class="w-2 h-2">
          <span class="text-[16px] flex-1  px-1">{{ v.name }}</span>
        </div>
        <div class="song_list_title">我收藏的歌单</div>
        <div v-for="v in userCollectionPlayListData" :key="v.id" class="song_list"
             @click="showPlayList(v.id)">
          <img :src="v.coverImgUrl" alt="" class="w-2 h-2">
          <span class="text-[16px] flex-1  px-1">{{ v.name }}</span>
        </div>
      </el-aside>
      <el-container class="relative">
        <el-header>
          <div class="w-full h-full flex flex-nowrap">
            <div class="h_ctrl w-1/4">
              <svg @click="ctrlSidebar" class="arrow" width="45" height="25"
                   viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M128 320v576h576V320H128zm-32-64h640a32 32 0 0 1 32 32v640a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V288a32 32 0 0 1 32-32zM960 96v704a32 32 0 0 1-32 32h-96v-64h64V128H384v64h-64V96a32 32 0 0 1 32-32h576a32 32 0 0 1 32 32zM256 672h320v64H256v-64zm0-192h320v64H256v-64z"></path>
              </svg>
              <svg @click="router.go(-1)" class="arrow" width="45" height="25" viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"></path>
              </svg>
              <svg @click="router.go(1)" class="arrow" width="45" height="25" viewBox="0 0 1024 1024"
                   xmlns="http://www.w3.org/2000/svg" data-v-ba633cb8="">
                <path fill="currentColor"
                      d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"></path>
              </svg>
            </div>
            <div class="h_title w-1/2">
              <span @click="router.push({path:'/index/home'})">首页</span>
              <span @click="router.push({path:'/index/found'})">发现</span>
              <span>音乐库</span>
            </div>
            <div class="h_login w-1/4">
              <img src="@/assets/header_defult.jpg" alt="" class="w-1.5" @click="alertLogin">
            </div>
          </div>
        </el-header>
        <el-main>
          <el-drawer v-model="listStatus" :with-header="false">
            <div class="my_xy_full overflow-auto music_list">
              <div class="w-full h-2 font-bold text-[24px] flex my_text_left">正在播放</div>
              <div
                  class="h-3 box-border px-0.5 my_text_between hover:bg-blue-300 rounded-[10px] relative  cursor-pointer ">
                <img class="w-2.5 h-2.5 rounded-[10px]" v-if="musicInfo.picUrl===''" src="@/assets/netease-music.png"
                     alt="">
                <img class="w-2.5 h-2.5 rounded-[10px]" v-else :src="musicInfo.picUrl" alt="">
                <div class="flex-wrap w-8 flex h-full flex-1">
                  <div class="my_text_center w-full h-1/2 truncate">{{ musicInfo.name }}</div>
                  <div class="my_text_center w-full h-1/2 text-[14px] text-gray-400">{{ musicInfo.author }}</div>
                </div>
                <div class="flex items-center right-0 absolute flex-wrap w-2 h-full ">
                  {{
                    ("00" + Math.floor(Math.floor(musicInfo.size / 1000) / 60)).slice(-2)
                  }}:{{ ("00" + Math.floor(musicInfo.size / 1000) % 60).slice(-2) }}
                </div>
              </div>
              <div class="w-full h-2 font-bold text-[24px] flex my_text_left">即将播放</div>
              <div
                  class="h-3 box-border px-0.5 my_text_between hover:bg-blue-300 rounded-[10px] relative  cursor-pointer "
                  v-for="v in musicListData" @click="playMusicForId(v)">
                <img class="w-2.5 h-2.5 rounded-[10px]" :src="v.al.picUrl" alt="">
                <div class="flex-wrap w-8 flex h-full flex-1">
                  <div class="my_text_center w-full h-1/2 truncate">{{ v.name }}</div>
                  <div class="my_text_center w-full h-1/2 text-[14px] text-gray-400">{{ v.ar[0].name }}</div>
                </div>
                <div class="flex items-center right-0 absolute flex-wrap w-2 h-full ">
                  {{
                    ("00" + Math.floor(Math.floor(v.dt / 1000) / 60)).slice(-2)
                  }}:{{ ("00" + Math.floor(v.dt / 1000) % 60).slice(-2) }}
                </div>
              </div>
            </div>
          </el-drawer>
          <router-view></router-view>
        </el-main>
        <el-footer class="my_text_between">
          <audio :src="audioUrl" class="hidden" ref="audio"></audio>
          <div class="w-1/6 flex items-center">
            <img class="w-3 h-3" v-if="musicInfo.picUrl===''" src="@/assets/netease-music.png" alt="">
            <img class="w-3 h-3" v-else :src="musicInfo.picUrl" alt="">
            <div class=" h-full flex flex-wrap ml-[10px]">
              <div class="w-full h-1/2 flex items-center text-[18px] truncate">{{ musicInfo.name }}</div>
              <div class="w-full h-1/2 flex items-center  text-gray-400">{{ musicInfo.author }}</div>
            </div>
          </div>
          <div class="w-1/2 h-full flex flex-wrap">
            <div class="my_text_around h-1/2 w-full box-border pt-0.5">
              <b-icon-skip-backward-fill @click="lastMusic" class="my_ctrl_icon"/>
              <b-icon-skip-end-circle-fill @click="playCtrl" v-if="!playStatus" class="my_ctrl_icon"/>
              <b-icon-pause-circle-fill @click="playCtrl" v-if="playStatus" class="my_ctrl_icon"/>
              <b-icon-skip-forward-fill @click="nextMusic" class="my_ctrl_icon"/>
            </div>
            <div class="h-1/2 w-full my_text_around">
              <div class="my_time_step">
                {{ ("00" + Math.floor(musicProgress / 60)).slice(-2) }}:{{
                  ("00" + Math.floor(musicProgress) % 60).slice(-2)
                }}
              </div>
              <div class="flex items-center h-full w-[90%] ml-1.5 mr-0.5">
                <el-slider @change="changeProgress" v-model="musicProgress" :step="1" size='small'
                           class="h-full w-full " :show-tooltip="false"
                           :max="Math.floor(musicInfo.size/1000)"/>
              </div>
              <div class="my_time_step">
                {{ ("00" + Math.floor(Math.floor(musicInfo.size / 1000) / 60)).slice(-2) }}:{{
                  ("00" + Math.floor(musicInfo.size / 1000) % 60).slice(-2)
                }}
              </div>
            </div>
          </div>
          <div class="w-1/6 my_text_between">
            <b-icon-music-note-list @click="listStatus = true" class="my_ctrl_icon"/>
            <b-icon-arrow-repeat class="my_ctrl_icon"/>
            <b-icon-arrow-left-right class="my_ctrl_icon"/>
            <b-icon-capslock @click="lyricShow" class="my_ctrl_icon"/>
          </div>
        </el-footer>
        <div class="my_lyric_page my_xy_full z-50 bg-[#1f1f1f] absolute top-0 left-0 animate__faster animate__animated"
             :class="{'animate__slideInUp':lyricShowState,'hidden':!lyricShowState}">
          <div class="h-[70px] w-full">
            <div
                class="h-[55px] w-[55px] absolute right-[48px] transition-all top-[12px] hover:bg-[#2e2e2e]  my_text_center rounded-[10px]"
                @click="hideLyric">
              <b-icon-chevron-down class="my_ctrl_icon text-[#5d5d5d] hover:text-[#efefef]"/>
            </div>
          </div>
          <div class="lyric_box">
            <div class="flex flex-col my_text_between">
              <img :src="musicInfo.picUrl" class="w-[50%] rounded-[15px] my-1" alt="">
              <div class="flex-1 w-full flex justify-center">
                <div class="w-[50%] h-full">
                  <div class="h-[120px] my-0.5">
                    <p class="text-[#efefef] font-bold text-[25px]">
                      {{ musicInfo.name }}
                    </p>
                    <p class="text-[#5f5f5f] font-bold text-[18px]">
                      {{ musicInfo.author }}
                    </p>
                  </div>
                  <div class="my_text_between py-0.5">
                    <b-icon-skip-backward-fill @click="lastMusic" class="my_ctrl_icon text-[#efefef]" />
                    <b-icon-skip-end-circle-fill @click="playCtrl" v-if="!playStatus" class="my_ctrl_icon text-[#efefef]"/>
                    <b-icon-pause-circle-fill @click="playCtrl" v-if="playStatus" class="my_ctrl_icon text-[#efefef]"/>
                    <b-icon-skip-forward-fill @click="nextMusic" class="my_ctrl_icon text-[#efefef]"/>
                  </div>
                  <div class="py-2">
                    <div class=" w-full my_text_around">
                      <div class="my_time_step">
                        {{ ("00" + Math.floor(musicProgress / 60)).slice(-2) }}:{{
                          ("00" + Math.floor(musicProgress) % 60).slice(-2)
                        }}
                      </div>
                      <div class="flex items-center h-full w-[90%] ml-1.5 mr-0.5">
                        <el-slider @change="changeProgress" v-model="musicProgress" :step="1" size='small'
                                   class="h-full w-full " :show-tooltip="false"
                                   :max="Math.floor(musicInfo.size/1000)"/>
                      </div>
                      <div class="my_time_step">
                        {{ ("00" + Math.floor(Math.floor(musicInfo.size / 1000) / 60)).slice(-2) }}:{{
                          ("00" + Math.floor(musicInfo.size / 1000) % 60).slice(-2)
                        }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <ul class="lyric" id="my_lyric">
                <li :class="{each:true, choose: (index===nowPlayingLyric.line)}" v-for="(item, index) in lyricList"
                    :key="index">{{ item.text }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss" scoped>
.lyric {
  width: 100%;
  height: 100%;
  overflow: auto;
  color: #ddd;
  font-weight: normal;
  padding: 5px 10px;
  border: 1px solid #000;
  border-left: none;

  .each {
    height: 100px;
    line-height: 100px;
    text-align: center;
    transition: all .2s;
    color: #6a6a6a;
    font-size: 30px;
  }

  .choose {
    height: 120px;
    transition: all .2s;
    line-height: 120px;
    font-weight: bold;
    color: #fafafa;
    font-size: 48px;
    //transform: scale(1.2);
  }

  // 修改滚动条样式
  &::-webkit-scrollbar {
    width: 3px;
    height: 1px;
  }

  // 滑块部分
  &::-webkit-scrollbar-thumb {
    background-color: #eee;
  }

  // 轨道部分
  &::-webkit-scrollbar-track {
    background-color: #333;
  }
}

.el-drawer {
  width: 400px !important;
}

.el-aside {
  transition: all .6s;
  border-right: 1px solid #8888;
  @include overHidden;
}

.music_list {
  @include overHidden;
}

.toolbar {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.el-header {
  border-bottom: 1px solid #8888;
  user-select: none;

  .h_ctrl {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .arrow {
      margin-right: 24px;
      cursor: pointer;
      border-radius: 12.5px;
      padding: 2px 0;

      &:hover {
        background-color: rgb(240, 240, 242);
        transition: all .5s;
      }
    }
  }

  .h_title {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;

    span {
      display: block;
      //background-color: #a58;
      font-size: 25px;
      //color: antiquewhite;
      line-height: 40px;
      margin: 0 12px;
      height: 40px;
      border-radius: 12px;
      width: 100px;
      text-align: center;
      cursor: pointer;
      overflow: hidden;
      font-weight: 900;

      &:hover {
        background-color: rgb(240, 240, 242);
        transition: all .2s;
      }
    }
  }

  .h_login {
    position: relative;

    img {
      position: absolute;
      cursor: pointer;
      top: 8px;
      right: 0;
      border-radius: 50%;
    }
  }
}

.el-main {
  height: calc(100% - 160px);
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.el-footer {
  user-select: none;
  height: 100px !important;
  border-top: 1px solid #8888;
}

.my_time_step {
  @apply flex items-center h-full w-[10%] text-gray-400
}

.song_list_title {
  @apply px-[8px] h-1.5 font-bold my_text_left
}

.song_list {
  @apply px-[8px] flex cursor-pointer py-[8px] hover:bg-blue-300
}

.lyric_box {
  height: calc(100% - 70px);
  @apply flex flex-nowrap;
  > div {
    @apply flex-1
  }
}
</style>
