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
    // Эгер видео шилтеме болсо, андан 500px сапаттагы JPG сүрөт катары алуу
    if (url.includes('/video/upload/') || url.endsWith('.mp4')) {
      return url
        .replace('/video/upload/', '/video/upload/f_jpg,q_auto,w_500/')
        .replace(/\.[^/.]+$/, '.jpg')
    }
    // Жөнөкөй сүрөт болсо, желеге ылайыктап жеңилдетүү (f_auto, q_auto)
    return url.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_500/')
  }

  return url
}

// Товардын ичиндеги видеону жеңилдетип ачуу
export function getOptimizedVideoUrl(url: string | undefined | null): string {
  if (!url) return ''

  if (typeof url === 'string' && url.includes('/video/upload/')) {
    return url.replace('/video/upload/', '/video/upload/f_auto,q_auto,w_720/')
  }

  return url
}