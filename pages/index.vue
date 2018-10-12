<template>
  <div class="container border">
    <div class="container border ">
      <div class="d-flex justify-content-center" ref="canvas"></div>
    </div>
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
      cols: 10 + 2,             // 左右に壁をつける為に +2 する
      rows: 15 + 1,             // 下端に壁をつけるために +1 する
      cells: [],
      top: 0,
      top0: 0,                  // 1マス分ドロップした際に、前回描画したブロックをクリアする為に使用する
      left: 0,
      left0: 0,
      keys: {},
      dropInterval: 1000,
      dropSpeed: 50,            // 1秒間に操作できる最大回数
      tick: 0,
      angle: 0,                 // 現在の回転
      angle0: 0,                // 前回の回転
      parts0: [],
      fills: [],                // ブロックのあるマス目を記録する
      blocks: [],               // 表示させるブロックの数
      block: {},
      score: 0,
      img: ""
    }
  },
  mounted () {
    this.cells = document.getElementsByTagName('td')
    // 壁をつくる
    this.makeWalls()
    // 落ちて来るブロックをつくる
    this.blocks = this.getBlocks()

    this.block = this.blocks[Math.floor(Math.random() * this.blocks.length)]
    document.onkeydown = this.keydown
    this.top = 1
    this.top0 = this.top
    this.left = Math.floor(this.cols / 2) // 青マスがちょうど中央に来るようにする
    this.dropInterval = 1000 / this.dropSpeed


    this.script = p => {
      this.x = 100
      this.y = 100

      // this.img = p.loadImage("../static/img/download.png");
      p.preload = _ => {
        this.img = p.loadImage('img/download.png');
      }

      p.setup = _ => {
        this.setup(p)
      }

      p.draw = _ => {
        this.draw(p)
      }
    }
    const P5 = require('p5')
    this.ps = new P5(this.script)
    // this.move()
  },
  methods: {
    setup: function(p) {
      self.canvas = p.createCanvas(400, 400)
      self.canvas.parent(this.$refs.canvas)
      p.frameRate(60)
    },
    draw: function(p) {
      p.background(0)
      p.image(this.img, this.x, 0);
      p.fill(255)
      p.rect(p.mouseX, p.mouseY, 50, 50)

      // this.x++;
    },
    getBlocks: function () {
      const w = this.cols
      return [
        {
          color: 'cyan',
          angles:[[-1, 1, 2], [-w, w, w * 2], [-2, -1, 1], [-w * 2, -w, w]]
        },
        {
          color: 'yellow',
          angles:[[-w - 1, -w, -1]]
        },
        {
          color: 'green',
          angles:[[-w, 1 - w, -1], [-w, 1, w + 1], [1, w - 1, w], [-w - 1, -1, w]]
        },
        {
          color: 'red',
          angles:[[-w - 1, -w, 1], [1 - w, 1, w], [-1, w, w + 1], [-w, -1, w - 1]]
        },
        {
          color: 'blue',
          angles:[[-w - 1, -1, 1], [-w, 1 - w, w], [-1, 1, w + 1], [-w, w - 1, w]]
        },
        {
          color: 'orange',
          angles:[[1 - w, -1, 1], [-w, w, w + 1], [-1, 1, w - 1], [-w - 1, -w, w]]
        },
        {
          color: 'magenda',
          angles:[[-w, -1, 1], [-w, 1, w], [-1, 1, w], [-w]]
        }
      ]
    },
    makeWalls: function () {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          if (x === 0 || x === this.cols - 1 ||
              y === this.rows - 1) {
                const pos = y * this.cols + x
                this.cells[pos].style.backgroundColor = 'silver'
                this.fills[pos] = 'silver'
          }
        }
      }
    },
    keydown: function(e) {
      switch (e.keyCode) {
        case 37: // 左矢印キー
          this.keys.left = true
          break;

        case 39: // 右矢印キー
          this.keys.right = true
          break;

        case 32:　// スペースキー
          this.keys.rotate = true
          break;

        case 40: // 下矢印キー
          this.keys.down = true
          break;
        default:

      }
    },
    move: function (){

      this.tick++

      this.left0 = this.left
      this.top0 = this.top
      this.angle0 = this.angle

      if (this.tick % this.dropSpeed == 0) {
        this.top++
      } else {
        if (this.keys.left) {
          this.left--
        }

        if (this.keys.right) {
          this.left++
        }

        if (this.keys.rotate) {
          this.angle++
        }

        if (this.keys.down) {
          this.top++
        }
      }

      this.keys = {}

      let parts = this.block.angles[this.angle % this.block.angles.length]

      // NOTE: 当たり判定。壁にぶつかっていれば、前回の状態に戻す
      for (let i = -1; i < parts.length; i++) {
        const wallOffset = parts[i] || 0
        const wallIndex = this.top * this.cols + 0 + this.left + wallOffset
        if (this.fills[wallIndex]) {
          if (this.tick % this.dropSpeed === 0) {
            for (let j = -1; j < this.parts0.length; j++) {
              const wallOffset0 = this.parts0[j] || 0
              const wallIndex0 = this.top0 * this.cols + this.left0 + wallOffset0
              this.fills[wallIndex0] = this.block.color
            }

            // NOTE: ブロックを消す
            let cleans = 0
            // NOTE: 下から走査して調べていく
            for (let y = this.rows - 2; y >= 0; y--) {
              let isFilled = true
              for (let x = 1; x < this.cols - 1; x++) {
                // NOTE: 一つでも塗られていないマスがあれば、ブレーク
                if (!this.fills[y * this.cols + x]) {
                  isFilled = false
                  break
                }
              }

              // NOTE: 1列全てマスが塗られている時の処理
              if (isFilled) {
                for (let y2 = y; y2 >= 0; y2--) {
                  for (let x = 1; x < this.cols - 1; x++) {
                    this.fills[y2 * this.cols + x] = this.fills[(y2 - 1) * this.cols + x]
                  }
                }

                // NOTE: y--を相殺する為に追加する
                y++
                cleans++
              }
            }
            if (cleans > 0) {
              this.score += Math.pow(10, cleans) * 10
              for (let y = this.rows - 2; y >= 0; y--) {
                for (let x = 1; x < this.cols - 1; x++) {
                  let color = this.fills[y * this.cols + x] || ''
                  this.cells[y * this.cols + x].style.backgroundColor = color
                }
              }
            }

            this.block = this.blocks[Math.floor(Math.random() * this.blocks.length)]
            this.left0 = this.left = Math.floor(this.cols / 2)
            this.top0 = this.top = 2
            this.angle0 = this.angle = 0
            this.parts0 = parts = this.block.angles[this.angle % this.block.angles.length]
          } else {
            this.left = this.left0
            this.top = this.top0
            this.angle = this.angle0
            parts = this.parts0
          }
          break
        }
      }

      if (this.top != this.top0) {
        this.score++
      }

      for (let i = -1; i < this.parts0.length; i++) {
        // NOTE: 前回の位置の色を消す
        // 回転後の位置を取り出す
        let offset0 = this.parts0[i] || 0
        let index0 = this.top0 * this.cols + this.left0 + offset0
        this.cells[index0].style.backgroundColor = ''

        // // NOTE: 現在の位置に色を塗る
        let offset = parts[i] || 0
        let index = this.top * this.cols + 0 + this.left + offset
        this.cells[index].style.backgroundColor = this.block.color
      }

      this.top0 = this.top
      this.parts0 = parts

      // const info = this.tick + ' (' + this.left + ', ' + this.top + ')'
      // console.log(info);
      console.log(this.score);

      window.setTimeout(this.move, this.dropInterval)
    }
  }
}
</script>

<style lang="scss">
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
