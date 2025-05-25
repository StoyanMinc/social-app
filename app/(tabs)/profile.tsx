import Loader from '@/components/Loader';
import PostModal from '@/components/modals/PreviewPostModal';
import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { styles } from '@/styles/profile.styles';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function Profile() {
    const { signOut, userId } = useAuth();
    const [isEditModalVisible, setEditModalVisible] = useState<boolean>(false)

    const currentUser = useQuery(api.users.getUserByClekrId, userId ? { clerkId: userId } : 'skip')
    const userPosts = useQuery(api.posts.postsByUser, {});
    const updateUser = useMutation(api.users.updateUser);

    const [selectedPost, setSelectedPost] = useState<Doc<'posts'> | null>(null);
    const [updateUserData, setUpdateUserData] = useState({
        fullname: currentUser?.fullName || '',
        bio: currentUser?.bio || ''
    })

    const updateUserHandler = async () => {
        await updateUser(updateUserData);
        setEditModalVisible(false);
    }
    if (!currentUser || userPosts === undefined) return <Loader />
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.username}>{currentUser.username}</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={() => signOut()} style={styles.headerIcon}>
                        <Ionicons
                            name='log-out-outline'
                            size={24}
                            color={COLORS.white}
                        />
                    </TouchableOpacity>
                </View>

            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileInfo}>
                    <View style={styles.avatarAndStats}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={currentUser.image}
                                style={styles.avatar}
                                contentFit='cover'
                                transition={200}
                            />
                        </View>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                                <Text style={styles.statLabel}>Posts</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                                <Text style={styles.statLabel}>Followers</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{currentUser.following}</Text>
                                <Text style={styles.statLabel}>Following</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{currentUser.fullName}</Text>
                    {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}
                </View>
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditModalVisible(true)}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.shareButton}>
                        <Ionicons name='share-outline' size={20} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
                {userPosts.length === 0 && <NoPostsFound />}
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
                />
            </ScrollView>

            <Modal
                visible={isEditModalVisible}
                animationType='slide'
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView
                        style={styles.modalContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                    <Ionicons name='close' size={24} color={COLORS.white} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={updateUserData.fullname}
                                    onChangeText={(text) => setUpdateUserData((prev) => ({ ...prev, fullname: text }))}
                                    placeholderTextColor={COLORS.gray}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>bio</Text>
                                <TextInput
                                    style={[styles.input, styles.bioInput]}
                                    value={updateUserData.bio}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(text) => setUpdateUserData((prev) => ({ ...prev, bio: text }))}
                                    placeholderTextColor={COLORS.gray}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={updateUserHandler}
                            >
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>


                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
            {selectedPost &&
                <PostModal
                    post={selectedPost}
                    closemodal={() => setSelectedPost(null)}
                />
            }
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