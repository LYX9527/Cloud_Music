export default {
    "200": "成功",
    '401': '认证失败，无法访问系统资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    "500": "服务器内部错误",
    '800': '二维码过期',
    '801': '等待扫码',
    '802': '待确认',
    '803': '授权登录成功',
    'default': '系统未知错误，请反馈给管理员'
}
export type ErrorCode = 401 | 403 | 404 | 500 | 800 | 801 | 802 | 803 | 'default'
export type NormalCode = 200
// export type ErrorCodeMap = { [key in ErrorCode]: string }