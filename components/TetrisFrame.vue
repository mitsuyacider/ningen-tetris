<template>
  <div class="container">
    <div class="tetris-container" >
      <div class="d-flex justify-content-center" ref="canvas" id="p5Canvas"></div>
    </div>
    <div class="d-flex justify-content-center">
      <b-button v-on:click="onClickGameStart">Game Start</b-button>
    </div>
  </div>
</template>

<script>
import TetrisMino from '@/js/TetrisMino.js';
import { mapGetters } from 'vuex'

if (process.browser) {
  var tetris = require('@/js/Tetris.js')
}

export default {
  data () {
    return {
      keypoints: [],
      mino: {},
      p5js: {},
      isStart: false
    }
  },
  methods: {
    setKeyPoints: function(keypoints) {
      tetris.updateLayout(keypoints)
    },
    callbackOnTetris: function(data) {
      console.log('callback: ' + data);
      if (data.gameMode == 1) {
        this.$store.dispatch('setScore', data.score)
      } else if (data.gameMode == 0) {
        this.isStart = false
      }
    },
    onClickGameStart() {
      tetris.newGame()
    }
  },
  computed: {
    // ゲッターを、スプレッド演算子（object spread operator）を使って computed に組み込む
    ...mapGetters([
			'gameSpeed'
    ])
	},  
  watch: {
    gameSpeed (newVal, oldVal) {
      let speed = 50;

      switch(newVal) {
        case 'ULTRA BEGINNER' : 
          speed = 55;
          break;
        case 'BEGINNER' : 
          speed = 45;
          break;
        case 'NORMAL' : 
          speed = 30;
          break;
        case 'EXPERT' : 
          speed = 15;
          break;
        case 'GOD' : 
          speed = 5;
          break;
      }

      tetris.setSpeed(speed)
    }
  },
  mounted () {
    tetris.setDelegate(this.callbackOnTetris)
    const P5 = require('p5')
    this.p5js = new P5(tetris.mainGame)
  }
}
</script>

<style>
</style>
