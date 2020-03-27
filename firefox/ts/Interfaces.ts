'use strict';

interface DownloadMessage {
    imageURL: string;
    accountName: string;
    type: ContentType;
}

enum ContentType {
    single,
    bulk
}

interface Image {
    imageSRC: string;
    type: ContentType
}

enum HoverType {
    image,
    igtv
}
