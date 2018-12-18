export default class TetrisMino {

  constructor(_x, _y, _type,  _block, _blockSize) {
    this.blockType = _type
    this.x = this.sx = _x
    this.y = this.sy = _y
    this.oBlock = _block
    this.blockSize = _blockSize
    this.patternNum = 2
    this.pattern = 1;
  }

  registerFunction(name, response){        
    const functions = {}
    for (let i = 1; i < this.patternNum; i++) {
      const key = 'pattern' + i
      functions[key] = eval('this.drawPattern' + i)
    }

    if(typeof functions[name] !== "undefined") {
      functions[name](response);
    } else {
      console.log('This function is not regsted : ' + name)
    }
  }

  /**
    NOTE: ミノを落とす
  */
  drop(field, callback) {
    this.y++
    const isHitted = this.hitCheck(field)

    if(isHitted){
      this.y = this.sy;
      callback()
    }
  }

  /**
    NOTE: 座標位置を戻す
  */
  replaceBlock(block) {
    this.oBlock = JSON.parse(JSON.stringify(block))
  }

  /**
    NOTE: 回転
  */
  rotate(field) {
    const tBlock = JSON.parse(JSON.stringify(this.oBlock))

    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
          this.oBlock[i][j] = tBlock[3-j][i];
      }
    }

    const isHitted = this.hitCheck(field)
    if(isHitted) {
        // 元に戻す
        this.replaceBlock(tBlock)
    }
  }

  /*
   * NOTE: ブロックをステージにセットする
   */
   setBlockInField(field) {
     for(var i = 0; i < 4; i++){
       for(var j = 0; j < 4; j++){
         if(this.oBlock[i][j]) {
           field[i + this.y][j + this.x] = this.oBlock[i][j];
         }
       }
     }
   }

   /*
    * NOTE: ブロックが移動できるかチェックする
    */
   hitCheck (field){
     for(var i = 0; i < 4; i++){
       for(var j = 0; j < 4; j++){
         if(field[i + this.y][j + this.x] && this.oBlock[i][j]) {
           return true;
         }
       }
     }
     return false;
   }

   /*
    * NOTE: ブロック状態をセットする
    @param field:  NON_BLOCK, NORMAL_BLOCK, LOCK_BLOCK, CLEAR_BLOCK, WALL
    @param type :  ブロックの状態
    */
   setBlockType(field, type) {
     for(var i = 0; i < 4; i++){
         for(var j = 0; j < 4; j++){
             if(this.oBlock[i][j]) {
               field[i + this.y][j + this.x] = type;
             }
         }
     }
   }

   /*
    * NOTE: ブロックのポジションを戻す
    */
   returnPosition() {
     this.x = this.sx
     this.y = this.sy
   }

   /*
    * NOTE: ブロックのポジションを保存する
    */
   keepInterimPosition() {
     this.sx = this.x
     this.sy = this.y
   }

   drawMinoBlock(p5) {
     // 身のブロックを描画
     p5.push();
     const blockSize = this.blockSize;
     for (var i = 0; i < 4; i++) {
       for (var j = 0; j < 4; j++) {
         if(this.oBlock[i][j]) {
            // p5.fill(255, 0, 0)
            const x = (this.x + j) * blockSize;
            const y = (this.y + i) * blockSize;
            const size = blockSize - 1;
            // p5.rect((this.x + j) * blockSize, (this.y + i) * blockSize, blockSize - 1, blockSize - 1);
            const info = {
              p5: p5,
              x: x,
              y: y,
              w: size,
              h: size
            }
            this.registerFunction('pattern1', info);
         }
       }
     }

     // 円を描画
     p5.noFill();
     p5.stroke(255,255,0);
     const radius = blockSize * 5;
     p5.ellipseMode(p5.CORNER);
     p5.ellipse((this.x - 1) * blockSize, (this.y - 1) * blockSize, radius, radius);
     p5.pop();
   }

   drawPattern1 (info) {
    const p5 = info.p5
    const x = info.x
    const y = info.y
    const w = info.w
    const h = info.h

    var side = w;
    var side2 = h;	
    p5.push();
    p5.translate(x, y);
    p5.noStroke();
    p5.fill(131, 18, 28);	
    p5.beginShape();
    p5.vertex(side / 3, 0);
    p5.vertex(side / 3 + side / 3, 0);
    p5.vertex(side, side/3);
    p5.vertex(side, side/3 + side / 3);
    p5.vertex(side / 3 + side / 3, side);
    p5.vertex(side / 3, side);
    p5.vertex(0, side / 3 + side / 3);
    p5.vertex(0, side / 3);
    
    p5.endShape(p5.CLOSE);
    
    p5.noStroke();
    p5.fill(142, 75, 28);	
    // ellipse(x-side/2,y-side/2,30,30);	
    p5.ellipse(side / 2, side / 2, 10,10);	
    p5.pop();	
  }
}
