import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const toggleBookmark = mutation({
    args: {
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error("User not found!");

        const post = await ctx.db.get(args.postId);
        if (!post) throw new Error("Post not found!");

        const isBookmarked = await ctx.db.query('bookmarks')
            .withIndex('by_user_and_post', (q) => q.eq('userId', currentUser._id).eq('postId', args.postId))
            .first()

        if (isBookmarked) {
            await ctx.db.delete(isBookmarked._id);
            return false
        } else {
            await ctx.db.insert('bookmarks', {
                userId: currentUser._id,
                postId: args.postId
            })
            return true
        }
    }
})

export const getBookmarkedPosts = query({
    handler: async (ctx) => {
        const currentUser = await getAuthenticatedUser(ctx);
        if (!currentUser) throw new Error("User not found!");

        const bookmarks = await ctx.db.query('bookmarks')
            .withIndex('by_user', (q) => q.eq('userId', currentUser._id))
            .collect();

        const bookmarksWithInfo = await Promise.all(
            bookmarks.map(async (bookmark) => {
                const post = await ctx.db.get(bookmark.postId);
                if (!post) throw new Error("Post not found!");
                return post
            })
        )
        return bookmarksWithInfo;
    }
})