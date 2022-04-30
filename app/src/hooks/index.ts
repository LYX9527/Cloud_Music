import {SET_USER_INFO, SET_PLAY_STATE, SET_PLAYING_MUSIC, SET_MUSIC_LIST} from "@/store/types";
import {Store, useStore} from "vuex";
import {UserInfo, PlayingMusic} from "@/typings";

export interface ICtrlUserInfo {
    setuserinfo: (userinfo: UserInfo) => void;
}

export interface ICtrlPlayState {
    setplaystate: (playState: boolean) => void;
}

export interface ICtrlPlayingMusic {
    setplayingmusic: (playingmusic: PlayingMusic) => void;
}

export interface ICtrlMusicList {
    setmusiclist: (musicList: Array<any>) => void;
}

//设置登录用户信息
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

function getStoreData(name: string) {
    const store: Store<any> = useStore();
    return store.state[name]
}

//设置播放状态
function setPlayState(): ICtrlPlayState {
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

//设置当前播放的音乐
function setPlayingMusic(): ICtrlPlayingMusic {
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

//设置播放列表
function setMusicList(): ICtrlMusicList {
    const store: Store<any> = useStore();

    /**
     * 设置歌曲列表
     * @param musicList
     */
    function setmusiclist(musicList: Array<any>): void {
        store.dispatch(SET_MUSIC_LIST, musicList)
    }

    return {
        setmusiclist
    }
}

//动态添加css
function animateCSS(element: string, animation: string, prefix = 'animate__'): Promise<any> {
    return new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.querySelector(element)!;
        node.classList.add(`${prefix}animated`, animationName);

        function handleAnimationEnd(event: Event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });
}

export {
    setUserInfo,
    getStoreData,
    setPlayState,
    setPlayingMusic,
    setMusicList,
    animateCSS
}
