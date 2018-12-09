<template>
  <div class="container border">
    <div class="human-container" style="d-flex justify-content-center">
      <video id="video" width="640px" height="480px" autoplay="1" style="position:absolute;"></video>
      <canvas id="canvas" width="640px" height="480px" style="position:absolute;"></canvas>
    </div>
    <tetris-frame ref="tetris" />
  </div>
</template>

<script>
import TetrisFrame from '@/components/TetrisFrame'

// NOTE: サーバーサイドレンダリングはdocumentオブジェクトを参照できないため、
//       クライアントサイドでのみする処理を明記する。
if (process.browser) {
  var posenet = require('@/js/PosenetSample.js')
}

export default {
  components: {
    TetrisFrame
  },
  data () {
    return {
      posenet: {},
      keypoints: []
    }
  },
  mounted () {
    posenet.setDelegate(this.callbackDelegate);
  },
  methods: {
    callbackDelegate(keypoints, score) {
      this.$refs.tetris.setKeyPoints(keypoints);
    }
  }
}
</script>

<style lang="scss">
.human-container {

  video {
    opacity: .65;
    display: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  canvas {
    opacity:.65;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;

  }
}

table td {
  width: 50px;
  height: 50px;
  border:1px solid black;
}

</style>
