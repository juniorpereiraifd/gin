import type { UploadFile } from 'antd/es/upload/interface';

export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export async function fileToBase64(file: File): Promise<string | null> {
  if (!file) {
    return null;
  }

  return fileToDataURL(file);
}

export async function uploadFileToBase64(uploadFile?: UploadFile): Promise<string | null> {
  const file = uploadFile?.originFileObj as File | undefined;

  if (!file) {
    return null;
  }

  return fileToBase64(file);
}

export async function uploadListToBase64(list?: UploadFile[]): Promise<string[]> {
  if (!list?.length) {
    return [];
  }

  const arr = await Promise.all(list.map(uploadFileToBase64));

  return arr.filter((x): x is string => Boolean(x));
}

export function urlToUploadFile(url: string, name: string, mime: string, id?: string): UploadFile {
  return {
    uid: id || name,
    name,
    status: 'done',
    thumbUrl: url,
    type: mime,
  };
}

export function getFileNameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const parts = pathname.split('/');
    return parts[parts.length - 1] || '';
  } catch {
    const parts = url.split('/');
    return parts[parts.length - 1] || '';
  }
}
