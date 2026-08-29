/**
 * Загрузка изображения на Cloudinary через unsigned upload preset.
 * В случае отсутствия или сбоя Cloudinary автоматически переключается на Data URL,
 * поэтому загрузка и замена фотографий всегда работает безотказно.
 */
export async function uploadToCloudinary(file) {
  if (!file) return '';

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.secure_url) return data.secure_url;
      }
    } catch (e) {
      console.warn('Cloudinary upload warning, using local file reader fallback:', e);
    }
  }

  // Fallback: convert file to standard data URL so replacement always works 100%
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Проверяет настроен ли Cloudinary */
export function isCloudinaryConfigured() {
  return !!(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
}
