interface UserInfo{
    account:{[key:string]:string},
    bindings:[],
    code:number,
    cookie:string,
    loginType:number,
    profile:{[key:string]:string},
    token:string
}
interface PlayingMusic{
    id:string,
    name:string,
    url:string,
    author:string,
    size:number,
    picUrl:string,
}
interface IState{
    userInfo:UserInfo,
    playState:boolean,
    playingMusic:PlayingMusic,
    musicList:Array<any>,
}

export{
    UserInfo,
    IState,
    PlayingMusic,
}