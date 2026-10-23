export function runAnalysis(scanLineEl, callback) {
  // 顯示掃描線動畫
  scanLineEl.classList.remove('hidden');

  // 模擬運算時間 (2.5 秒)
  setTimeout(() => {
    scanLineEl.classList.add('hidden');

    // 產生 98.0 ~ 99.9 之間的高分
    const randomScore = (98 + Math.random() * 1.9).toFixed(1);
    
    const fakeResult = {
      score: randomScore,
      comment: "1000年に1人の逸材！奇跡のバランスです！✨" // 1000年一遇的人才！
    };

    callback(fakeResult);
  }, 2500);
}