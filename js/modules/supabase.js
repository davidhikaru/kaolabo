import { SUPABASE_CONFIG } from '../config.js';

// 初始化 Supabase Client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

/**
 * 將圖片 Blob 上傳至 Supabase Storage 並寫入 Database
 * @param {Blob} imageBlob 
 * @param {string|number} score 
 */
export async function saveTestRecord(imageBlob, score) {
  try {
    // 產生一個不重複的隨機檔名
    const fileName = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

    // 1. 上傳到名為 'user-photos' 的 Storage Bucket
    const { data: storageData, error: storageError } = await supabase.storage
      .from('user-photos')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg'
      });

    if (storageError) throw storageError;

    // 2. 取得圖片的公開網址 (Public URL)
    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 3. 將網址與分數寫入 Database 的 'test_results' 資料表
    const { data: dbData, error: dbError } = await supabase
      .from('test_results')
      .insert([
        { 
          photo_url: publicUrl, 
          score: parseFloat(score)
        }
      ]);

    if (dbError) throw dbError;

    console.log("Supabase 保存成功！", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Supabase 保存失敗:", error.message);
    return null;
  }
}