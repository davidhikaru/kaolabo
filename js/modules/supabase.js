// js/modules/supabase.js
import { SUPABASE_CONFIG } from '../config.js';

// 初始化 Supabase Client
const supabase = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

export async function saveTestRecord(imageBlob, score) {
  try {
    // 1. 生成安全無特化字元的檔名 (例如 photo_1729668900000.jpg)
    const fileName = `photo_${Date.now()}.jpg`;

    // 2. 上傳圖片至 Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('user-photos')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (storageError) {
      console.error('Storage 上傳失敗:', storageError.message);
      return;
    }

    // 3. 取得圖片公開 URL
    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // 4. 將分數與圖片網址寫入 Database test_result 資料表
    const { data: dbData, error: dbError } = await supabase
      .from('test_result')
      .insert([
        {
          score: score,
          image_url: imageUrl
        }
      ]);

    if (dbError) {
      console.error('Database 寫入失敗:', dbError.message);
      return;
    }

    console.log('🎉 成功上傳照片並記錄分數至 Supabase！', { imageUrl, score });

  } catch (err) {
    console.error('Supabase 保存失敗:', err);
  }
}
