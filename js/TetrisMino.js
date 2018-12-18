import Block from '@/js/Block.js'
import { log } from 'util';

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
    // this.oBlock = JSON.parse(JSON.stringify(block))

    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        this.oBlock[i][j].blockType = block[i][j].blockType;                
      }
    }
  }

  /**
    NOTE: 回転
  */
  rotate(field) {
    const tBlock = JSON.parse(JSON.stringify(this.oBlock))

    
    for(var i = 0; i < 4; i++) {
      for(var j = 0; j < 4; j++) {
        this.oBlock[i][j].blockType = tBlock[3-j][i].blockType;                
      }
    }

    const isHitted = this.hitCheck(field)
    if(isHitted) {
      console.log("hit ****");
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
         if(this.oBlock[i][j].blockType) {              
          field[i + this.y][j + this.x] = JSON.parse(JSON.stringify(this.oBlock[i][j]));
         }
       }
     }
   }

   /*
    * NOTE: ブロックが移動できるかチェックする
    */
   hitCheck (field){     
     // NOTE: 両端のINVISIBLEとWALL分を差し引く
     if (this.x < 0 || this.x > field[0].length - 2 - 2) return true
     
     for(var i = 0; i < 4; i++){
       for(var j = 0; j < 4; j++){   
         if(field[i + this.y][j + this.x].blockType && this.oBlock[i][j].blockType) {
           return true;
         }
       }
     }
     return false;
   }

   gameOverCheck(field) {
      // NOTE: 両端のINVISIBLEとWALL分を差し引く
      if (this.x < 0 || this.x > field[0].length - 2 - 2) return true
      
      for(var i = 0; i < 4; i++){
        for(var j = 0; j < 4; j++){   
          if(this.y == 0 && this.oBlock[i][j].blockType == 1 && field[i + this.y][j + this.x].blockType == 2) {
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
             if(this.oBlock[i][j].blockType) {
               field[i + this.y][j + this.x].blockType = type;
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
         
         if(this.oBlock[i][j].blockType) {
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
                      
            this.oBlock[i][j].registerFunction('pattern1', info);
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
}
