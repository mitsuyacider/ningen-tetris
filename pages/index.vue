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
          <video id="video" width="640px" height="480px" style="position:absolute;"></video>
          <canvas id="canvas" width="640px" height="480px" style="position:absolute;"></canvas>
        </div>
        <tetris-frame ref="tetris" />
      </div><!-- /tetris container -->

      <!-- info container -->
      <div class="info-container col-md-6 mb-3 border">
        <!-- score -->
        <div class="score-container row">
          <div class="position-relative score-box col-md-6">
            <img class="img-fluid" src="@/assets/img/score.png" alt="">
            <span class="score position-absolute">
              {{$store.state.score}}
            </span>
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
        </div>
      </div><!-- /info container -->
    </div><!-- /Main Contents -->
  </div>
</template>

<script>
import TetrisFrame from '@/components/TetrisFrame'
import { mapActions } from 'vuex'

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
      keypoints: [],
      pStyle: {
        'background-image': 'url(' + require('@/assets/img/score.png') + ')'
      }
    }
  },
  mounted () {

  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  navigator.getUserMedia(
    { video: true, audio: true },
      function(stream) {
        var v = document.getElementById('video');
        v.src = URL.createObjectURL(stream);
      },
      function(error) {
        console.log(error);
      }
    );   
    posenet.setDelegate(this.callbackDelegate);
    posenet.startPosenet();
  },
  methods: {
    callbackDelegate(keypoints, score) {
      this.$refs.tetris.setKeyPoints(keypoints);
    },
    ...mapActions({
      getList: 'index/getScore'
    })
  }
}
</script>

<style lang="scss">
body {
  background: #3C2E40;
}

.score-box {
  // background-size: cover;
  // background-image: url('../assets/img/score.png');
  // background-repeat: no-repeat;
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

.score {
  top: 50px;
  left: 32px;
  font-size: 30px;
  letter-spacing: 25px;
  color: #F597AB;
  // font-family: 'Osaka';
}

.howto-container {
  margin-top: 50px;
}

table td {
  width: 50px;
  height: 50px;
  border:1px solid black;
}

</style>
