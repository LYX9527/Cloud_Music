import request from "@/service";

export default {
    /**
     * 获取精品歌单标签列表
     */
    getSongSingleTable(): Promise<any> {
        return request({
            url: '/playlist/highquality/tags',
            method: "get",
        })
    },
    /**
     * 获取精品歌单列表
     * @param params
     */
    getSongSingleList(params: { cat?: string, limit?: number, offset?:string,before?:string}): Promise<any> {
        return request({
            url: '/top/playlist/highquality',
            method: "get",
            params
        })
    }
}