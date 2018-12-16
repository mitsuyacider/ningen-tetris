
import TetrisMino from '@/js/TetrisMino.js';
export let mino;

let img
let width = 550
let height = 750

const num = 150
const length = 100
// ステージ
const BLOCK_SIZE = 27;        // 1ブロックのサイズ

let BLOCK_ROWS;    // ステージの高さ（20ライン分をステージとして使用し、上下1ラインはあたり判定とブロックコピー用に使用）
let BLOCK_COLS;    // ステージの幅

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
// 色
const BACK_COLOR = "#ddd";            // 背景色
const GAMEOVER_COLOR = "#fff";            // ゲームオーバー時のブロックの色
const BLOCK_COLOR = "#000";           // 操作ブロックの色
const LOCK_COLOR = "#333";            // ロックしたブロックの色
const WALL_COLOR = "#666";            // 壁の色
const ERROR_COLOR = "#f00";           // エラーブロックの色
// ゲーム要素
const NEXTLEVEL = 10;                 // 次のレベルまでの消去ライン数

/*
 * グローバル変数
 */
let stage = new Array(BLOCK_COLS);  // ゲームのステージ枠（壁の情報のみ、変化しない）
let field = new Array(BLOCK_COLS);      // ゲーム中のステージ枠とブロック表示用（変化する）
let blockSize;                             // ブロックサイズ
let speed;                          // 落下速度
let frame;                          // ゲームフレーム番号
let block = new Array();                // 落ちてくるブロックの種類（７種類）
let oBlock = new Array();               // 操作中のブロック
let blockType;                      // ブロックの種類番号
let mode;                           // ゲームの状態  GAME/GAMEOVER/EFFECT
let clearLine;                          // 消去したライン数

let p5;
export function mainGame(_p5) {
  p5 = _p5

  p5.preload = _ => {
    img = p5.loadImage('img/download.png');
  }

  p5.keyPressed = (keyCode) => {
  }

  p5.setup = _ => {

    BLOCK_ROWS = Math.floor(height / BLOCK_SIZE);    // ステージの高さ（20ライン分をステージとして使用し、上下1ラインはあたり判定とブロックコピー用に使用）
    BLOCK_COLS = Math.floor(width / BLOCK_SIZE);    // ステージの幅

    // NOTE: キャンバスを親要素のキャンバス内に配置するようにする
    // http://p5aholic.hatenablog.com/entry/2015/05/16/163251
    var canvas = p5.createCanvas(width, height)
    canvas.parent("p5Canvas");
    // p5.createCanvas(width, height)
    p5.background(60, 46, 64)



    clearLine = 0;
    // ブロックの設定
    blockSize = BLOCK_SIZE;
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
    p5.background(60, 46, 64)

    mainLoop()
    p5.text(Math.floor(p5.frameRate()), 550, 50)
  }

  /*
   * NOTE: 操作
   */
  let keyDownFunc = function (e){
      if(mode == EFFECT) return;
      if(mode == GAME){
          mino.setBlockType(field, NON_BLOCK)
          mino.keepInterimPosition()
          // sx = x; sy = y;
          if(e.keyCode == 32){
              rotateBlock();
          }
          else if(e.keyCode == 37){
              mino.x--
          }
          else if(e.keyCode == 39){
              mino.x++
          }
          else if(e.keyCode == 40){
              mino.y++
          }

          if(mino.hitCheck(field)){
            mino.returnPosition()
          }

          putBlock();
      }
      else if(mode == GAMEOVER){
          if(e.keyCode == 13){
              newGame();
          }
      }
  }
}

export function updateLayout(keypoints) {
  updateMinoPosition(keypoints);
  // drawMiniCharacter(keypoints);
}

/*
  NOTE: ミノブロックの位置をボーンデータに応じて更新させる
  @param keypoins : ボーンポジションデータ
  0:"nose"
  1:"leftEye"
  2:"rightEye"
  3:"leftEar"
  4:"rightEar"
  5:"leftShoulder"
  6:"rightShoulder"
  7:"leftElbow"
  8:"rightElbow"
  9:"leftWrist"
  10:"rightWrist"
  11:"leftHip"
  12:"rightHip"
  13:"leftKnee"
  14:"rightKnee"
  15:"leftAnkle"
  16:"rightAnkle"
*/
function updateMinoPosition(keypoints) {
  if(mode == GAME){
      mino.setBlockType(field, NON_BLOCK)
      mino.keepInterimPosition()

      // const rightSholder = keypoints[5]
      // const leftSholder = keypoints[6]
      // if (rightSholder.score > 0.5 && leftSholder.score > 0.5) {
      //   // 左肩と右肩の中点をx座標とする
      //   const posX = (rightSholder.position.x + leftSholder.position.x) / 2;
      //   const mapval = Math.floor(p5.map(posX, 0, width, 1, BLOCK_COLS - 1))
      //   mino.x = mapval;
      // }

      const posX = keypoints[0].position.x;
      const mapval = Math.floor(p5.map(posX, 0, width, 1, BLOCK_COLS - 1))
      mino.x = mapval;

      // NOTE: 左右の目の座標から傾きを算出
      //       傾きが一定以上であれば回転
      const leftEye = keypoints[1].position;
      const rightEye = keypoints[2].position;
      const slope = (leftEye.y - rightEye.y) / (leftEye.x - rightEye.x)
      if (slope > 1.0) {
        rotateBlock()
      }

      if(mino.hitCheck(field)){
        mino.returnPosition()
      }

      putBlock();
  }
}

function drawMiniCharacter(keypoints) {
  // if(mode == GAME){
  //   // p5.ellipseMode(p5.CENTER);
  //   p5.fill(255, 0, 255);
  //   p5.stroke(0, 0, 255);
  //   p5.ellipse(500, 400, 100, 100);
  //
  //   // p5.push();
  //   // // p5.translate((mino.x + 2) * blockSize, (mino.y + 4) * blockSize)
  //   // p5.fill(0, 0, 255);
  //   // p5.ellipse(0, 0, 10, 10);
  //   //
  //   // p5.pop();
  // }
}

/*
 * NOTE: ゲーム開始処理
 */
function newGame() {
  setStage();
  mode = GAME;
  frame = 1;
  speed = 5;
  createBlock();
  mainLoop();
}

/*
 * NOTE: 新しいブロックを作成
 */
function createBlock() {
    if(mode == EFFECT) return;
    const x = mino === undefined ? Math.floor(BLOCK_COLS / 3) : mino.x;
    const y = 0;
    const blockType = Math.floor(Math.random() * block.length);

    // NOTE: ※2次元配列をディープコピーする
    oBlock = JSON.parse(JSON.stringify(block[blockType]))

    mino = new TetrisMino(x, y, blockType, oBlock, blockSize)
    if(mino.hitCheck(field)){
        mode = GAMEOVER;
        console.log("***GAMEOVER!");
    }
    putBlock();
}

/*
 * NOTE: 描画処理
 */
function drawFixedBlocks() {
    p5.push();
    for(var i = 0; i < BLOCK_ROWS; i++){
        for(var j = 0; j < BLOCK_COLS; j++){
            switch(field[i][j]){
                // なにもない
                case NON_BLOCK:
                    p5.stroke(204);
                    p5.fill(247, 241, 213);
                    break;

                // ブロック（ロック）
                case LOCK_BLOCK:
                    p5.fill(255, 0, 0);
                    break;

                // 消去ブロック
                case CLEAR_BLOCK:
                    p5.fill(0);
                    break;

                // 壁
                case WALL:
                    p5.fill(204);
                    break;

                // 重なったときの色
                default:
                    p5.fill(204, 0, 0);
            }

            p5.rect(j * blockSize, i * blockSize, blockSize - 1, blockSize - 1);
        }
    }
    p5.pop();
}

/*
* NOTE: ブロックタイプをセットする
*/
function setBlockType(type) {
  for(var i = 0; i < 4; i++){
      for(var j = 0; j < 4; j++){
          if(oBlock[i][j]) {
            field[i + y][j + x] = type;
          }
      }
  }
}


/*
* NOTE: ゲームメイン
*/
function mainLoop() {
      if(mode == GAME){
          // 元の位置を保存
          mino.keepInterimPosition()

          if(frame % speed == 0){ // ブロックが落下する間隔
              mino.setBlockType(field, NON_BLOCK)

              mino.drop(field, () => {
                mino.setBlockType(field, LOCK_BLOCK)

                if(lineCheck() > 0) {
                    // FIXME: 消えるアニメーションを追加する
                    // mode = EFFECT;
                    mode = GAME;
                    deleteLine();
                }
                createBlock()
              })
              putBlock();
          }

          clearWindow();
          drawFixedBlocks();
          mino.drawMinoBlock(p5);
      }
      else if(mode == GAMEOVER){
          gameOver();
      }
      else if(mode == EFFECT){
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
 * NOTE: ステージ設定
 */
function setStage() {
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
 * NOTE: ブロックの回転処理
 */
function rotateBlock() {
    if(mode == EFFECT) return;
    mino.setBlockType(field, NON_BLOCK)
    mino.rotate(field)
}

/*
 * NOTE: そろったラインを消去する
 */
function deleteLine() {
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
 * NOTE: ゲーム画面クリア
 */
function clearWindow() {
    p5.push();
    p5.fill(221, 221, 221)
    p5.rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    p5.pop();
}

/*
 * NOTE: ゲームオーバー処理
 */
 function gameOver() {
    p5.push();
    for(var i=0; i<BLOCK_ROWS; i++){
        for(var j=0; j<BLOCK_COLS; j++){
            if(field[i][j] && field[i][j] != WALL){ // ブロックのみ色を変える
                p5.fill(255)
                p5.rect(j*blockSize, i*blockSize, blockSize-1, blockSize-1);
            }
        }
    }
    p5.pop();
}

/*
 * NOTE: ブロックをロック（動かせないように）する
 */
function lockBlock() {
    if(mode == EFFECT) return;
    setBlockType(oBlock, LOCK_BLOCK)
}

/*
 * NOTE: ラインが揃ったかチェックする
 */
function lineCheck() {
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
 * NOTE: ブロックをステージにセットする
 */
function putBlock () {
    if(mode == EFFECT) return;
    mino.setBlockInField(field)
}
