import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../api/axios';
import { logout } from '../auth/authSlice';
import { postsApi } from '@/api/posts';
import PostCard from '@/components/PostCard';
import PostSkeleton from '@/components/PostSkeleton';
import CreatePost from './CreatePost';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

export default function FeedPage() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const currentUserId = user?._id || user?.id;

  // Fetch posts with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => postsApi.fetchPosts({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage.data;
      return pagination.hasNextPage ? pagination.currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onMutate: async (formData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['posts']);

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update with temp post
      const tempPost = {
        _id: 'temp-' + Date.now(),
        title: formData.get('title'),
        caption: formData.get('caption') || '',
        imageUrl: URL.createObjectURL(formData.get('image')),
        user: {
          _id: currentUserId,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
        likeCount: 0,
        likedByMe: false,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return { pages: [{ data: { posts: [tempPost] } }], pageParams: [1] };
        return {
          ...old,
          pages: [
            {
              ...old.pages[0],
              data: {
                ...old.pages[0].data,
                posts: [tempPost, ...old.pages[0].data.posts],
              },
            },
            ...old.pages.slice(1),
          ],
        };
      });

      return { previousPosts, tempPost };
    },
    onSuccess: (response, variables, context) => {
      // Replace temp post with real post
      const newPost = response.data.post;
      
      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                data: {
                  ...page.data,
                  posts: page.data.posts.map((post) =>
                    post._id === context.tempPost._id ? newPost : post
                  ),
                },
              };
            }
            return page;
          }),
        };
      });

      toast.success('Post created successfully!');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });

  // Like toggle mutation
  const likeMutation = useMutation({
    mutationFn: ({ postId }) => postsApi.toggleLike(postId),
    onMutate: async ({ postId, newLikedState }) => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update cache
      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.map((post) =>
                post._id === postId
                  ? {
                      ...post,
                      likeCount: post.likeCount + (newLikedState ? 1 : -1),
                      likedByMe: newLikedState,
                    }
                  : post
              ),
            },
          })),
        };
      });

      return { previousPosts };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error('Failed to update like');
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries(['posts']);
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically remove from cache
      queryClient.setQueryData(['posts'], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: {
              ...page.data,
              posts: page.data.posts.filter((post) => post._id !== postId),
            },
          })),
        };
      });

      return { previousPosts };
    },
    onSuccess: () => {
      toast.success('Post deleted successfully');
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
      toast.error(error.response?.data?.message || 'Failed to delete post');
    },
  });

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleLikeToggle = (postId, newLikedState) => {
    likeMutation.mutate({ postId, newLikedState });
  };

  const handleDelete = (postId) => {
    deleteMutation.mutate(postId);
  };

  const handleCreatePost = (formData) => {
    return createPostMutation.mutateAsync(formData);
  };

  // Get all posts from pages
  const allPosts = data?.pages.flatMap((page) => page.data.posts) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logout */}
      <div className="border-b">
        <div className="container max-w-2xl mx-auto py-4 px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Feed</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user?.username}!
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* Create post button */}
        <CreatePost onSubmit={handleCreatePost} isLoading={createPostMutation.isPending} />

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-6">
            <PostSkeleton />
            <PostSkeleton /> 
            <PostSkeleton />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-destructive">
              {error.response?.data?.message || 'Failed to load posts'}
            </p>
            <Button
              onClick={() => queryClient.invalidateQueries(['posts'])}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && allPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
          </div>
        )}

        {/* Posts list */}
        {!isLoading && !isError && allPosts.length > 0 && (
          <div className="space-y-6">
            {allPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                isLiked={post.likedByMe || false}
                onLikeToggle={handleLikeToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasNextPage && (
          <div className="text-center py-6">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="outline"
              size="lg"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
