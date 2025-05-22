import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/feed.styles';
import CommentsModal from './CommentsModal';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@clerk/clerk-expo';

type PostProps = {
    post: {
        _id: Id<'posts'>,
        imageUrl: string,
        caption?: string,
        likes: number,
        comments: number,
        _creationTime: number,
        isLiked: boolean,
        isBookmarked: boolean,
        postAuthor: {
            _id: string,
            username: string,
            image: string
        }
    }

}

export default function Post({ post }: PostProps) {
    const [isLiked, setIsLiked] = useState(post.isLiked);
    const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    const [showComents, setShowComments] = useState(false);

    const { user } = useUser();

    const currentUser = useQuery(api.users.getUserByClekrId, user ? { clerkId: user.id } : 'skip');
    const toggleLike = useMutation(api.posts.toggleLike)
    const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
    const deletePost = useMutation(api.posts.deletePost);

    const handleLike = async () => {

        try {
            const result = await toggleLike({ postId: post._id });
            setIsLiked(result);
            setLikesCount((prev) => result ? prev + 1 : prev - 1);
        } catch (error) {
            console.log('Error toggle like:', error);
        }
    }
    const handleBookmark = async () => {
        const result = await toggleBookmark({ postId: post._id });
        setIsBookmarked(result);
    }

    const deletePostHandler = async () => {
        try {
            await deletePost({ postId: post._id });
        } catch (error) {
            console.log('Error deleting post:', error);
        }
    }

    console.log(post);
    return (
        <View style={styles.post}>
            {/* HEADER */}
            <View style={styles.postHeader}>
                <Link href={'/(tabs)/notifications'}>
                    <TouchableOpacity style={styles.postHeaderLeft}>
                        <Image
                            source={post.postAuthor.image}
                            style={styles.postAvatar}
                            contentFit='cover'
                            transition={200}
                            cachePolicy={'memory-disk'}
                        />
                        <Text style={styles.postUsername}>{post.postAuthor.username}</Text>
                    </TouchableOpacity>
                </Link>
                {/* TODO fix it later */}
                {post.postAuthor._id === currentUser?._id ? (
                    <TouchableOpacity onPress={deletePostHandler}>
                        <Ionicons name='trash' size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity>
                        <Ionicons name='ellipsis-horizontal' size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                )}

            </View>
            {/* POST IMAGE */}
            <Image
                source={post.imageUrl}
                style={styles.postImage}
                contentFit='cover'
                transition={200}
                cachePolicy={'memory-disk'}
            />

            {/* POST ACTIONS */}
            <View style={styles.postAction}>
                <View style={styles.postActionLeft}>
                    <TouchableOpacity onPress={handleLike}>
                        <Ionicons
                            name={isLiked ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isLiked ? COLORS.primary : COLORS.white}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Ionicons name='chatbubble-outline' size={22} color={COLORS.white} />
                    </TouchableOpacity>

                </View>
                <TouchableOpacity onPress={handleBookmark}>
                    <Ionicons
                        name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                        size={22}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
            </View>

            {/* POST INFO */}
            <View style={styles.postInfo}>
                <Text style={styles.likesText}>Be the first to like</Text>
                {post.caption && (
                    <View style={styles.captionContainer}>
                        <Text style={styles.captionUsername}>{post.postAuthor.username}</Text>
                        <Text style={styles.captionText}>{post.caption}</Text>
                    </View>
                )}
                {commentsCount > 0 && (
                    <TouchableOpacity onPress={() => setShowComments(true)}>
                        <Text style={styles.commentsText}>View All {commentsCount} comments</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity>
                    <Text style={styles.commentText}>{likesCount > 0 ? `${likesCount} likes` : 'Be the first to like'}</Text>
                </TouchableOpacity>
                <Text style={styles.timeAgo}>
                    {formatDistanceToNow(post._creationTime, { addSuffix: true })}
                </Text>
            </View>
            <CommentsModal
                postId={post._id}
                visible={showComents}
                onClose={() => setShowComments(false)}
                onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
            />
        </View>
    );
}