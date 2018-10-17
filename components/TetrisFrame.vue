<template>
  <div class="container border ">
    <div class="d-flex justify-content-center" ref="canvas"></div>
  </div>
</template>

<script>
import TetrisMino from '../js/TetrisMino.js';

export default {
  mounted () {
    this.script = p5 => {
      let img
      let width = 600
      let height = 800

      const num = 150
      const length = 100
      // ステージ
      const BLOCK_SIZE = 24;        // 1ブロックのサイズ
      const BLOCK_ROWS = 22;    // ステージの高さ（20ライン分をステージとして使用し、上下1ラインはあたり判定とブロックコピー用に使用）
      const BLOCK_COLS = 12;    // ステージの幅
      const SCREEN_WIDTH = BLOCK_SIZE * BLOCK_COLS; // キャンバスの幅
      const SCREEN_HEIGHT = BLOCK_SIZE * BLOCK_ROWS;    // キャンバスの高さ
      // ゲームの状態
      const GAME = 1;           // ゲーム中
      const GAMEOVER = 0;       // ゲームオーバー時
      const EFFECT = 2;         // ブロックを消すときのエフェクトモード
      // ブロックの状態
      const NON_BLOCK = 0;      // ブロックが存在しない
      const NORMAL_BLOCK = 1;   // 通常のブロック（動かせる）
      const LOCK_BLOCK = 2;     // ロックした（動かせない）ブロック
      const CLEAR_BLOCK = 3;    // 消去するブロック（1ライン揃ったとき）
      const WALL = 9;           // 壁
      // エフェクト
      const EFFECT_ANIMATION = 2;   // エフェクト時のちかちかする回数
      // 色
      const BACK_COLOR = "#ddd";            // 背景色
      const GAMEOVER_COLOR = "#fff";            // ゲームオーバー時のブロックの色
      const BLOCK_COLOR = "#000";           // 操作ブロックの色
      const LOCK_COLOR = "#333";            // ロックしたブロックの色
      const WALL_COLOR = "#666";            // 壁の色
      const ERROR_COLOR = "#f00";           // エラーブロックの色
      const EFFECT_COLOR1 = "#fff";         // エフェクト時の色1
      const EFFECT_COLOR2 = "#000";         // エフェクト時の色2
      // ゲーム要素
      const NEXTLEVEL = 10;                 // 次のレベルまでの消去ライン数

      /*
       * グローバル変数
       */
      let stage = new Array(BLOCK_COLS);  // ゲームのステージ枠（壁の情報のみ、変化しない）
      let field = new Array(BLOCK_COLS);      // ゲーム中のステージ枠とブロック表示用（変化する）
      let bs;                             // ブロックサイズ
      let speed;                          // 落下速度
      let frame;                          // ゲームフレーム番号
      let block = new Array();                // 落ちてくるブロックの種類（７種類）
      let oBlock = new Array();               // 操作中のブロック
      let blockType;                      // ブロックの種類番号
      let x, y;                               // ブロックの現在位置
      let sx, sy;                         // ブロックの元位置
      let mode;                           // ゲームの状態  GAME/GAMEOVER/EFFECT
      let clearLine;                          // 消去したライン数
      let mino;

      // エフェクト時（色の反転/エフェクトスピード/エフェクト回数）
      let effectState = {flipFlop: 0, speed: 0, count: 0};
      p5.preload = _ => {
        img = p5.loadImage('img/download.png');
      }

      p5.keyPressed = (keyCode) => {
      }

      p5.setup = _ => {
        mino = new TetrisMino()
        this.canvas = p5.createCanvas(width, height)
        p5.background(0)
        this.canvas.parent(this.$refs.canvas)

        clearLine = 0;
        // エフェクト設定
        effectState.flipFlop = 0;
        effectState.speed = 4;
        effectState.count = 0;
        // ブロックの設定
        bs = BLOCK_SIZE;
        // ブロックを設定
        block =  [[ [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 1, 0],
                    [0, 0, 0, 0]],

                [   [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]],

                [   [0, 0, 1, 0],
                    [0, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]],

                [   [0, 1, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]],

                [   [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0]],

                [   [0, 0, 0, 0],
                    [0, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 1, 0]],

                [   [0, 0, 0, 0],
                    [0, 1, 0, 0],
                    [1, 1, 1, 0],
                    [0, 0, 0, 0]]
                ];

            // ステージを設定
            setStage()

        	/*
         	* キーボードイベント
         	*/
        	window.onkeydown = keyDownFunc;
        	newGame()
      }

      p5.draw = _ => {
        p5.background(0)

      	mainLoop()
      	p5.text(Math.floor(p5.frameRate()), 550, 50)
      }

      /*
       * ゲーム開始処理
       */
      let newGame = function () {
        setStage();
        mode = GAME;
        frame = 1;
        speed = 30;
        createBlock();
        mainLoop();
      }

      /*
       * ステージ設定
       */
      let setStage = function (){
          // 操作ブロックための配列
          oBlock.fill(0)

          stage = JSON.parse(JSON.stringify((new Array(BLOCK_ROWS)).fill((new Array(BLOCK_COLS)).fill(0))));
          for (let y = 0; y < stage.length; y++) {
            for (let x = 0; x < stage[y].length; x++) {
              // NOTE: 上下の列は非表示
              if (y === 0 || y === stage.length - 1) {
                stage[y][x] = 0
              } else if (x === 0 || x === stage[y].length - 1 ||
                y === stage.length - 2 ) {
                  stage[y][x] = 9
              }
            }
          }

          // 表示するための配列
          field = JSON.parse(JSON.stringify(stage))
      }

      /*
       * 新しいブロックを作成
       */
      let createBlock = function (){
          if(mode == EFFECT) return;
          mino = new TetrisMino()
          x = sx = Math.floor(BLOCK_COLS / 3);
          y = sy = 0;
          blockType = Math.floor(Math.random() * block.length);

          // NOTE: ※2次元配列をディープコピーする
          oBlock = JSON.parse(JSON.stringify(block[blockType]))

          mino = new TetrisMino(x, y, blockType, oBlock)

          if(hitCheck()){
              mode = GAMEOVER;
              console.log("GAMEOVER!");
          }
          putBlock();
      }

      /*
       * ゲームメイン
       */
      let mainLoop = function (){
          if(mode == GAME){
              // sx = x; sy = y;     // 元の位置を保存
              mino.keepInterimPosition()
              if(frame % speed == 0){ // ブロックが落下する間隔
                  // clearBlock();
                  mino.setBlockType(field, NON_BLOCK)

                  // y++;
                  mino.drop(field, () => {
                    console.log("hit");
                    // lockBlock();
                    mino.setBlockType(field, LOCK_BLOCK)

                    if(lineCheck() > 0) {
                        // FIXME: 消えるアニメーションを追加する
                        // mode = EFFECT;
                        mode = GAME;
                        deleteLine();
                    }
                    createBlock()
                  })
                  // if(mino.hitCheck(field)){
                  //   console.log("*** hit!!!");
                  //
                  //     y = sy;
                  //     lockBlock();
                  //
                      // if(lineCheck() > 0) {
                      //     // FIXME: 消えるアニメーションを追加する
                      //     // mode = EFFECT;
                      //     mode = GAME;
                      //     deleteLine();
                      // }
                  //
                  //     createBlock();
                  // }
                  putBlock();
              }
              drawTetris();
          }
          else if(mode == GAMEOVER){
              gameOver();
          }
          else if(mode == EFFECT){
              if(frame % effectState.speed == 0){
                  effect();
              }
          }
          frame++;
          // 落下スピードアップ
          if(clearLine >= NEXTLEVEL){
              clearLine = 0;
              speed--;
              console.log("speedUP! : " + speed);
          }
          if(speed < 1) speed = 1;
      }

      /*
       * ブロックの当たり判定処理（移動できるか？落下できるか？）
       */
      let hitCheck = function (){
          if(mode == EFFECT) return;
          for(var i = 0; i < 4; i++){
              for(var j = 0; j < 4; j++){
                  if(field[i + y][j + x] && oBlock[i][j]) {
                    return 1;
                  }
              }
          }
          return 0;
      }

      /*
       * ブロックをステージにセットする
       */
      let putBlock = function (){
          if(mode == EFFECT) return;
          mino.setBlockInField(field)
          // for(var i = 0; i < 4; i++){
          //     for(var j = 0; j < 4; j++){
          //         if(mino.oBlock[i][j]) {
          //           field[i + mino.y][j + mino.x] = mino.oBlock[i][j];
          //         }
          //     }
          // }
      }

      /*
       * 描画処理
       */
      let drawTetris = function (){
          clearWindow();

          for(var i = 0; i < BLOCK_ROWS; i++){
              for(var j = 0; j < BLOCK_COLS; j++){
                  switch(field[i][j]){
                      case NON_BLOCK:     // なにもない
      										p5.fill(221, 221, 221)
                          break;
                      case NORMAL_BLOCK:      // ブロック
      										p5.fill(0)
                          break;
                      case LOCK_BLOCK:        // ブロック（ロック）
      										p5.fill(255, 0, 0)
                          break;
                      case CLEAR_BLOCK:       // 消去ブロック
      										p5.fill(0)
                          break;
                      case WALL:      // 壁
      										p5.fill(0, 0, 255)
                          break;
                      default:        // 重なったときの色
      										p5.fill(255, 255, 0)
                  }
                  p5.rect(j * bs, i * bs, bs - 1, bs - 1);    // 1引いているのはブロック同士の隙間を入れるため
              }
          }
      }

      /*
       * ゲーム画面クリア
       */
      let clearWindow = function (){
      		p5.fill(221, 221, 221)
      		p5.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
      }

      /*
       * ブロックを消去する
       */
      let clearBlock = function (){
          if(mode == EFFECT) return;

          // setBlockType(NON_BLOCK)
      }

      /*
       * ブロックタイプをセットする
       */
      let setBlockType = function (type) {
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(oBlock[i][j]) {
                  field[i + y][j + x] = type;
                }
            }
        }
      }

      /*
       * ブロックをロック（動かせないように）する
       */
      let lockBlock = function () {
          if(mode == EFFECT) return;
          setBlockType(oBlock, LOCK_BLOCK)
      }

      /*
       * ラインが揃ったかチェックする
       */
      let lineCheck = function (){
          if(mode == EFFECT) return;
          var count;
          var lineCount = 0;          // 何ライン揃ったか？
          for(let i = 1; i < BLOCK_ROWS - 2; i++){
              count = 0;  // 1ライン上に揃ったブロックの数
              for(let j = 0; j < BLOCK_COLS; j++){     // 右端からチェック
                  if(field[i][j]) count++;
                  else break;
              }
              if(count >= BLOCK_COLS){     // 1ライン揃った！
                  lineCount++;
                  clearLine++;
                  for(let j = 1; j < BLOCK_COLS - 1; j++) {
                    field[i][j] = CLEAR_BLOCK;     // 消去ブロックにする
                  }
              }
          }
          return lineCount;       // 消去ライン数を返す（現在、この戻り値は未使用）
      }

      /*
       * 操作
       */
      let keyDownFunc = function (e){
          if(mode == EFFECT) return;
          if(mode == GAME){
              // clearBlock();
              // mino.setBlockType(field, CLEAR_BLOCK)
              mino.setBlockType(field, NON_BLOCK)
              mino.keepInterimPosition()
              // sx = x; sy = y;
              if(e.keyCode == 32){
                  rotateBlock();
              }
              else if(e.keyCode == 37){
                  x--;
                  mino.x--
              }
              else if(e.keyCode == 39){
                  x++;
                  mino.x++
              }
              else if(e.keyCode == 40){
                  y++;
                  mino.y++
              }

              if(mino.hitCheck(field)){
                mino.returnPosition()
                  // x = sx; y = sy;
              }

              putBlock();
          }
          else if(mode == GAMEOVER){
              if(e.keyCode == 13){
                  newGame();
              }
          }
      }

      /*
       * ブロックの回転処理
       */
      let rotateBlock = function (){
          if(mode == EFFECT) return;
          // clearBlock();
          mino.setBlockType(field, NON_BLOCK)
          mino.rotate(field)
      }


      /*
       * ラインを消去するときのエフェクト
       */
      let effect = function () {
      //     var colors = [ EFFECT_COLOR1, EFFECT_COLOR2 ];
      //     effectState.flipFlop = 1 - effectState.flipFlop;    // エフェクト色を交互に切り替え
      //
      //     if(effectState.count > EFFECT_ANIMATION){
      //         mode = GAME;
      //         effectState.count = 0;
      //         effectState.flipFlop = 0;
      //         deleteLine();
      //         createBlock();
      //     }
      //     effectState.count++;
      }

      /*
       * そろったラインを消去する
       */
      let deleteLine = function (){
          if(mode == EFFECT) return;
          for(var i = BLOCK_ROWS - 1; i >= 1; i--) {      // 下のラインから消去する
              for(var j = 1; j < BLOCK_COLS - 1; j++) {   // 右端からチェック
                  if(field[i][j] == CLEAR_BLOCK) {
                      field[i][j] = field[i - 1][j];            // 一段落とす
                      for(var above = i - 1; above >= 1; above--){   //  そこからまた上を一段ずつおとしていく
                          field[above][j] = field[above - 1][j];
                      }
                      i++;        // 落としたラインもまた、消去ラインだったときの対処
                  }
              }
          }
      }


      /*
       * ゲームオーバー処理
       */
      let gameOver = function (){
          for(var i=0; i<BLOCK_ROWS; i++){
              for(var j=0; j<BLOCK_COLS; j++){
                  if(field[i][j] && field[i][j] != WALL){ // ブロックのみ色を変える
      								p5.fill(255)
                      // g.fillStyle = GAMEOVER_COLOR;
                      p5.rect(j*bs, i*bs, bs-1, bs-1);
                  }
              }
          }
      }
    }
    const P5 = require('p5')
    this.ps = new P5(this.script)
  }
}
</script>

<style>
</style>
