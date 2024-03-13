import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import S3 from "../config/s3.js";

export default class S3Integration {
  static newInstance() {
    return new S3Integration();
  }

  async uploadFile(hsm = false, dirBucket, dirFile, fileName, contentType, publicAccess = false, bucketName = process.env.BUCKET, region = "sa-east-1", projectName = process.env.PROJECT_NAME) {
    return new Promise((resolve, reject) => {
      const s3 = S3.newInstance(region);
      let fileKey;

      if (hsm) {
        fileKey = projectName ? `publicFiles/${dirBucket}/${fileName}` : `${dirBucket}/publicFiles/${fileName}`;
      } else {
        fileKey = projectName ? `${projectName}/${dirBucket}/${fileName}` : `${dirBucket}/${fileName}`;
      }

      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: fs.createReadStream(dirFile),
        ACL: publicAccess ? "public-read" : "private",
        ContentType: contentType,
      };

      contentType ? (params.ContentType = contentType) : "";

      const url = region === "us-east-1" ? `https://${bucketName}.s3.amazonaws.com/${fileKey}` : `https://s3.${region}.amazonaws.com/${bucketName}/${fileKey}`;

      setTimeout(() => {
        s3.send(new PutObjectCommand(params))
          .then(() => {
            fs.unlinkSync(dirFile);
            resolve(url);
          })
          .catch((err) => {
            console.error(err);
            reject(err);
          });
      }, 2000);
    });
  }
}
