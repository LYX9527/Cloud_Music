import {IState, PlayingMusic, UserInfo} from "@/typings";
import {Commit} from "vuex";
import {SET_MUSIC_LIST, SET_PLAY_STATE, SET_PLAYING_MUSIC, SET_USER_INFO} from "./types";

interface ICtx {
    commit: Commit,
    state: IState,
}

export default {
    [SET_USER_INFO]({commit}: ICtx, userInfo: UserInfo): void {
        commit(SET_USER_INFO, userInfo);
    },
    [SET_PLAY_STATE]({commit}: ICtx, playState: boolean): void {
        commit(SET_PLAY_STATE, playState);
    },
    [SET_PLAYING_MUSIC]({commit}:ICtx,playingMusic: PlayingMusic): void {
        commit(SET_PLAYING_MUSIC, playingMusic);
    },
    [SET_MUSIC_LIST]({commit}:ICtx,musicList: Array<any>):void{
        commit(SET_MUSIC_LIST,musicList)
    }
}