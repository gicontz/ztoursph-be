import { S3Service } from "src/aws-sdk/s3.object"

export enum AppBucketNames {
    USERS = 'ztoursph-user-images',
    HOME_PAGE = 'ztoursph-homepage-images',
    TOURS = 'ztoursph-tour-images'
}

export const getFileUri = async (Key: string, Bucket:AppBucketNames ) => {
    const imageUri = await (new S3Service).getFileURI(Key, Bucket);
    return imageUri;
}