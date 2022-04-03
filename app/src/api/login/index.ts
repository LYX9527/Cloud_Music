import request from "@/service";

export default {
    /**
     * 获取扫码登录key
     * @param date 当前时间戳 Date.now()获取 string
     */
    getKey(params: { date: string | number }) {
        return request({
            url: `/login/qr/key`,
            method: 'get',
            params
        })
    },
    /**
     * 获取登陆二维码
     * @param key 扫码登录key string
     * @param qrimg 是否返二维码 boolean
     * @param date 当前时间戳 Date.now()获取 string
     */
    getQrCode(params: { key: string, qrimg: boolean, date: string | number }) {
        return request({
            url: `/login/qr/create`,
            method: 'get',
            params,
        })
    },
    /**
     * 二维码检测扫码状态接口
     * @param key 扫码登录key string
     * @param date 当前时间戳 Date.now()获取 string
     */
    getQrCodeStatus(params: { key: string, date: string | number }) {
        return request({
            url: "/login/qr/check",
            method: 'get',
            params,
        })
    },
    /**
     * 调用此接口,可获取登录状态
     * @param cookie cookie字符串 encodeURIComponent编码后的字符串 string
     * @param date 当前时间戳 Date.now()获取 string
     */
    getLoginStatus(params: { date: string | number, cookie: string }) {
        return request({
            url: '/login/status',
            method: "get",
            params
        })
    },
    /**
     * 手机号登陆
     * @param phone 手机号 string
     * @param password 密码 string
     */
    phoneLogin(params: { phone: string | number, password?: string, captcha?: string }) {
        return request({
            url: '/login/cellphone',
            method: "get",
            params
        })
    },
    /**
     * 获取验证码(验证码登陆)
     * @param phone 手机号 string
     */
    getCheck(params: { phone: string | number }) {
        return request({
            url: '/captcha/sent',
            method: "get",
            params
        })
    },
    /**
     * 邮箱登陆
     * @param email 邮箱 string
     * @param password 密码 string
     */
    emailLogin(params: { email: string, password: string }) {
        return request({
            url: '/login/cellphone',
            method: "get",
            params
        })
    },
}