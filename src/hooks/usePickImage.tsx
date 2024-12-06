import {useActionSheet} from '@expo/react-native-action-sheet';
import {
  useCreateAttachment,
  useGetSignedUrl,
} from '@securecore-new-application/securecore-datacore';
import {AttachmentTypes} from '@securecore-new-application/securecore-datacore/lib/types';
import axios from 'axios';
import {Buffer} from 'buffer';
import {useToast} from 'native-base';
import React, {useRef} from 'react';
import DocumentPicker, {isCancel} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';

import {ProgressBar} from '@/components/common/ProgressBar';
import {UploadProgress} from '@/contexts/uploadProgress';
import {ToastNotifications} from '@/notifications/toasts';
import {getFileTimeStampS} from '@/utils/dateTime';

export type OnUpload = () => Promise<unknown> | undefined;
interface UsePickImageProps {
  onSuccess: () => Promise<unknown> | undefined;
  uploadProgress: UploadProgress;
  setUploadProgress: (uploads: UploadProgress) => void;
}
type AttachmentOptions = Record<string, unknown>;
export const usePickImage = ({
  onSuccess,
  uploadProgress,
  setUploadProgress,
}: UsePickImageProps) => {
  const {showActionSheetWithOptions} = useActionSheet();
  const [getSignedUrl] = useGetSignedUrl();
  const [createAttachment] = useCreateAttachment();
  const toast = useToast();

  const toastIdRef = useRef();

  const handleError = (error: unknown) => {
    const {message} = error as Error;

    if (isCancel(error) || message === 'User cancelled image selection') {
      return null;
    }

    toast.show({
      title: `${message}`,
      placement: 'top',
    });
  };

  const getFile = async (selectedIndex: number) =>
    [
      async () => {
        const cameraFile = await ImagePicker.openCamera({
          mediaType: 'photo',
          cropping: false,
          forceJpg: true,
        });
        const {mime, size, path} = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: cameraFile.path,
          width: cameraFile.width,
          height: cameraFile.height,
          cropperRotateButtonsHidden: true,
          cropping: true,
          forceJpg: true,
          cropperChooseText: 'Upload',
        });

        return {
          filename: `IMG_${getFileTimeStampS()}.jpg`,
          mime,
          size,
          path,
          type: AttachmentTypes.Image,
        };
      },
      async () => {
        const galleryFile = await ImagePicker.openPicker({
          mediaType: 'photo',
          cropping: false,
        });
        const {mime, size, path} = await ImagePicker.openCropper({
          mediaType: 'photo',
          path: galleryFile.path,
          width: galleryFile.width,
          height: galleryFile.height,
          cropperRotateButtonsHidden: true,
          cropping: true,
          cropperChooseText: 'Upload',
        });

        return {
          filename: galleryFile.filename,
          mime,
          size,
          path,
          type: AttachmentTypes.Image,
        };
      },
      async () => {
        const {filename, mime, size, path} = await ImagePicker.openPicker({
          mediaType: 'video',
          cropping: false,
        });

        return {
          filename,
          mime,
          size,
          path,
          type: AttachmentTypes.Video,
        };
      },
      async () => {
        const document = (
          await DocumentPicker.pick({
            allowMultiSelection: false,
          })
        )[0];

        return {
          filename: document.name,
          mime: document.type || 'application/octet-stream',
          size: document.size,
          path: document.uri,
          type: AttachmentTypes.Doc,
        };
      },
    ][selectedIndex]?.();

  const openToast = (uploadId: string) =>
    toast.show({
      id: uploadId,
      duration: null,
      render: () => <ProgressBar uploadId={uploadId} title="Uploading…" />,
      placement: 'top',
    });

  const sendFile = async ({
    url,
    uploadId,
    path,
    mime,
  }: {
    url: string;
    uploadId: string;
    path: string;
    mime: string;
  }) => {
    const base64 = await RNFS.readFile(path, 'base64');
    const buffer = Buffer.from(base64, 'base64');

    return axios.put(url, buffer, {
      headers: {
        'content-type': mime,
      },
      onUploadProgress: progress => {
        setUploadProgress({
          ...uploadProgress,
          [uploadId]: progress.total
            ? Math.round((progress.loaded * 100) / progress.total)
            : 0,
        });
      },
    });
  };

  const onSelectImage = (
    attachmentOptions: AttachmentOptions,
    onUpload?: OnUpload,
  ) => {
    showActionSheetWithOptions(
      {
        title: 'Select Image or Video',
        options: [
          'Take a Photo',
          'Choose from Library',
          'Upload Video',
          'Upload File',
          'Cancel',
        ],
        cancelButtonIndex: 4,
      },
      async selectedIndex => {
        if (selectedIndex === undefined) {
          return;
        }
        const uploadId = uuid.v4() as string;

        setUploadProgress({
          ...uploadProgress,
          [uploadId]: 0,
        });

        try {
          const file = await getFile(selectedIndex);

          if (!file) {
            return;
          }

          const {filename, mime, size, path, type} = file;

          const signedUrl = await getSignedUrl({
            variables: {
              data: {
                key: filename as string,
                contentType: mime as string,
                ...attachmentOptions,
              },
            },
          });

          toastIdRef.current = openToast(uploadId);

          await sendFile({
            url: signedUrl.data?.getSignedUrl?.uploadUrl as string,
            uploadId,
            path,
            mime,
          });

          await createAttachment({
            variables: {
              data: {
                ...attachmentOptions,
                name: filename as string,
                type,
                metadata: JSON.stringify({
                  filename,
                  filesize: size,
                }),
                url: signedUrl.data?.getSignedUrl?.fileUrl as string,
              },
            },
          });

          toast.close(toastIdRef.current);

          onUpload?.();
          onSuccess?.();

          toast.show({
            title: ToastNotifications.AttachmentAdded,
            placement: 'top',
          });
        } catch (error) {
          handleError(error);
        } finally {
          const {[uploadId]: currentUpload, ...rest} = uploadProgress;

          setUploadProgress(rest);
        }
      },
    );
  };

  const getPickImageActionOption = (
    attachmentOptions: AttachmentOptions,
    onUpload?: OnUpload,
  ) => ({
    title: '+ Add File',
    action: () => onSelectImage(attachmentOptions, onUpload),
  });

  return {getPickImageActionOption, onSelectImage};
};
