import { v } from 'convex/values';
import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import updateFollowCounts from '../helpers/updateFollowsCounts'

export const createUser = mutation({
    args: {
        username: v.string(),
        fullName: v.string(),
        email: v.string(),
        bio: v.optional(v.string()),
        image: v.string(),
        clerkId: v.string()
    },
    handler: async (ctx, args) => {

        const existingUser = await ctx.db.query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
            .first();

        if (existingUser) {
            return;
        }

        await ctx.db.insert('users', {
            username: args.username,
            fullName: args.fullName,
            email: args.email,
            bio: args.bio,
            image: args.image,
            clerkId: args.clerkId,
            followers: 0,
            following: 0,
            posts: 0
        })
    }
});

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Anauthorized user!");

    const currentUser = await ctx.db.query('users')
        .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
        .first();

    if (!currentUser) throw new Error("User not found!");

    return currentUser;
};

export const getUserByClekrId = query({
    args: {
        clerkId: v.string()
    },
    handler: async (ctx, args) => {
        const user = await ctx.db.query('users')
            .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
            .unique();

        return user;
    }
});

export const updateUser = mutation({
    args: {
        fullname: v.string(),
        bio: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        await ctx.db.patch(currentUser._id, {
            fullName: args.fullname,
            bio: args.bio
        });
    }
});

export const getUserProfile = query({
    args: { id: v.id('users') },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.id)
        if (!user) throw new Error("User not found!");

        return user;
    }
});

export const isFollowing = query({
    args: { followingId: v.id('users') },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        // if(currentUser) throw new Error("User not found");

        const following = await ctx.db.query('follows')
            .withIndex('by_follower_and_following', (q) => {
                return q.eq('followerId', currentUser._id).eq('followingId', args.followingId)
            }).first();
        return !!following;
    }
});

export const toggleFollow = mutation({
    args: { followingId: v.id('users') },
    handler: async (ctx, args) => {
        const currentUser = await getAuthenticatedUser(ctx);
        // if(currentUser) throw new Error("User not found");

        const isExisting = await ctx.db.query('follows')
            .withIndex('by_follower_and_following', (q) => {
                return q.eq('followerId', currentUser._id).eq('followingId', args.followingId)
            }).first();

        if (isExisting) {
            await ctx.db.delete(isExisting._id);
            await updateFollowCounts (ctx, currentUser._id, args.followingId, false);
        } else {
            await ctx.db.insert('follows', {
                followerId: currentUser._id,
                followingId: args.followingId
            });
            await updateFollowCounts(ctx, currentUser._id, args.followingId, true);
            await ctx.db.insert('notifications', {
                receiverId: args.followingId,
                senderId: currentUser._id,
                type: 'following'
            });
        }
    }
});

