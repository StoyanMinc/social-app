import {Id} from '../convex/_generated/dataModel'
import { MutationCtx } from "../convex/_generated/server";

export default async function updateFollowCounts(
    ctx: MutationCtx,
    followerId: Id<'users'>,
    followingId: Id<'users'>,
    isFollow: boolean) {

    const followerUser = await ctx.db.get(followerId);
    const followingUser = await ctx.db.get(followingId);

    if (followerUser && followingUser) {
        await ctx.db.patch(followerId, {
            following: isFollow ? followerUser.following + 1 : followerUser.following - 1
        });
        await ctx.db.patch(followingId, {
            followers: isFollow ? followingUser.followers + 1 : followingUser.followers - 1
        })
    }
}