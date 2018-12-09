<template>
  <div class="container border ">
    <div class="d-flex justify-content-center" ref="canvas" id="p5Canvas"></div>
  </div>
</template>

<script>
import TetrisMino from '../js/TetrisMino.js';

if (process.browser) {
  var tetris = require('@/js/Tetris.js')
}

export default {
  data () {
    return {
      keypoints: [],
      mino: {},
      p5js: {}
    }
  },
  methods: {
    setKeyPoints: function(keypoints) {
      this.keypoints = keypoints;
      const nose = this.keypoints[0];
      const mapval = Math.floor(this.p5js.map(nose.position.x, 0, 640, 1, 14))
      // tetris.mino.x = mapval;
    }
  },
  mounted () {
    const P5 = require('p5')
    this.p5js = new P5(tetris.mainGame)
  }
}
</script>

<style>
</style>
