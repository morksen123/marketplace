import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

// AWS S3 configuration
export const s3Client = new S3Client({
  region: 'ap-southeast-2',
  credentials: {
    accessKeyId: 'AKIAS2VS4QJVRXLKSVXV', // shift to .env file
    secretAccessKey: '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',
  },
});

export const uploadFileToS3 = async (file: File, fileName: string) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: 'gudfood-photos',
      Key: fileName,
      Body: file,
    },
  });

  try {
    const result = await upload.done();
    return `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const uploadMultipleFilesToS3 = async (files: File[]) => {
  const uploadedPictureUrls = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: 'gudfood-photos',
        Key: fileName,
        Body: file,
      },
    });

    try {
      const result = await upload.done();
      const url = `https://${result.Bucket}.s3.amazonaws.com/${result.Key}`;
      uploadedPictureUrls.push(url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return uploadedPictureUrls;
};
