// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('vue')
const Config = require('electron-config')
const config = new Config()

let vm = new Vue({
  el: 'body',
  data() {
    return {
      interval: config.get('interval') || 30,
      gap: config.get('gap') || 30,
    }
  },
  methods: {
    saveSetting () {
      console.log(this.interval, this.gap)
      config.set('interval', parseInt(this.interval, 10))
      config.set('gap', parseInt(this.gap, 10))
      // window.close()
      console.log(config.get('interval'), config.get('gap'));
    }
  },
  ready() {
  }
})