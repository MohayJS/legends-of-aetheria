import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainMenuScreen from '../screens/MainMenuScreen';
import GachaScreen from '../screens/GachaScreen';
import InventoryScreen from '../screens/InventoryScreen';
import TeamScreen from '../screens/TeamScreen';
import AdminScreen from '../screens/AdminScreen';
import ManageItemsScreen from '../screens/ManageItemsScreen';
import ManageBannersScreen from '../screens/ManageBannersScreen';
import ManageBannerItemsScreen from '../screens/ManageBannerItemsScreen';
import ListItemsScreen from '../screens/ListItemsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ShopScreen from '../screens/ShopScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="Gacha" component={GachaScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="Team" component={TeamScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="ManageItems" component={ManageItemsScreen} />
        <Stack.Screen name="ManageBanners" component={ManageBannersScreen} />
        <Stack.Screen name="ManageBannerItems" component={ManageBannerItemsScreen} />
        <Stack.Screen name="ListItems" component={ListItemsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
