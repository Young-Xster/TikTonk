import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image, ViewToken } from 'react-native'
import React, { useState, useRef, useContext } from 'react'
import * as Animatable from 'react-native-animatable'
import { PostContext } from "../context/PostContext"

interface Post {
  Item: {
    id: string;
    thumbnail: string;
    name: string;
  }
}

Animatable.initializeRegistryWithDefinitions({
  zoomIn: {
    from: {
      transform: [{ scale: 0.9 }]
    },
    to: {
      transform: [{ scale: 1.1 }]
    },
  },
  zoomOut: {
    from: {
      transform: [{ scale: 1.1 }]
    },
    to: {
      transform: [{ scale: 0.9 }]
    },
  }
});

const TrendingItem = ({ activeItem, Item, style }: { activeItem: string, Item: Post['Item'], style: string }) => {
  return (
    <Animatable.View
      className='mr-5 justify-center items-center relative'
      animation={activeItem === Item.id ? 'zoomIn' : 'zoomOut'}
      duration={500}
      useNativeDriver
    >   
      <ImageBackground
        source={typeof Item.thumbnail === 'string' ? { uri: Item.thumbnail } : Item.thumbnail}
        className={` rounded-[35px] my-5 overflow-hidden ${style}`}
        resizeMode='cover'
      />
    </Animatable.View>
  )
}

const PostsDisplayer = ({ post, type = 'background', ItemStyle }: { post: Post[], type?: 'background' | 'source', ItemStyle: string }) => {
  const [activeItem, setActiveItem] = useState(post[0]?.Item?.id || '')
  const context = useContext(PostContext)
  
  const onViewableItemsChanged = useRef(({ viewableItems }: { 
    viewableItems: Array<ViewToken> 
  }) => {
    if (viewableItems.length > 0 && viewableItems[0].item) {
      setActiveItem((viewableItems[0].item as Post).Item.id);
      if (type === 'background') {
        context.background[1]((viewableItems[0].item as Post).Item.name);
      } else {
        context.source[1]((viewableItems[0].item as Post).Item.name);
      }
    }
  }).current

  return (
    <FlatList
      data={post}
      keyExtractor={(item) => item.Item.id}
      renderItem={({ item }) => (
        <TrendingItem
          activeItem={activeItem}
          Item={item.Item}
          style={ItemStyle}
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
    
  )
}

export default PostsDisplayer
