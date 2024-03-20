export declare enum AppBucketNames {
    USERS = "ztoursph-user-images",
    HOME_PAGE = "ztoursph-homepage-images",
    TOURS = "ztoursph-tour-images"
}
export declare const getFileUri: (Key: string, Bucket: AppBucketNames) => Promise<string>;
