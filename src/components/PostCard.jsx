import { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { formatDistanceToNow } from 'date-fns';

/**
 * PostCard component - displays a single post with image, title, caption, and interactions
 * @param {Object} post - Post data object
 * @param {string} currentUserId - ID of the currently logged-in user
 * @param {boolean} isLiked - Whether the current user has liked this post
 * @param {function} onLikeToggle - Callback when like button is clicked
 * @param {function} onDelete - Callback when delete is clicked
 * @param {function} onCommentClick - Optional callback when comment button is clicked
 */
export default function PostCard({
  post,
  currentUserId,
  isLiked = false,
  onLikeToggle,
  onDelete,
  onCommentClick,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isAuthor = post.user?._id === currentUserId;

  // Format relative time (e.g., "2 hours ago")
  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
    : '';

  // Get user initials for avatar fallback
  const userInitials = post.user?.username
    ? post.user.username.slice(0, 2).toUpperCase()
    : '??';

  const handleLikeClick = () => {
    onLikeToggle?.(post._id, !isLiked);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete?.(post._id);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      {/* Header: Author info and menu */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.avatarUrl} alt={post.user?.username} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{post.user?.username || 'Unknown'}</span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
        </div>

        {/* Options menu (only for post author) */}
        {isAuthor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      {/* Post Image */}
      <div className="relative w-full bg-muted" style={{ minHeight: '300px' }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <img
          src={post.imageUrl}
          alt={post.title}
          className={`w-full h-auto object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Post Content */}
      <CardContent className="pt-4">
        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
        {post.caption && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {post.caption}
          </p>
        )}
      </CardContent>

      {/* Footer: Like count and action buttons */}
      <CardFooter className="flex flex-col items-start space-y-3 pt-0">
        {/* Like count */}
        <div className="text-sm font-semibold">
          {post.likeCount === 0
            ? 'Be the first to like this'
            : `${post.likeCount} ${post.likeCount === 1 ? 'like' : 'likes'}`}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-4 w-full border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLikeClick}
            className="flex-1"
          >
            <Heart
              className={`mr-2 h-5 w-5 ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
            {isLiked ? 'Liked' : 'Like'}
          </Button>

          {onCommentClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCommentClick(post._id)}
              className="flex-1"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Comment
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
