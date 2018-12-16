<template>
  <div class="container-fluid border">
    <!-- Header -->
    <div class="header col-md-6 d-flex justify-content-center py-3">
      <h1>NINGEN TETRIS</h1>
    </div><!-- /Header -->

    <!-- Main Contents -->
    <div class="row border">
      <div class="col-md-6 border">
        <div class="human-container" style="d-flex justify-content-center">
          <video id="video" width="640px" height="480px" autoplay="1" style="position:absolute;"></video>
          <canvas id="canvas" width="640px" height="480px" style="position:absolute;"></canvas>
        </div>
        <tetris-frame ref="tetris" />
      </div>
      <div class="col-md-6 mb-3 border">
        <h3 class="mb-3">Mr. M COFFEEについて</h3>
        <p class="text-left">Mr. M COFFEE(ミスターえむコーヒー)は、店主が焙煎した
          こだわりのコーヒーを最高の空間とおもてなしで提要する自家焙煎のカフェです。
          店主が世界中のコーヒー豆を厳選し、コーヒー豆の種類に合わせ、心を込めて焙煎、抽出しております。
          また、女性にちょうど良いボリュームのワンプレートランチ、季節のスイーツなどもご好評いただいております。
        </p>
        <a href="#menu" class="btn btn-info">メニューを見る</a>
        <a href="#shop" class="btn btn-info">店舗情報を見る</a>
      </div>
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
