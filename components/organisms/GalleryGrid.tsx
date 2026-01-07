import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { Photo } from '../../lib/store/galleryStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const SPACING = 4;
const ITEM_SIZE = (SCREEN_WIDTH - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

interface GalleryGridProps {
  photos: Photo[];
  onPhotoPress: (photo: Photo) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ photos, onPhotoPress }) => {
  const renderItem = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => onPhotoPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      {/* Empty state is handled in parent */}
    </View>
  );

  return (
    <FlatList
      data={photos}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
      ListEmptyComponent={renderEmpty}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING,
  },
  row: {
    justifyContent: 'flex-start',
    paddingHorizontal: SPACING,
    marginBottom: SPACING,
  },
  imageContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    marginRight: SPACING,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBackground,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
  },
});
