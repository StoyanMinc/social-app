import { FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Loader from "@/components/Loader";
import Post from "@/components/Post";
import { COLORS } from "@/constants";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { styles } from '../../styles/feed.styles';
import { useState } from "react";

export default function Index() {
    const { signOut } = useAuth();
    const [refreshing, setRefreshing] = useState<boolean>(false)
    const posts = useQuery(api.posts.getFeedPosts);

    if (posts === undefined) return <Loader />
    if (posts.length === 0) return <NoPostFound />

    const onRefresh = () => { }

    return (
        <View style={styles.container} >
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Stoyan's SM</Text>
                <TouchableOpacity onPress={() => signOut()}>
                    <Ionicons name="log-out-outline" size={26} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={posts}
                renderItem={({ item }) => <Post post={item} />}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}

                contentContainerStyle={{ paddingBottom: 60 }} //* if we need space under the posts where scrolling
                ListHeaderComponent={
                    <ScrollView
                        horizontal
                        showsVerticalScrollIndicator={false}
                        style={styles.storiesContainer}
                    >
                        {/* MAP STORIES */}
                        <Text style={{ color: COLORS.white }}>Stories</Text>
                    </ScrollView>
                }
                refreshControl={

                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
            />
        </View>
    );
}

const NoPostFound = () => {
    return (

        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.background,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={{ fontSize: 20, color: COLORS.primary }}> No post Found</Text>
        </View >
    )

}