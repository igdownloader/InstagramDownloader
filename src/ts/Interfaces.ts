/****************************************************************************************
 * Copyright (c) 2020. HuiiBuh                                                          *
 * This file (Interfaces.ts) is part of InstagramDownloader which is released under     *
 * GNU LESSER GENERAL PUBLIC LICENSE.                                                   *
 * You are not allowed to use this code or this file for another project without        *
 * linking to the original source AND open sourcing your code.                          *
 ****************************************************************************************/

interface DownloadMessage {
    imageURL: string[];
    accountName: string;
    type: ContentType;
}

interface BulkDownloadMessage {
    imageURL: string[];
    accountName: string;
    type: ContentType;
}

enum ContentType {
    single,
    bulk
}

interface Image {
    imageSRC: string;
    type: ContentType;
}

/********************************************/

interface Dimensions {
    height: number;
    width: number;
}

interface DisplayResource {
    src: string;
    config_width: number;
    config_height: number;
}

interface DashInfo {
    is_dash_eligible: boolean;
    video_dash_manifest: string;
    number_of_qualities: number;
}

interface EdgeMediaToTaggedUser {
    edges: any[];
}

interface Edge {
    node: Node;
}

interface EdgeMediaToCaption {
    edges: Edge[];
}

interface PageInfo {
    has_next_page: boolean;
    end_cursor: string;
}

interface Owner {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

interface EdgeLikedBy {
    count: number;
}

interface PageInfo2 {
    has_next_page: boolean;
    end_cursor: string;
}

interface Owner2 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

interface EdgeLikedBy2 {
    count: number;
}

interface Node3 {
    id: string;
    text: string;
    created_at: number;
    did_report_as_spam: boolean;
    owner: Owner2;
    viewer_has_liked: boolean;
    edge_liked_by: EdgeLikedBy2;
    is_restricted_pending: boolean;
}

interface Edge3 {
    node: Node3;
}

interface EdgeThreadedComments {
    count: number;
    page_info: PageInfo2;
    edges: Edge3[];
}

interface Node2 {
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

interface Edge2 {
    node: Node2;
}

interface EdgeMediaToParentComment {
    count: number;
    page_info: PageInfo;
    edges: Edge2[];
}

interface EdgeMediaToHoistedComment {
    edges: any[];
}

interface Owner3 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
    username: string;
}

interface EdgeLikedBy3 {
    count: number;
}

interface Node4 {
    id: string;
    text: string;
    created_at: number;
    did_report_as_spam: boolean;
    owner: Owner3;
    viewer_has_liked: boolean;
    edge_liked_by: EdgeLikedBy3;
    is_restricted_pending: boolean;
}

interface Edge4 {
    node: Node4;
}

interface EdgeMediaPreviewComment {
    count: number;
    edges: Edge4[];
}

interface EdgeMediaPreviewLike {
    count: number;
    edges: any[];
}

interface EdgeMediaToSponsorUser {
    edges: any[];
}

interface EdgeOwnerToTimelineMedia {
    count: number;
}

interface Owner4 {
    id: string;
    is_verified: boolean;
    profile_pic_url: string;
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

interface EdgeWebMediaToRelatedMedia {
    edges: any[];
}

interface ShortcodeMedia {
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


interface EdgeSidecarToChildren {
    edges: Edge[];
}


interface Node {
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
}


