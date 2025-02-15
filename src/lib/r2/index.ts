import {
    S3,
} from "@aws-sdk/client-s3";
import { env } from '$env/dynamic/private'

const s3 = new S3({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    },
});

//const upload = multer({ storage: multer.memoryStorage() });

export async function uploadFile(file: Blob, key: string) {
    const buffer = await file.arrayBuffer();

    return await s3.putObject({
        Bucket: env.R2_BUCKET,
        Key: key,
        Body: buffer,
    });

}

export async function downloadFile(key: string) {
    return await s3.getObject({
        Bucket: env.R2_BUCKET,
        Key: key,
    });
}
