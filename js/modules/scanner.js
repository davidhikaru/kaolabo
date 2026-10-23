export async function runAnalysis(scanOverlay, scanInstruction, scanProgress, flashEl, btnCaptureStep, captureFunc, callback) {
  scanOverlay.classList.remove('hidden');
  scanProgress.style.width = '0%';
  btnCaptureStep.style.display = 'inline-block';
  
  const capturedPhotos = []; 
  
  const waitForClick = () => {
    return new Promise(resolve => {
      const handler = () => {
        btnCaptureStep.removeEventListener('click', handler);
        resolve();
      };
      btnCaptureStep.addEventListener('click', handler);
    });
  };

  const takePhoto = async () => {
    flashEl.classList.remove('hidden');
    flashEl.classList.add('flash-anim');
    
    const photoBlob = await captureFunc();
    if (photoBlob) capturedPhotos.push(photoBlob);
    
    await new Promise(r => setTimeout(r, 400));
    flashEl.classList.remove('flash-anim');
    flashEl.classList.add('hidden');
  };

  // --- 階段 1 ---
  scanInstruction.textContent = "1/3: 正面を向いて「撮影」を押してください";
  scanProgress.style.width = '15%';
  await waitForClick();
  await takePhoto();

  // --- 階段 2 ---
  scanInstruction.textContent = "2/3: 右を向いて「撮影」を押してください";
  scanProgress.style.width = '45%';
  await waitForClick(); 
  await takePhoto();

  // --- 階段 3 ---
  scanInstruction.textContent = "3/3: 少し上を向いて「撮影」を押してください";
  scanProgress.style.width = '75%';
  await waitForClick();
  await takePhoto();

  // --- 階段 4：結算 ---
  scanInstruction.textContent = "AI黄金比を最終計算中...";
  btnCaptureStep.style.display = 'none'; 
  scanProgress.style.width = '100%';
  
  await new Promise(r => setTimeout(r, 1500));

  const score = (Math.random() * (99.9 - 45.0) + 45.0).toFixed(1);
  let comment = "";
  if (score >= 95) comment = "1000年に1人の逸材！奇跡のバランスです！✨";
  else if (score >= 80) comment = "モデル顔負けの黄金比！自信を持って！😎";
  else if (score >= 60) comment = "親しみやすい愛されフェイスです！😊";
  else comment = "個性的で魅力あふれるお顔立ちです！👍";

  scanOverlay.classList.add('hidden');
  callback({ score, comment }, capturedPhotos);
}
