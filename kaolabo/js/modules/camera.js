export async function setupCamera(videoEl, canvasEl) {
  try {
    // 要求使用前鏡頭
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 320, height: 320 },
      audio: false
    });
    
    videoEl.srcObject = stream;
    
    // 把影片畫面繪製到 Canvas 上
    const ctx = canvasEl.getContext('2d');
    function render() {
      if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA) {
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
      }
      requestAnimationFrame(render);
    }
    render();
    return true;
  } catch (err) {
    console.error("Camera access error:", err);
    alert("カメラのアクセスが拒否されたか、利用できません。(請允許相機權限)");
    return false;
  }
}

// 將 Canvas 畫面的瞬間截圖轉為 Blob 檔案 (準備上傳用)
export function captureCanvasBlob(canvasEl) {
  return new Promise((resolve) => {
    canvasEl.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.85); // 存為 85% 品質的 JPEG
  });
}