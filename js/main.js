import { initConsent } from './modules/consent.js';
import { setupCamera, captureCanvasBlob } from './modules/camera.js';
import { runAnalysis } from './modules/scanner.js';
import { saveTestRecord } from './modules/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('webcam');
  const canvasEl = document.getElementById('preview-canvas');
  const flashScreen = document.getElementById('flash-screen');
  
  const cameraSection = document.getElementById('camera-section');
  const resultSection = document.getElementById('result-section');
  const scanOverlay = document.getElementById('scan-overlay');
  const scanInstruction = document.getElementById('scan-instruction');
  const scanProgress = document.getElementById('scan-progress');
  
  const btnAgree = document.getElementById('btn-agree');
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnScan = document.getElementById('btn-scan');
  const btnRetry = document.getElementById('btn-retry');
  const btnShare = document.getElementById('btn-share');
  
  const scoreNumber = document.getElementById('score-number');
  const resultComment = document.getElementById('result-comment');

  let currentScore = 0;

  initConsent(() => {
    console.log("規約同意済み");
  });

  if (btnStartCam) {
    btnStartCam.addEventListener('click', async () => {
      const success = await setupCamera(videoEl, canvasEl);
      if (success) {
        btnStartCam.style.display = 'none';
        btnScan.disabled = false;
      }
    });
  }

  if (btnScan) {
    btnScan.addEventListener('click', async () => {
      btnScan.disabled = true;
      
      const captureFunc = async () => {
        return await captureCanvasBlob(canvasEl);
      };

      runAnalysis(scanOverlay, scanInstruction, scanProgress, flashScreen, captureFunc, async (result, photos) => {
        currentScore = result.score;
        scoreNumber.textContent = result.score;
        resultComment.textContent = result.comment;
        
        cameraSection.classList.add('hidden');
        resultSection.classList.remove('hidden');

        if (photos.length > 0) {
          saveTestRecord(photos[0], result.score);
        }
      });
    });
  }

  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      resultSection.classList.add('hidden');
      cameraSection.classList.remove('hidden');
      btnScan.disabled = false;
    });
  }

  if (btnShare) {
    btnShare.addEventListener('click', async () => {
      const shareData = {
        title: 'カオラボ - AI顔診断',
        text: `私のビジュアルスコアは ${currentScore} 点でした！\n\nAI黄金比診断をやってみよう！ #カオラボ`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log('シェアがキャンセルされました', err);
        }
      } else {
        alert('お使いのブラウザはシェア機能に対応していません。URLをコピーしてシェアしてください！');
      }
    });
  }
});
