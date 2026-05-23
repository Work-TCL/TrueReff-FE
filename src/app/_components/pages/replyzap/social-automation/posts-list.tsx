"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCreatorStore } from "@/lib/store/creator";
import {
  getReplyZapSessionToken,
  getReplyZapPosts,
  IReplyZapPost,
} from "@/lib/web-api/replayzap";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyPlaceHolder } from "../../../ui/empty-place-holder";
import BackButton from "../../../ui/back-button";
import Loader from "../../../components-common/layout/loader";
import { ImageOff, Zap } from "lucide-react";

interface IPostsListProps {
  connectionId: string;
}

export default function PostsList({ connectionId }: IPostsListProps) {
  const translate = useTranslations();
  const router = useRouter();
  const { creator } = useCreatorStore();
  const [posts, setPosts] = useState<IReplyZapPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Cursor + has-more, sourced from Meta's `paging.cursors.after`. Threaded
  // back through the partner API so the UI can fetch older posts on demand.
  const [endUserId, setEndUserId] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!creator?.creatorId) return;
    try {
      setLoading(true);
      setError(null);
      const session = await getReplyZapSessionToken(creator.creatorId);
      setEndUserId(session.endUserId);
      const page = await getReplyZapPosts(session.endUserId, connectionId);
      setPosts(page.data);
      setNextCursor(page.paging.nextCursor);
      setHasMore(page.paging.hasMore);
    } catch (err) {
      console.error("[posts-list] fetch failed:", err);
      setPosts([]);
      setError(translate("Failed_to_load_posts"));
    } finally {
      setLoading(false);
    }
  }, [creator?.creatorId, connectionId, translate]);

  // Appends the next Meta page. Guarded against double-clicks while in-flight.
  const loadMore = useCallback(async () => {
    if (!endUserId || !nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const page = await getReplyZapPosts(endUserId, connectionId, nextCursor);
      setPosts((prev) => [...prev, ...page.data]);
      setNextCursor(page.paging.nextCursor);
      setHasMore(page.paging.hasMore);
    } catch (err) {
      console.error("[posts-list] load-more failed:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [endUserId, connectionId, nextCursor, loadingMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) return <Loader fixed={false} />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-xl shadow-md min-h-[300px]">
        <p className="text-red-500 text-sm">{error}</p>
        <button
          onClick={fetchPosts}
          className="px-4 py-2 text-sm text-white bg-primary-color rounded-md hover:opacity-90"
        >
          {translate("Try_Again")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg flex flex-col gap-4 h-full">
      <div className="flex items-center gap-4">
        <BackButton />
        <h2 className="text-sm xl:text-xl font-medium">
          {translate("Posts")}
        </h2>
      </div>

      {posts.length === 0 ? (
        <EmptyPlaceHolder
          title={translate("No_Posts_Found")}
          description={translate("No_Posts_Found_Desc")}
        />
      ) : (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border border-stroke rounded-xl p-4 hover:shadow-md transition-shadow bg-white overflow-hidden"
            >
              <CardContent className="p-0 flex flex-col gap-3">
                <div className="bg-background rounded-lg aspect-square w-full flex items-center justify-center overflow-hidden relative">
                  {post.media_type?.toUpperCase() === "VIDEO" &&
                  post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.caption || "Post"}
                      className="w-full h-full object-cover"
                    />
                  ) : post.media_url ? (
                    <img
                      src={post.media_url}
                      alt={post.caption || "Post"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageOff className="w-8 h-8 text-gray-400" />
                  )}

                  {post.isCommentReplyEnabled && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                      <Zap size={10} />
                      {translate("Active")}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 capitalize">
                    {post.media_type || post.mediaType}
                  </span>
                  {post.caption && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {post.caption}
                    </p>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(post.timestamp || post.createdAt || "").toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/creator/social-automation/${connectionId}/${post.mediaId || post.id}`
                    )
                  }
                  className={`w-full px-3 py-2 text-sm border rounded-xl transition-all text-center ${
                    post.isCommentReplyEnabled
                      ? "bg-white text-primary-color border-primary-color hover:bg-pink-50"
                      : "bg-primary-color text-white hover:opacity-90"
                  }`}
                >
                  {post.isCommentReplyEnabled
                    ? translate("Edit_Automation")
                    : translate("Create_Automation")}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 py-2 text-sm rounded-xl border border-primary-color text-primary-color hover:bg-pink-50 transition-all disabled:opacity-50"
            >
              {loadingMore ? translate("Loading") : translate("Load_More")}
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
