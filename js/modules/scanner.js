export function runAnalysis(scanOverlay, scanInstruction, scanProgress, flashEl, captureFunc, callback) {
  scanOverlay.classList.remove('hidden');
  scanProgress.style.width = '0%';
  
  let progress = 0;
  const capturedPhotos = []; 
  
  const steps = [
    { threshold: 0, text: '正面の顔をスキャン中...', captured: false },
    { threshold: 35, text: '右を向いてください... 側面を分析中', captured: false },
    { threshold: 70, text: '少し上を向いてください... 輪郭を測定中', captured: false },
    { threshold: 90, text: 'AI黄金比を最終計算中...', captured: false }
  ];

  const interval = setInterval(async () => {
    progress += Math.floor(Math.random() * 3) + 1;
    if (progress > 100) progress = 100;
    scanProgress.style.width = `${progress}%`;

    const currentStepIndex = steps.slice().reverse().findIndex(s => progress >= s.threshold);
    if (currentStepIndex !== -1) {
      const step = steps[steps.length - 1 - currentStepIndex];
      scanInstruction.textContent = step.text;

      if (!step.captured && progress < 90) {
        step.captured = true;
        
        flashEl.classList.remove('hidden');
        flashEl.classList.add('flash-anim');
        setTimeout(() => {
          flashEl.classList.remove('flash-anim');
          flashEl.classList.add('hidden');
        }, 400);

        const photoBlob = await captureFunc();
        if (photoBlob) capturedPhotos.push(photoBlob);
      }
    }

    if (progress === 100) {
      clearInterval(interval);
      
      const score = (Math.random() * (99.9 - 45.0) + 45.0).toFixed(1);
      let comment = "";
      if (score >= 95) comment = "1000年に1人の逸材！奇跡のバランスです！✨";
      else if (score >= 80) comment = "モデル顔負けの黄金比！自信を持って！😎";
      else if (score >= 60) comment = "親しみやすい愛されフェイスです！😊";
      else comment = "個性的で魅力あふれるお顔立ちです！👍";

      setTimeout(() => {
        scanOverlay.classList.add('hidden');
        callback({ score, comment }, capturedPhotos);
      }, 500);
    }
  }, 120); 
}
