<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="header col-md-6 d-flex justify-content-center py-3">
      <h1>NINGEN TETRIS</h1>
    </div><!-- /Header -->

    <!-- Main Contents -->
    <!-- tetris container -->
    <div class="row">
      <div class="tetris-container col-md-6">
        <div class="human-container" style="d-flex justify-content-center">
          <video id="video" width="640px" height="480px" style="position:absolute;"></video>
          <canvas :class="{show : $store.state.isCameraPreview }" id="canvas" width="640px" height="480px" style="position:absolute;"></canvas>
        </div>
        <tetris-frame ref="tetris" />
      </div><!-- /tetris container -->
      <info-container />
    </div><!-- /Main Contents -->
  </div>
</template>

<script>
import TetrisFrame from '@/components/TetrisFrame'
import InfoContainer from '@/components/InfoContainer'
import { mapActions } from 'vuex'

// NOTE: サーバーサイドレンダリングはdocumentオブジェクトを参照できないため、
//       クライアントサイドでのみする処理を明記する。
if (process.browser) {
  var posenet = require('@/js/PosenetSample.js')
}

export default {
  components: {
    TetrisFrame,
    InfoContainer
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

  .show {
    opacity:.65;
  }

  canvas {
    opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
}

.header {
  color: #87C166;
}

table td {
  width: 50px;
  height: 50px;
}

</style>
