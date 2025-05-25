import Loader from '@/components/Loader';
import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/profile.styles';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Pressable } from 'react-native';

export default function UserProfileScree() {

    const router = useRouter();
    const { id } = useLocalSearchParams()
    const user = useQuery(api.users.getUserProfile, { id: id as Id<'users'> });
    const userPosts = useQuery(api.posts.postsByUser, { userId: id as Id<'users'> });
    const isFollowing = useQuery(api.users.isFollowing, { followingId: id as Id<'users'> });
    const toggleFollow = useMutation(api.users.toggleFollow);
    const [selectPost, setSelectedPost] = useState<Doc<'posts'> | null>(null)

    const goBackHandler = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/(tabs)');
        }
    }

    const followHandler = async () => {
        await toggleFollow({ followingId: id as Id<'users'> })
    }

    if (user === undefined || userPosts === undefined || isFollowing === undefined) return <Loader />
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goBackHandler}>
                    <Ionicons name={'arrow-back'} size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{user.username}</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={user.image}
                                style={styles.avatar}
                                contentFit='cover'
                                transition={200}
                            />
                        </View>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{user.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{user.fullName}</Text>
                    {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
                </View>
                <Pressable style={styles.followButton} onPress={followHandler} >
                    <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
                </Pressable>
                {userPosts.length === 0
                    ? (<NoPostsFound />)
                    : (
                        <FlatList
                            data={userPosts}
                            numColumns={3}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.gridItem} onPress={() => setSelectedPost(item)}>
                                    <Image
                                        source={item.imageUrl}
                                        style={styles.gridImage}
                                        contentFit='cover'
                                        transition={200}
                                    />
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item._id}
                        />
                    )}

            </ScrollView>
        </View>
    );
}

function NoPostsFound() {
    return (
        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
            <Ionicons name='image-outline' size={48} color={COLORS.primary} />
            <Text style={{ fontSize: 20, color: COLORS.white }}>No posts yet</Text>
        </View>
    )
}