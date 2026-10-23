import { SUPABASE_CONFIG } from '../config.js';

const supabase = window.supabase.createClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
);

// 加上 index 參數，預設為 0
export async function saveTestRecord(imageBlob, score, index = 0) {
  try {
    // 檔名加上 index 防止覆蓋
    const fileName = `photo_${Date.now()}_${index}.jpg`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('user-photos')
      .upload(fileName, imageBlob, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (storageError) {
      console.error(`Storage 上傳失敗 (照片 ${index}):`, storageError.message);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('user-photos')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    const { data: dbData, error: dbError } = await supabase
      .from('test_result')
      .insert([
        {
          score: score,
          image_url: imageUrl
        }
      ]);

    if (dbError) {
      console.error(`Database 寫入失敗 (照片 ${index}):`, dbError.message);
      return;
    }

    console.log(`🎉 成功上傳照片 ${index}！`, { imageUrl, score });

  } catch (err) {
    console.error(`Supabase 保存失敗 (照片 ${index}):`, err);
  }
}
