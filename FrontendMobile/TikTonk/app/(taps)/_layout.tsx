import { Stack } from "expo-router";
import "../../globals.css"
import {Tabs, router} from "expo-router";
import { View, Image, Text } from "react-native";

interface TabsIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}
const TabsIcon= ({icon, color, name, focused}: TabsIconProps) =>{
  return(
    <View className="items-center justify-center gap-2">
        <Image 
          source={icon}
          resizeMode='contain'
          tintColor={color}
          className="w-9 h-9"
        />
        <Text className={`${focused ? 'font-semibold' : 'font-pregular'} text-xs `} style={{color : color , display: focused ? 'flex' : 'none'}}>
        {name}</Text>
    </View>
  )
}

const Tabs_Layout = () => {
    return (
      <Tabs screenOptions={{
        tabBarShowLabel:false,
        tabBarActiveTintColor:'#2C9814',
        tabBarInactiveTintColor:'#000000',
        tabBarStyle:{
          backgroundColor:'#FFFFFF',
          borderTopWidth: 0,
          borderTopColor:'#232533',
        }
      }}>
        <Tabs.Screen name='Setting'
        options={{
          title:'Settings',
          headerShown: false,
          tabBarIcon:({color, focused}) =>(
            <TabsIcon
                icon={require('../../assets/images/icons/SettingIcon.png')}
                color={color}
                name="Settings"
                focused={focused}
            />
          )
        }}
        />
        
  
        <Tabs.Screen name='Home'
        options={{
          title:'Home',
          headerShown: false,
          tabBarIcon:({color, focused}) =>(
            <TabsIcon
                icon={require('../../assets/images/icons/AddIcon.png')}
                color={color}
                name="Home"
                focused={focused}
            />
          )
        }}
        />

        

        <Tabs.Screen name='profile'
        options={{
          title:'Profile',
          headerShown: false,
          tabBarIcon:({color, focused}) =>(
            <TabsIcon
                icon={require('../../assets/images/icons/AccountIcon.png')}
                color={color}
                name="Profile"
                focused={focused}
            />
          )
        }}
        />
      </Tabs>
    );
}
export default Tabs_Layout;