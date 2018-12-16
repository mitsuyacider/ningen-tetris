<template>
  <div class="container-fluid border">
    <!-- Header -->
    <div class="header col-md-6 d-flex justify-content-center py-3">
      <h1>NINGEN TETRIS</h1>
    </div><!-- /Header -->

    <!-- Main Contents -->
    <!-- tetris container -->
    <div class="row border">
      <div class="tetris-container col-md-6 border">
        <div class="human-container" style="d-flex justify-content-center">
          <video id="video" width="640px" height="480px" autoplay="1" style="position:absolute;"></video>
          <canvas id="canvas" width="640px" height="480px" style="position:absolute;"></canvas>
        </div>
        <tetris-frame ref="tetris" />
      </div><!-- /tetris container -->

      <!-- info container -->
      <div class="info-container col-md-6 mb-3 border">
        <!-- score -->
        <div class="score-container row">
          <div class="score-box col-md-6">
            <h2 class="mb-3">SCORE</h2>
            <p class="text-left">1000</p>
          </div>
        </div><!-- /score -->
        <!-- howto -->
        <div class="howto-container row">
          <div class="move-box col-md-6">
            <img class="img-fluid" src="@/assets/img/move.png" alt="">
          </div>
          <div class="rotate-box col-md-6">
            <img class="img-fluid" src="@/assets/img/rotate.png" alt="">
          </div>
        </div><!-- /howto -->        
        <div class="mino-info-container row">
          <a href="#menu" class="btn btn-info col-md-6">メニューを見る</a>
          <a href="#shop" class="btn btn-info col-md-6">店舗情報を見る</a>
        </div>
      </div><!-- /info container -->
    </div><!-- /Main Contents -->
  </div>
</template>

<script>
import TetrisFrame from '@/components/TetrisFrame'
import { log } from 'util';

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
    // posenet.startPosenet();
  },
  methods: {
    callbackDelegate(keypoints, score) {
      this.$refs.tetris.setKeyPoints(keypoints);
    }
  }
}
</script>

<style lang="scss">
body {
  background: #3C2E40;
}

.header {
  color: #87C166;
}

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
