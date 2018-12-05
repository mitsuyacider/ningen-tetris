import * as posenet from '@tensorflow-models/posenet';
import {drawBoundingBox, drawKeypoints, drawSkeleton} from '@/js/demo_util.js';
import Stats from 'stats.js';

const imageScaleFactor = 0.2;
const outputStride = 16;
const flipHorizontal = false;
const stats = new Stats();
const contentWidth = 400;
const contentHeight = 300;
const minPartConfidence = 0.5

bindPage();
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
        let poses = [];
        const pose = await net.estimateSinglePose(video, imageScaleFactor, flipHorizontal, outputStride);
        poses.push(pose);

        ctx.clearRect(0, 0, contentWidth,contentHeight);

        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-contentWidth, 0);
        ctx.drawImage(video, 0, 0, contentWidth, contentHeight);
        ctx.restore();

        poses.forEach(({ score, keypoints }) => {
            // keypoints[9]には左手、keypoints[10]には右手の予測結果が格納されている
            // drawWristPoint(keypoints[9],ctx);
            // drawWristPoint(keypoints[10],ctx);
            drawKeypoints(keypoints, minPartConfidence, ctx);
            drawSkeleton(keypoints, minPartConfidence, ctx);
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
