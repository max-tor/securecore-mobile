export type UploadProgress = {
  [key in string]: number;
};

export interface UploadProgressContextInterface {
  uploadProgress: UploadProgress;
  setUploadProgress: (uploads: UploadProgress) => void;
}
