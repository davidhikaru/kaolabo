// js/modules/camera.js

export async function setupCamera(videoElement, canvasElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 320, height: 320 },
      audio: false
    });
    
    videoElement.srcObject = stream;
    
    // 等待攝影機準備完畢
    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        
        // 啟動畫布渲染循環，將隱藏的 video 畫面持續畫到 canvas 上
        const ctx = canvasElement.getContext('2d');
        const drawLoop = () => {
          if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
            ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
          }
          requestAnimationFrame(drawLoop);
        };
        drawLoop();
        
        resolve(true);
      };
    });
  } catch (err) {
    console.error("相機啟動失敗:", err);
    alert("カメラのアクセスが許可されていないか、他のアプリで使用中です。");
    return false;
  }
}

export async function captureCanvasBlob(canvasElement) {
  return new Promise((resolve) => {
    canvasElement.toBlob((blob) => {
      resolve(blob);
    }, 'image/jpeg', 0.9);
  });
}
