<template>
  <div class="container border ">
    <div class="d-flex justify-content-center" ref="canvas"></div>
  </div>
</template>

<script>
export default {
  mounted () {
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
    }
  }
}
</script>

<style>
</style>
