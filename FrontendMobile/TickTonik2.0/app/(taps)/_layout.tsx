import { Stack } from "expo-router";
import "../../globals.css"
import {Tabs, router} from "expo-router";
import { View, Image, Text, Animated, Platform } from "react-native";
import { useEffect, useRef } from "react";

interface TabsIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabsIcon = ({icon, color, name, focused}: TabsIconProps) => {
  // Animation references for smooth transitions
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  
  useEffect(() => {
    // Animate the icon when focus changes
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1.2 : 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  }, [focused]);
  
  return (
    <View className="items-center justify-center">
      {/* The indicator dot that appears when tab is selected */}
      {focused && (
        <Animated.View 
          style={{
            opacity: opacityAnim,
            transform: [{scale: scaleAnim}]
          }}
          className="absolute top-0 w-1.5 h-1.5 rounded-full bg-green-500 mb-1"
        />
      )}
      
      {/* Icon with scaling animation */}
      <Animated.View 
        style={{
          transform: [{scale: scaleAnim}]
        }}
        className="items-center justify-center p-2"
      >
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className="w-7 h-7"
        />
      </Animated.View>
      
      {/* Text label that fades in when selected */}
      <Animated.Text 
        className={`${focused ? 'font-semibold' : 'font-light'} text-xs mt-1`}
        style={{
          color: color,
          opacity: opacityAnim,
          transform: [{
            translateY: opacityAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [5, 0]
            })
          }]
        }}
      >
        {name || ""}
      </Animated.Text>
    </View>
  );
}

const Tabs_Layout = () => {
    // Define some animation references for smoother screen transitions
    const slideAnim = useRef(new Animated.Value(0)).current;
    
    return (
      <Tabs
        screenOptions={{
          // Animation configuration for tab transitions
          animation: "fade", // Use fade transitions for smoother experience
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#2C9814', // Keep the green active color
          tabBarInactiveTintColor: '#7F8082', // Use a softer color for inactive
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            // Add a subtle shadow for a floating effect
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 5,
            // Improved sizing and spacing
            height: 50,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 5,
            // Add a subtle border radius for a modern look on iOS
            borderTopLeftRadius: Platform.OS === 'ios' ? 20 : 0,
            borderTopRightRadius: Platform.OS === 'ios' ? 20 : 0,
            // Position the tab bar with some margin on iOS
            marginHorizontal: Platform.OS === 'ios' ? 10 : 0,
            // Add bottom margin for iOS to lift it from the bottom edge
            marginBottom: Platform.OS === 'ios' ? 5 : 0,
          },
        }}
      >
        <Tabs.Screen 
          name='Setting'
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabsIcon
                icon={require('../../assets/images/icons/SettingIcon.png')}
                color={color}
                name=""
                focused={focused}
              />
            )
          }}
        />
        
        <Tabs.Screen 
          name='Home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabsIcon
                icon={require('../../assets/images/icons/AddIcon.png')}
                color={color}
                name=""
                focused={focused}
              />
            )
          }}
        />
        
        <Tabs.Screen 
          name='profile'
          options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <TabsIcon
                icon={require('../../assets/images/icons/AccountIcon.png')}
                color={color}
                name=""
                focused={focused}
              />
            )
          }}
        />
      </Tabs>
    );
}
export default Tabs_Layout;