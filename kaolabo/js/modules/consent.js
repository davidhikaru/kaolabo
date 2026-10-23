export function initConsent(onAgreeCallback) {
  const modal = document.getElementById('consent-modal');
  const agreeBtn = document.getElementById('btn-agree');

  // 檢查 localStorage 是否有同意紀錄
  if (localStorage.getItem('kao_consented') === 'true') {
    modal.classList.add('hidden');
    if (onAgreeCallback) onAgreeCallback();
  }

  // 點擊同意按鈕
  agreeBtn.addEventListener('click', () => {
    localStorage.setItem('kao_consented', 'true');
    modal.classList.add('hidden');
    if (onAgreeCallback) onAgreeCallback();
  });
}