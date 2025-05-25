import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const generateUploadUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anauthorized!");
    return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
    args: {
        caption: v.optional(v.string()),
        storageId: v.id('_storage')
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const imageUrl = await ctx.storage.getUrl(args.storageId);
        if (!imageUrl) throw new Error("Image not found!");

        // create post
        const postId = await ctx.db.insert('posts', {
            userId: currentUser._id,
            imageUrl,
            storageId: args.storageId,
            caption: args.caption,
            likes: 0,
            comments: 0
        })

        // icrement user posts count
        await ctx.db.patch(currentUser._id, {
            posts: currentUser.posts + 1
        });

        return postId;
    }
});

export const getFeedPosts = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error('Unauthorized!');
        // get all posts
        const posts = await ctx.db.query('posts').order('desc').collect();
        if (posts.length === 0) return [];

        const postsWithInfo = await Promise.all(
            posts.map(async (post) => {
                const postAuthor = (await ctx.db.get(post.userId))!;
                const likes = await ctx.db
                    .query('likes')
                    .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', post._id))
                    .first();
                const bookmarks = await ctx.db
                    .query('bookmarks')
                    .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', post._id))
                    .first();
                return {
                    ...post,
                    postAuthor: {
                        _id: postAuthor?._id,
                        image: postAuthor?.image,
                        username: postAuthor?.username
                    },
                    isLiked: !!likes,
                    isBookmarked: !!bookmarks
                }
            })
        );

        return postsWithInfo;
    }
});

export const toggleLike = mutation({
    args: { postId: v.id('posts') },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);

        const existingLike = await ctx.db
            .query('likes')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first();

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error('Post not found!');

        if (existingLike) {
            await ctx.db.delete(existingLike._id);
            await ctx.db.patch(args.postId, { likes: post.likes - 1 });
            return false //disliked
        } else {
            await ctx.db.insert('likes', { userId: currentUser._id, postId: post._id });
            await ctx.db.patch(args.postId, { likes: post.likes + 1 });
            if (currentUser._id !== post.userId) {
                //TODO check if notification fn works
                await ctx.db.insert('notifications', {
                    postId: args.postId,
                    senderId: currentUser._id,
                    receiverId: post.userId,
                    type: 'like'
                });
            }
            return true; //liked
        }
    }
});

export const deletePost = mutation({
    args: { postId: v.id('posts') },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error('Unauthorized!');

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error('Post not found!');

        if (post.userId !== currentUser._id) throw new Error('Unauthorized!');

        //delete post likes
        const likes = await ctx.db.query('likes')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect();
        for (const like of likes) {
            await ctx.db.delete(like._id);
        }
        //delete post comments
        const comments = await ctx.db.query('comments')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect();
        for (const comment of comments) {
            await ctx.db.delete(comment._id);
        }
        //delete notifications
        const notifications = await ctx.db.query('notifications')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect();
        for (const notification of notifications) {
            await ctx.db.delete(notification._id);
        }
        //delete bookmarks
        const bookmarks = await ctx.db.query('bookmarks')
            .withIndex('by_post', (q) => q.eq('postId', post._id))
            .collect();
        for (const bookmark of bookmarks) {
            await ctx.db.delete(bookmark._id)
        }
        //delete files
        await ctx.storage.delete(post.storageId);
        //delete post
        await ctx.db.delete(post._id);
        //decrement user posts count
        await ctx.db.patch(currentUser._id, {
            posts: Math.max(0, (currentUser.posts || 1) - 1)
        });
    }
});

export const postsByUser = query({
    args: { userId: v.optional(v.id('users')) },
    handler: async (ctx, args) => {
        const user = args.userId ? await ctx.db.get(args.userId) : await getAuthenticatedUser(ctx);
        if (!user) throw new Error("User not found!");

        const posts = await ctx.db.query('posts')
            .withIndex('by_user', (q) => q.eq('userId', args.userId || user._id))
            .collect();

        return posts
    }
});