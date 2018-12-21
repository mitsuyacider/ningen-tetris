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
  mounted () {
    tetris.setDelegate(this.callbackOnTetris)
    const P5 = require('p5')
    this.p5js = new P5(tetris.mainGame)
  }
}
</script>

<style>
</style>
