/**
 * Загрузка изображения на Cloudinary через unsigned upload preset.
 * Не требует backend — браузер отправляет файл напрямую.
 *
 * Настройка:
 * 1. Зарегистрируйтесь на cloudinary.com
 * 2. Settings → Upload → Upload presets → Add upload preset (Unsigned)
 * 3. Заполните .env:
 *    VITE_CLOUDINARY_CLOUD_NAME=ваш_cloud_name
 *    VITE_CLOUDINARY_UPLOAD_PRESET=ваш_preset_name
 */
export async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary non configuré. Remplissez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    throw new Error(`Cloudinary upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.secure_url;
}

/** Проверяет что Cloudinary настроен */
export function isCloudinaryConfigured() {
  return !!(
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME &&
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );
}
