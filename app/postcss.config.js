module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 100, //根节点字体大小，以100px为例，可根据自己需求修改
      propList: ['*'],
      selectorBlackList: ['.px']
      // 过滤掉.px-开头的class，不进行rem转换
    }
  },
}
