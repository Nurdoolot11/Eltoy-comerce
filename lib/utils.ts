import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Сүрөттү авто-оптимизациялоо жана видеодон превью-сүрөт жасоо
export function getOptimizedImageUrl(url: string | undefined | null): string {
  if (!url) return '/placeholder.svg'

  // Cloudinary шилтемелерин иштеп чыгуу
  if (typeof url === 'string' && url.includes('/upload/')) {
    // Эгер видео шилтеме болсо, биринчи кадрдан 500px JPG сүрөт жасап алуу
    if (url.includes('/video/upload/') || url.match(/\.(mp4|webm|mov|avi)$/i)) {
      return url
        .replace('/video/upload/', '/video/upload/so_0,f_jpg,q_auto,w_500/')
        .replace(/\.[^/.]+$/, '.jpg')
    }
    // Жөнөкөй сүрөттү жеңилдетүү (f_auto, q_auto)
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_800/')
  }

  return url
}

// Видеону автоматтык кысуу (Compress) жана жеңилдетип ачуу
export function getOptimizedVideoUrl(url: string | undefined | null): string {
  if (!url) return ''

  if (typeof url === 'string' && url.includes('/upload/')) {
    // q_auto:eco - видеонун МБ көлөмүн сапатын бузбай кысат
    // vc_auto - бардык смартфондорго ылайыктуу формат тандайт
    // w_720 - HD форматына келтирип, жүктөлүшүн 3-4 эсе ылдамдатат
    if (url.includes('/video/upload/')) {
      return url.replace('/video/upload/', '/video/upload/q_auto:eco,vc_auto,w_720/')
    }
    return url.replace('/upload/', '/upload/q_auto:eco,vc_auto,w_720/')
  }

  return url
}