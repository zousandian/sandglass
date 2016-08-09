// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const Vue = require('vue')
const ProgressBar = require('progressbar.js')
const Config = require('electron-config')
const config = new Config()

let vm = new Vue({
  el: 'body',
  data() {
    return {
      msg: 'Time to have a rest.',
      interval: config.get('interval') || 30,
      gap: config.get('gap') || 30,
    }
  },
  methods: {
    saveSetting () {
      config.set('interval', parseInt(this.interval, 10))
      config.set('gap', parseInt(this.gap, 10))
      window.close()
    }
  },
  ready() {
    if (document.body.classList.contains('setting')) return


    let myNotification = new Notification('Title', {
      body: 'Time to have a rest.'
    })

    myNotification.onclick = () => {
      console.log('Notification clicked')
    }
    
    setInterval(function () {
      if (vm.gap-- === 0) {
        window.close();
      }
    }, 1000)

    let bar = new ProgressBar.Circle('#bar', {
      strokeWidth: 6,
      easing: 'linear',
      duration: config.get('gap') * 1000,
      color: '#fff',
      trailColor: 'rgba(255,255,255,.3)',
      trailWidth: 0,
      svgStyle: null,
    });

    bar.animate(1.0);  // Number from 0.0 to 1.0
  }
})