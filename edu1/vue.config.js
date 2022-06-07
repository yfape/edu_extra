/*
 * @Author: your name
 * @Date: 2021-10-25 14:34:39
 * @LastEditTime: 2021-10-27 01:55:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \edu1\vue.config.js
 */
module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  transpileDependencies: [
    'quasar'
  ],
  publicPath: process.env.NODE_ENV === 'production'
  ? './'
  : '/'
}
