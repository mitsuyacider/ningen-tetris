# ningen tetris
Sample image
* ![サンプル](assets/img/sample.gif)

This is [demo](https://ningen-tetris.herokuapp.com/)

## HOW TO USE
Just start with npm install & run.
``` bash
$ npm install
$ npm run dev
```

## HOW TO PLAY
| MOVE | ROATATION |
|:-----------|:------------:|
| ![サンプル](assets/img/move.png)| ![サンプル](assets/img/rotate.png)|
| If you move between left and right, falling tetris block will follow with you.| Every time you jump, falling tetris block will rotate. |

## PERFORMANCE
If you have great GPU, this sample might be by far faster because Tensorflow.js applies WebGL for calclation, which means depends on your GPU spec.

---

Game logic is inspired in [this program](https://torisky.com/javascript%EF%BC%9A%E3%83%86%E3%83%88%E3%83%AA%E3%82%B9%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%A0/). Thank you for sharing.
To detect human pose, this system introduce *Tensorflow.js* and reference [sample code](https://developers.gnavi.co.jp/entry/posenet/hasegawa).
