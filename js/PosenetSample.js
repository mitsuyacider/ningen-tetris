import * as posenet from '@tensorflow-models/posenet';
import {drawBoundingBox, drawKeypoints, drawSkeleton} from '@/js/demo_util.js';
import Stats from 'stats.js';

const imageScaleFactor = 0.5;
const outputStride = 8;
const flipHorizontal = false;
const stats = new Stats();
const contentWidth = 640;
const contentHeight = 480;
// const minPartConfidence = 0.5;
const minPartConfidence = 0.1;
const minPoseConfidence = 0.10;
const maxPoseDetections = 1;
const nmsRadius = 30.0;

let callbackDelegate;

export const sqrt = Math.sqrt;
export function startPosenet() {
  bindPage();
}

export function setDelegate(delegate) {
  callbackDelegate = delegate
}

async function bindPage() {
    const net = await posenet.load(); // posenetの呼び出し
    let video;
    try {
        video = await loadVideo(); // video属性をロード
    } catch(e) {
        console.error(e);
        return;
    }
    detectPoseInRealTime(video, net);
}

// video属性のロード
async function loadVideo() {
    const video = await setupCamera(); // カメラのセットアップ
    video.play();

    return video;
}

// カメラのセットアップ
// video属性からストリームを取得する
async function setupCamera() {
    const video = document.getElementById('video');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': true});
        video.srcObject = stream;

        return new Promise(resolve => {
            video.onloadedmetadata = () => {
                resolve(video);
            };
        });
    } else {
        const errorMessage = "This browser does not support video capture, or this device does not have a camera";
        alert(errorMessage);
        return Promise.reject(errorMessage);
    }
}

// 取得したストリームをestimateSinglePose()に渡して姿勢予測を実行
// requestAnimationFrameによってフレームを再描画し続ける
function detectPoseInRealTime(video, net) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const flipHorizontal = true; // since images are being fed from a webcam

    async function poseDetectionFrame() {
        stats.begin();
        // NOTE: SinglePoseの場合
        // let poses = [];
        // const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
        // poses.push(pose);

        // // NOTE: MultiPoseの場合
        let poses = await net.estimateMultiplePoses(
            video, imageScaleFactor, flipHorizontal, outputStride,
            maxPoseDetections,
            minPartConfidence,
            nmsRadius)


        ctx.clearRect(0, 0, contentWidth,contentHeight);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-contentWidth, 0);
        ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
        ctx.restore();

        poses.forEach(({ score, keypoints }) => {
            if (score >= minPoseConfidence) {
              drawKeypoints(keypoints, minPartConfidence, ctx);
              drawSkeleton(keypoints, minPartConfidence, ctx);

              callbackDelegate(keypoints, score);
            }

        });

        stats.end();

        requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

// 与えられたKeypointをcanvasに描画する
function drawWristPoint(wrist,ctx){
    ctx.beginPath();
    ctx.arc(wrist.position.x , wrist.position.y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "pink";
    ctx.fill();
}
