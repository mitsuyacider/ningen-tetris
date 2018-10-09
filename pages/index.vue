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
      top0: 0, // 1マス分ドロップした際に、前回描画したブロックをクリアする為に使用する
      left: 0,
      left0: 0,
      keys: {},
      dropSpeed: 1000
    }
  },
  mounted () {
    this.cells = document.getElementsByTagName('td')
    document.onkeydown = this.keydown
    this.top = 0
    this.top0 = this.top

    this.move()
  },
  methods: {
    keydown: function(e) {
      switch (e.keyCode) {
        case 37:
          this.keys.left = true
          break;

        case 39:
          this.keys.right = true
          break;

        default:

      }
    },
    move: function (){
      this.left0 = this.left
      if (this.keys.left && this.left > 0) {
        this.left--
      }

      if (this.keys.right && this.left + 4 < this.cols) {
        this.left++
      }

      this.keys = {}

      let index0 = this.top0 * this.cols + 0 + this.left0
      this.cells[index0].style.backgroundColor = ''
      this.cells[index0 + 1].style.backgroundColor = ''
      this.cells[index0 + 2].style.backgroundColor = ''
      this.cells[index0 + 3].style.backgroundColor = ''

      let index = this.top * this.cols + 0 + this.left
      this.cells[index].style.backgroundColor = 'red'
      this.cells[index + 1].style.backgroundColor = 'red'
      this.cells[index + 2].style.backgroundColor = 'red'
      this.cells[index + 3].style.backgroundColor = 'red'

      this.top0 = this.top
      this.top++

      if (this.top < this.rows) {
        window.setTimeout(this.move, this.dropSpeed)
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
