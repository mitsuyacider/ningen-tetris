<template>
  <div class="container border">
    <div class="human-container" style="position:absolute;">
      <video id="video" width="400px" height="300px" autoplay="1" style="position:absolute;"></video>
      <canvas id="canvas" width="400px" height="300px" style="position:absolute;"></canvas>
    </div>
    <tetris-frame />
  </div>
</template>

<script>
import TetrisFrame from '@/components/TetrisFrame'

export default {
  components: {
    TetrisFrame
  },
  data () {
    return {
    }
  },
  mounted () {
    // NOTE: サーバーサイドレンダリングはdocumentオブジェクトを参照できないため、
    //       クライアントサイドでのみする処理を明記する。
    if (process.browser) {
      require('@/js/PosenetSample.js');
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.human-container {
  left: 0;
  bottom: 0;
  video {
    opacity:.65;

  }
  canvas {
    opacity:.65;

  }
}
.vue-canvas {
  margin: 0 auto;
  margin-left: 100px;
}
.block-table  {
  /* 中央に寄せる */
  margin: 0 auto;
}

.isBlock {
  background: red;
}

table td {
  width: 50px;
  height: 50px;
  border:1px solid black;
}

</style>
