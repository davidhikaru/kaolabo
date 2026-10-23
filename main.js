// js/main.js
import { initConsent } from './modules/consent.js';
import { setupCamera, captureCanvasBlob } from './modules/camera.js';
import { runAnalysis } from './modules/scanner.js';
import { saveTestRecord } from './modules/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('webcam');
  const canvasEl = document.getElementById('preview-canvas');
  const scanLineEl = document.getElementById('scan-line');
  
  const btnAgree = document.getElementById('btn-agree');
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnScan = document.getElementById('btn-scan');
  const btnRetry = document.getElementById('btn-retry');
  
  const resultArea = document.getElementById('result-area');
  const scoreNumber = document.getElementById('score-number');
  const resultComment = document.getElementById('result-comment');

  // 1. 同意彈窗按鈕邏輯
  initConsent(() => {
    console.log("規約同意済み");
  });

  // 2. 點擊「カメラを起動」啟動相機
  if (btnStartCam) {
    btnStartCam.addEventListener('click', async () => {
      const success = await setupCamera(videoEl, canvasEl);
      if (success) {
        btnStartCam.style.display = 'none'; // 隱藏啟動相機按鈕
        btnScan.disabled = false;           // 啟用診斷按鈕
      }
    });
  }

  // 3. 點擊「診断スタート！」開始分析
  if (btnScan) {
    btnScan.addEventListener('click', async () => {
      btnScan.disabled = true;

      // 截圖 Canvas 畫面
      const photoBlob = await captureCanvasBlob(canvasEl);

      // 執行掃描動畫與產生分數
      runAnalysis(scanLineEl, async (result) => {
        scoreNumber.textContent = result.score;
        resultComment.textContent = result.comment;
        resultArea.classList.remove('hidden');
        btnScan.style.display = 'none';

        // 背景上傳 Supabase
        if (photoBlob) {
          saveTestRecord(photoBlob, result.score);
        }
      });
    });
  }

  // 4. 點擊「もう一度診断する」重新測試
  if (btnRetry) {
    btnRetry.addEventListener('click', () => {
      resultArea.classList.add('hidden');
      btnScan.style.display = 'block';
      btnScan.disabled = false;
    });
  }
});
