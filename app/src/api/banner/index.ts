import request from "@/service";

export default {
    /**
     * 获取扫码登录key
     * @param type:资源类型,对应以下类型,默认为 0
     * 0: pc
     * 1: android
     * 2: iphone
     * 3: ipad
     */
    getBanner(params: { type: string | number }) {
        return request({
            url: '/banner',
            method: 'get',
            params
        })
    },
    /**
     * 所有榜单
     */
    getAllTop() {
        return request({
            url: '/toplist',
            method: 'get',
        })
    },
    /**
     * 获取推荐歌单
     * @param limit 扫码登录key string
     */
    getRecommendList(params: { limit?: number }) {
        return request({
            url: "/personalized",
            method: 'get',
            params,
        })
    },
    /**
     * 新歌速递
     * @param limit 返回数量 , 默认为 30
     * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
     * @param area ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
     */
    getNewAlbum(params: { limit?: number, offset?: string|number, area?: string }) {
        return request({
            url: '/album/new',
            method: "get",
            params
        })
    },
    /**
     * 获取歌单详情
     * @param id g歌单id string
     */
    getPlayListDetail(params: { id: string }) {
        return request({
            url: '/playlist/detail',
            method: "get",
            params
        })
    },
    /**
     * 获取歌曲详情
     * @param ids id 用,连接
     */
    getSongDetail(params: { ids: string }) {
        return request({
            url: '/song/detail',
            method: "get",
            params
        })
    },
    /**
     * 获取音乐 url
     * @param id 音乐id string
     */
    getSongUrl(params: { id: string }) {
        return request({
            url: '/song/url',
            method: "get",
            params
        })
    },
    /**
     * 获取用户歌单
     * @param uid 用户id string
     */
    getUserPlayList(params: { uid: string, limit?: number, offset?: number }) {
        return request({
            url: '/user/playlist',
            method: "get",
            params
        })
    },
    /**
     * 获取歌单评论
     * @param id 歌单id string
     * @param limit 返回数量 , 默认为 20
     * @param offset 偏移数量，用于分页 , 如 :( 页数 -1)*20, 其中 20 为 limit 的值 , 默认为 0
     */
    getPlayListComment(params: { id: string, limit?: number, offset?: number }): Promise<any> {
        return request({
            url: '/comment/playlist',
            method: "get",
            params
        })
    },
}