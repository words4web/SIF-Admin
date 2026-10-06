export interface PresignedFileResponse {
  key: string;
  uploadUrl: string;
}

export interface GetUploadUrlsResponse {
  sessionId: string;
  files: PresignedFileResponse[];
}

export interface ImageItem {
  id: string;
  url?: string;
  file?: File;
  previewUrl: string;
}

export interface ImageUploaderProps {
  value?: (string | File)[];
  onChange?: (files: (string | File)[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  error?: string;
  disabled?: boolean;
}
