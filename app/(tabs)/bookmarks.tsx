import Loader from '@/components/Loader';
import { COLORS } from '@/constants';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarkedPosts);

  if (!bookmarkedPosts) return <Loader />
  if (bookmarkedPosts.length === 0) return <NotFoundBookmars />
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>
      {/* BOOKMAKRS */}
      <ScrollView
        contentContainerStyle={{
          padding: 8,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <View style={{ width: '33%', padding: 10 }} key={post._id}>
              <Image
                source={post.imageUrl}
                style={{ width: '100%', aspectRatio: 1, borderRadius: 10 }}
                contentFit="cover"
                transition={200}
                cachePolicy={'memory-disk'}
              />
            </View>
          )
        })}
      </ScrollView>
    </View>
  );
}

function NotFoundBookmars() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.primary, fontSize: 20 }}>No saved bookmarks yet</Text>
    </View>
  );
}