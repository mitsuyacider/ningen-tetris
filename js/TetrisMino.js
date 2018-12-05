export default class TetrisMino {

  constructor(_x, _y, _type,  _block) {
    this.blockType = _type
    this.x = this.sx = _x
    this.y = this.sy = _y
    this.oBlock = _block
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
}
