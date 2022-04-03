import { IState, UserInfo,PlayingMusic } from "@/typings";
import {SET_MUSIC_LIST, SET_PLAY_STATE, SET_PLAYING_MUSIC, SET_USER_INFO} from "./types";

export default {
    [SET_USER_INFO](state: IState, userInfo: UserInfo) {
        state.userInfo = userInfo;
    },
    [SET_PLAY_STATE](state: IState, playState: boolean){
        state.playState = playState;
    },
    [SET_PLAYING_MUSIC](state: IState, playingMusic:PlayingMusic){
        state.playingMusic = playingMusic;
    },
    [SET_MUSIC_LIST](state:IState,musicList:Array<any>){
        state.musicList = musicList;
    }

}