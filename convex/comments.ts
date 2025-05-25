import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
    args: {
        postId: v.id("posts"),
        content: v.string()
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error("User not found!");
        const post = await ctx.db.get(args.postId);
        if (!post) throw new ConvexError("Post not found!");

        const commentId = await ctx.db.insert('comments', {
            postId: args.postId,
            userId: currentUser._id,
            content: args.content
        })
        await ctx.db.patch(args.postId, {
            comments: post.comments + 1
        });

        if (post.userId !== currentUser._id) {

            await ctx.db.insert('notifications', {
                senderId: currentUser._id,
                receiverId: post.userId,
                type: 'comment',
                postId: args.postId,
                commentId: commentId
            })
        }
        return commentId;
    }
});

export const getComments = query({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {

        const comments = await ctx.db.query('comments')
            .withIndex('by_post', (q) => q.eq('postId', args.postId))
            .collect();

        const commentsWithInfo = await Promise.all(
            comments.map(async (comment) => {
                const user = await ctx.db.get(comment.userId);
                if (!user) throw new Error("User not found!");
                return {
                    ...comment
                    , user: {
                        fullName: user!.fullName,
                        image: user.image
                    }
                };
            })
        );

        return commentsWithInfo;
    }
})
