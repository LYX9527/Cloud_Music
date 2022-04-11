import request from "@/service";

export default {
    /**
     * 获取精品歌单标签列表
     */
    getSongSingleTable() {
        return request({
            url: '/playlist/highquality/tags',
            method: "get",
        })
    },
    /**
     * 获取精品歌单列表
     * @param params
     */
    getSongSingleList(params: { cat?: string, limit?: number, offset?:string,before?:string}) {
        return request({
            url: '/top/playlist/highquality',
            method: "get",
            params
        })
    }
}