import API from '../api/axiosinterceptor';
import { ApiRoute } from '../constants/apiConstants';

export interface PresignedUrlResponse {
  url: string;
  key: string;
}


export const uploadToS3 = async (file: File): Promise<string> => {
  // 1. Request a presigned URL from the backend
  const { data } = await API.get<PresignedUrlResponse>(
    `${ApiRoute.S3_PRESIGNED_URL}?fileName=${encodeURIComponent(file.name)}&fileType=${encodeURIComponent(file.type)}`
  );

  const { url, key } = data;

  // 2. Upload the file directly to S3 via PUT request
  const uploadResponse = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3");
  }

  // 3. Return the key to be saved in the database
  return key;
};
