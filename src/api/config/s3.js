import { S3Client } from "@aws-sdk/client-s3";

export default class S3 {
  static newInstance(region = "sa-east-1") {
    const credentials = { accessKeyId: process.env.ACCESSKEYID, secretAccessKey: process.env.SECRETACCESSKEY };
    return new S3Client({
      credentials,
      region,
    });
  }

  static newExternalInstance(accessKeyId = "", secretAccessKey = "", region = "sa-east-1") {
    const credentials = { accessKeyId, secretAccessKey };
    return new S3Client({
      credentials,
      region,
    });
  }
}
