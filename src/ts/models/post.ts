/****************************************************************************************
 * Copyright (c) 2022. HuiiBuh                                                          *
 * This file (post.ts) is part of InstagramDownloader which is not released             *
 * under any licence.                                                                   *
 * Any usage of this code outside this project is not allowed.                          *
 ****************************************************************************************/
// tslint:disable:no-any

export interface Dimensions {
    height: number;
    width: number;
}

export interface DisplayResource {
    src: string;
    config_width: number;
    config_height: number;
}

export interface DashInfo {
    is_dash_eligible: boolean;
    video_dash_manifest: string;
    number_of_qualities: number;
}

export interface EdgeMediaToTaggedUser {
    edges: any[];
}

export interface Edge {
    node: Node;
}

export interface EdgeMediaToCaption {
    edges: Edge[];
}

export interface PageInfo {
    has_next_page: boolean;
    end_cursor: string;
}

export interface Owner {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

export interface EdgeLikedBy {
    count: number;
}

export interface PageInfo2 {
    has_next_page: boolean;
    end_cursor: string;
}

export interface Owner2 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

export interface EdgeLikedBy2 {
    count: number;
}

export interface Node3 {
    id: string;
    text: string;
    created_at: number;
    did_report_as_spam: boolean;
    owner: Owner2;
    viewer_has_liked: boolean;
    edge_liked_by: EdgeLikedBy2;
    is_restricted_pending: boolean;
}

export interface Edge3 {
    node: Node3;
}

export interface EdgeThreadedComments {
    count: number;
    page_info: PageInfo2;
    edges: Edge3[];
}

export interface Node2 {
    id: string;
    text: string;
    created_at: number;
    did_report_as_spam: boolean;
    owner: Owner;
    viewer_has_liked: boolean;
    edge_liked_by: EdgeLikedBy;
    is_restricted_pending: boolean;
    edge_threaded_comments: EdgeThreadedComments;
}

export interface Edge2 {
    node: Node2;
}

export interface EdgeMediaToParentComment {
    count: number;
    page_info: PageInfo;
    edges: Edge2[];
}

export interface EdgeMediaToHoistedComment {
    edges: any[];
}

export interface Owner3 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

export interface EdgeLikedBy3 {
    count: number;
}

export interface Node4 {
    id: string;
    text: string;
    created_at: number;
    did_report_as_spam: boolean;
    owner: Owner3;
    viewer_has_liked: boolean;
    edge_liked_by: EdgeLikedBy3;
    is_restricted_pending: boolean;
}

export interface Edge4 {
    node: Node4;
}

export interface EdgeMediaPreviewComment {
    count: number;
    edges: Edge4[];
}

export interface EdgeMediaPreviewLike {
    count: number;
    edges: any[];
}

export interface EdgeMediaToSponsorUser {
    edges: any[];
}

export interface EdgeOwnerToTimelineMedia {
    count: number;
}

export interface Owner4 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    username: string;
    blocked_by_viewer: boolean;
    restricted_by_viewer: boolean;
    followed_by_viewer: boolean;
    full_name: string;
    has_blocked_viewer: boolean;
    is_private: boolean;
    is_unpublished: boolean;
    requested_by_viewer: boolean;
    edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
}

export interface EdgeWebMediaToRelatedMedia {
    edges: any[];
}

export interface GraphqlQuery {
    graphql: {
        shortcode_media: ShortcodeMedia;
    };
}

export interface Candidate {
    width: number;
    height: number;
    url: string;
}

export interface ImageVersions {
    candidates: Candidate[];
}

export interface CarouselMedia {
    image_versions2: ImageVersions;
    video_versions?: Candidate[];
}

export interface PostItem {
    carousel_media_count?: number;
    carousel_media?: CarouselMedia[];
    image_versions2?: ImageVersions;
    user: Pick<Owner4, 'username' | 'is_private' | 'profile_pic_url'>;
    video_versions?: Candidate[];
}

export interface PostQuery {
    items: PostItem[];
}

export interface ShortcodeMedia {
    __typename: 'GraphSidecar' | 'GraphImage' | 'GraphVideo';
    id: string;
    shortcode: string;
    dimensions: Dimensions;
    gating_info?: any;
    fact_check_overall_rating?: any;
    fact_check_information?: any;
    sensitivity_friction_info?: any;
    media_preview: string;
    display_url: string;
    display_resources: DisplayResource[];
    accessibility_caption?: any;
    dash_info: DashInfo;
    video_url: string;
    video_view_count: number;
    is_video: boolean;
    tracking_token: string;
    edge_media_to_tagged_user: EdgeMediaToTaggedUser;
    edge_media_to_caption: EdgeMediaToCaption;
    caption_is_edited: boolean;
    has_ranked_comments: boolean;
    edge_media_to_parent_comment: EdgeMediaToParentComment;
    edge_media_to_hoisted_comment: EdgeMediaToHoistedComment;
    edge_media_preview_comment: EdgeMediaPreviewComment;
    comments_disabled: boolean;
    commenting_disabled_for_viewer: boolean;
    taken_at_timestamp: number;
    edge_media_preview_like: EdgeMediaPreviewLike;
    edge_media_to_sponsor_user: EdgeMediaToSponsorUser;
    location?: any;
    viewer_has_liked: boolean;
    viewer_has_saved: boolean;
    viewer_has_saved_to_collection: boolean;
    viewer_in_photo_of_you: boolean;
    viewer_can_reshare: boolean;
    owner: Owner4;
    is_ad: boolean;
    edge_web_media_to_related_media: EdgeWebMediaToRelatedMedia;
    encoding_status?: any;
    is_published: boolean;
    product_type: string;
    title: string;
    video_duration: number;
    thumbnail_src: string;
    edge_sidecar_to_children: EdgeSidecarToChildren;

}

export interface EdgeSidecarToChildren {
    edges: Edge[];
}

export interface Node {
    __typename: string;
    id: string;
    shortcode: string;
    dimensions: Dimensions;
    gating_info?: any;
    fact_check_overall_rating?: any;
    fact_check_information?: any;
    sensitivity_friction_info?: any;
    media_preview: string;
    display_url: string;
    display_resources: DisplayResource[];
    accessibility_caption: string;
    is_video: boolean;
    video_url: string;
    tracking_token: string;
    edge_media_to_tagged_user: EdgeMediaToTaggedUser;
    edge_sidecar_to_children?: EdgeSidecarToChildren;
}
