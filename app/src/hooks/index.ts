import {SET_USER_INFO, SET_PLAY_STATE, SET_PLAYING_MUSIC, SET_MUSIC_LIST} from "@/store/types";
import {Store, useStore} from "vuex";
import {UserInfo,PlayingMusic} from "@/typings";
export interface ICtrlUserInfo {
    setuserinfo: (userinfo: UserInfo) => void;
}
export interface ICtrlPlayState {
    setplaystate: (playState: boolean) => void;
}
export interface ICtrlPlayingMusic {
    setplayingmusic: (playingmusic: PlayingMusic)=> void;
}
export interface ICtrlMusicList {
    setmusiclist: (musicList: Array<any>)=> void;
}
function setUserInfo(): ICtrlUserInfo {
    const store: Store<any> = useStore();

    /**
     * 设置用户登陆后信息
     * @param userinfo
     */
    function setuserinfo(userinfo: UserInfo): void {
        store.dispatch(SET_USER_INFO, userinfo)
    }

    return {
        setuserinfo
    }
}

function getStoreData(name: string){
    const store: Store<any> = useStore();
    return store.state[name]
}
function setPlayState(): ICtrlPlayState{
    const store: Store<any> = useStore();

    /**
     * 设置播放器状态
     * @param playState 当前播放状态
     */
    function setplaystate(playState: boolean): void {
        store.dispatch(SET_PLAY_STATE, playState)
    }
    return {
        setplaystate
    }
}

function setPlayingMusic():ICtrlPlayingMusic{
    const store: Store<any> = useStore();

    /**
     * 设置当前播放音乐
     * @param playingmusic
     */
    function setplayingmusic(playingmusic: PlayingMusic): void {
        store.dispatch(SET_PLAYING_MUSIC, playingmusic)
    }
    return {
        setplayingmusic
    }
}
function setMusicList():ICtrlMusicList{
    const store: Store<any> = useStore();

    /**
     * 设置歌曲列表
     * @param musicList
     */
    function setmusiclist(musicList:Array<any>):void{
        store.dispatch(SET_MUSIC_LIST,musicList)
    }
    return {
        setmusiclist
    }
}
export {
    setUserInfo,
    getStoreData,
    setPlayState,
    setPlayingMusic,
    setMusicList,
}
