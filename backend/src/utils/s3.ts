import { S3Client, PutObjectCommand, ObjectCannedACL } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Response interface for the upload function
 */
interface UploadResponse {
  success: boolean;
  url: string | null;
  error?: string;
}

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;



export async function uploadFileToS3(
  file:Express.Multer.File | undefined,
): Promise<UploadResponse> {
  try {
    if (!file) {
      return {
        success: false,
        url: null,
        error: 'No file provided'
      };
    }
    const s3Client = new S3Client({ 
      region: region,
      credentials: {
            accessKeyId: accessKeyId || '',
            secretAccessKey: secretAccessKey || ''
        }
    });    
    const params = {
      Bucket: bucketName,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ObjectCannedACL: ObjectCannedACL.public_read
    };

    await s3Client.send(new PutObjectCommand(params));
    
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${encodeURIComponent(file.originalname)}`;
    
    return {
      success: true,
      url: publicUrl
    };
    
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return {
      success: false,
      url: null,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}




