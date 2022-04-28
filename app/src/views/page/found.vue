<script lang="ts" setup>
import api from "@/api/found"
import {Ref} from "vue";
import * as NProgress from "nprogress";
const {getSongSingleTable, getSongSingleList} = api

interface ITag {
  category: number,
  hot: boolean,
  id: number,
  name: string,
  type: number,
}

interface ISongListItem {
  coverImgUrl: string,
  id: number,
  name: string,
  copywriter: string,
}

//语种
const languagesList: Ref<Array<ITag>> = ref([])
//风格
const stylesList: Ref<Array<ITag>> = ref([])
//场景
const scenariosList: Ref<Array<ITag>> = ref([])
//情感
const emotionalList: Ref<Array<ITag>> = ref([])
//主题
const themeList: Ref<Array<ITag>> = ref([])
//更多是否显示
const moreShow: Ref<boolean> = ref(true)
//现在选择的类型
const nowType: Ref<number> = ref(0)
//页面展示歌单列表
const songList: Ref<Array<ISongListItem>> = ref([])
//加载更多时间戳
const loadMoreTime: Ref<string> = ref("")
//展示的tag
const tagList: Ref<Array<ITag>> = ref([
  {id: 0, name: '全部', hot: false, category: -1, type: 0},
  {category: 0, hot: false, id: 5001, name: "华语", type: 0},
  {category: 4, hot: false, id: 11002, name: "ACG", type: 0},
  {category: 1, hot: false, id: 12001, name: "古风", type: 1},
  {category: 1, hot: false, id: 2008, name: "轻音乐", type: 0},
])
//修改展示tag
const changeTagList = (tag: ITag) => {
  if (!tagList.value.find(item => item.id === tag.id)) {
    if (tagList.value.length >= 10) {
      ElMessage.warning("最多可添加10个Tag，请取消其他Tag再进行添加")
    } else {
      tagList.value = [...tagList.value, tag]
    }
  } else {
    tagList.value = tagList.value.filter((item: ITag) => item.id !== tag.id)
  }
}
//获取展示列表
const getSongListData = (cat: string, limit?: number, before?: string) => {
  getSongSingleList({
    cat,
    limit,
    before
  }).then((data: { code: number, playlists: Array<ISongListItem>, lasttime: string }) => {
    if (data.code === 200) {
      songList.value = data.playlists
      loadMoreTime.value = data.lasttime
      console.log(data.playlists)
    } else {
      songList.value = []
    }
  })
}
//改变选择的类型
const changeTypeStatus = (type: ITag) => {
  nowType.value = type.id
  moreShow.value = true
  getSongListData(type.name, 12)
}

const bigTypeList: Ref<Array<{ type: string, list: Array<ITag> }>> = ref([
  {type: "语种", list: languagesList},
  {type: "风格", list: stylesList},
  {type: "场景", list: scenariosList},
  {type: "情感", list: emotionalList},
  {type: "主题", list: themeList},
])
//加载更多
const loadMore = () => {
  getSongSingleList({
    cat: tagList.value.find(item => item.id === nowType.value)!.name,
    limit: 12,
    before: loadMoreTime.value
  }).then((data: { code: number, playlists: Array<ISongListItem>, lasttime: string }) => {
    if (data.code === 200) {
      if (data.playlists.length === 0) {
        ElMessage.warning("没有更多啦，选择其他的看看吧")
      } else {
        songList.value = [...songList.value, ...data.playlists]
        loadMoreTime.value = data.lasttime
      }
    }
  })
}
onMounted(() => {
  NProgress.start();
  getSongSingleTable().then((res: { code: number, tags: Array<ITag> }) => {
    languagesList.value = res.tags.filter(item => item.category === 0);
    stylesList.value = res.tags.filter(item => item.category === 1);
    scenariosList.value = res.tags.filter(item => item.category === 2);
    emotionalList.value = res.tags.filter(item => item.category === 3);
    themeList.value = res.tags.filter(item => item.category === 4);
  })
  getSongListData("全部", 12)
  NProgress.done();
})
const router = useRouter()
const showPlayList = (id: number) => {
  router.push({
    path: '/index/playlist',
    query: {id}
  })
}
</script>
<template>
  <div class="w-full">
    <div class="w-full h-[60px] text-[40px] font-bold animate-bounce mt-0.5 truncate ">发现</div>
    <div class="flex items-center justify-items-end h-auto flex-wrap">
      <div class="my_tag_css" :class="{'tag_checked':nowType===v.id}"
           v-for="v in tagList"
           @click="changeTypeStatus(v)">{{ v.name }}
      </div>
      <div class="my_tag_css" :class="{'tag_checked':!moreShow}" @click="moreShow = !moreShow;nowType=99999">更多</div>
    </div>
    <div class="w-full mt-0.5 bg-[#f3f3f6] rounded-[10px] py-0.5" :class="{'hidden':moreShow}">
      <div class="my_tag_box" v-for="v in bigTypeList" :key="v.type">
        <div class="my_tag_title">{{ v.type }}</div>
        <div class="my_text_left flex-1 flex-wrap">
          <div class="my_tag_css" :class="{'tag_checked':tagList.find(item=>item.id===val.id)}"
               @click="changeTagList(val)"
               v-for="val in v.list" :key="val.id">{{ val.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-auto flex flex-wrap justify-around mt-1">
      <div v-for="v in songList" :key="v.id" class="lg:w-1/6 w-[150px] box-border p-0.5 ">
        <div class="relative">
          <img :src="v.coverImgUrl" alt="" class="w-full rounded-1xl hover:shadow-2xl cursor-pointer mx-auto">
          <div class="cover absolute my_xy_full bg-clip-text top-0 left-0 opacity-0">
            <div class="h-full relative">
              <div class="player_icon w-2 h-2 m-auto top-0 bottom-0 left-0 right-0 absolute"
                   @click="showPlayList(v.id)">
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
    <div class="h-3 my_text_center">
      <div class="text-[25px] font-bold bg-[#f1f1f5] p-0.5 rounded-3xl px-1.5 cursor-pointer" @click="loadMore">加载更多
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.my_tag_css {
  @apply text-[18px] transition-all box-border hover:font-bold hover:bg-[#e7edfd] hover:text-[#2d53e7] text-[#6f6f70] rounded-2xl px-1 h-1.5 flex items-center justify-center m-0.5 cursor-pointer bg-[#f3f3f6] shadow-sm shadow-[#f3f3f6]
}

.tag_checked {
  @apply bg-[#e7edfd] font-bold text-[#2d53e7]
}

.cover {
  &:hover {
    opacity: 1;
    transition: all .8s;
  }
}

.my_tag_box {
  @apply my_text_left box-border px-1 mb-0.5
}

.my_tag_title {
  @apply font-bold text-[30px] w-[0.85rem]
}
</style>