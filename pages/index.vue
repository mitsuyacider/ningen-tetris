<template>
  <div class="container border">
    <table class="table-bordered block-table text-center">
      <tbody>
        <tr v-for="rowIndex in rows">
          <td v-for="colIndex in cols">
            ({{ rowIndex - 1 }}, {{ colIndex - 1 }})
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cols: 10,
      rows: 15,
      cells: [],
      top: 0,
      top0: 0,                  // 1マス分ドロップした際に、前回描画したブロックをクリアする為に使用する
      left: 0,
      left0: 0,
      keys: {},
      dropInterval: 1000,
      dropSpeed: 50,            // 1秒間に操作できる最大回数
      tick: 0,
      angles: [],               // 棒の回転後の位置を保持する
      angle: 0,                 // 現在の回転
      parts: [],
      parts0: []
    }
  },
  mounted () {
    this.cells = document.getElementsByTagName('td')
    document.onkeydown = this.keydown
    this.top = 1
    this.top0 = this.top
    this.left = Math.floor(this.cols / 2)
    this.left0 = this.left
    this.dropInterval = 1000 / this.dropSpeed
    this.angles = this.getAngles()
    this.move()
  },
  methods: {
    getAngles: function() {
      var w = this.cols
      // 各々ブロック要素の相対位置を保持
      // それぞれ、90度回転、180度回転、270度回転の順。
      return [[-1, 1, 2], [-w, w, w * 2], [-2, -1, 1], [-w * 2, -w, w]]
    },
    keydown: function(e) {
      switch (e.keyCode) {
        case 37:
          this.keys.left = true
          break;

        case 39:
          this.keys.right = true
          break;

        case 32:
          this.keys.rotate = true
          break;

        default:

      }
    },
    move: function (){

      this.tick++

      this.left0 = this.left

      if (this.keys.left && this.left > 0) {
        this.left--
      }

      if (this.keys.right && this.left + 4 < this.cols) {
        this.left++
      }

      if (this.keys.rotate) {
        this.angle++
      }

      this.keys = {}
      this.parts = this.angles[this.angle % this.angles.length]
      for (let i = -1; i < this.parts0.length; i++) {
        // 回転後の位置を取り出す
        let offset0 = this.parts0[i] || 0

        let index0 = this.top0 * this.cols + this.left0 + offset0
        this.cells[index0].style.backgroundColor = ''

        let offset = this.parts[i] || 0
        let index = this.top * this.cols + 0 + this.left + offset
        this.cells[index].style.backgroundColor = 'red'
      }

      this.top0 = this.top
      this.parts0 = this.parts

      if (this.tick % this.dropSpeed == 0) {
        this.top++
      }

      const info = this.tick + ' (' + this.left + ', ' + this.top + ')'
      console.log(info);

      if (this.top < this.rows) {
        window.setTimeout(this.move, this.dropInterval)
      }
    }
  }
}
</script>

<style lang="scss">
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
