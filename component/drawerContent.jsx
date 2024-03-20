import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import { MenuScreen, SignUpScreen, LoginScreen, EditMenuScreen, RestaurantsScreen, RestaurantDetailsScreen, LaundryScreen, LaundryDetailsScreen, FTPScreen, ServicesScreen, ServicesDetailsScreen, UserScreen, BusScreen, AboutMeScreen } from '../screens'

// Import your app logo
import logo from '../assets/icon.png';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
        {/* App Logo and Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 40, height: 40, marginRight: 10 }} />
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>CampusXperience</Text>
        </View>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          drawerIcon: ({ focused, color, size }) => {
            let iconName;

            // Set icons based on the screen route
            if (route.name === 'Menu') {
              iconName = 'menuunfold';
            } else if (route.name === 'Bus') {
              iconName = 'car';
            } else if (route.name === 'User') {
              iconName = 'user';
            } else if (route.name === 'About Me') {
              iconName = 'infocirlce';
            } // Add other screens here

            // Return the appropriate icon component
            return <AntDesign name={iconName} size={size} color={color} />;
          },
        })}
        drawerContentOptions={{
          activeTintColor: '#FF6347',
          inactiveTintColor: 'black',
        }}
      >
        <Drawer.Screen name="Menu" component={MenuScreen} />
        <Drawer.Screen name="Bus" component={BusScreen} />
        <Drawer.Screen name="User" component={UserScreen} />
        <Drawer.Screen name="About Me" component={AboutMeScreen} />
        <Drawer.Screen name="Laundry" component={LaundryScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Restaurants" component={RestaurantsScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="LaundryDetails" component={LaundryDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="FTP" component={FTPScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="EditMenu" component={EditMenuScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="Services" component={ServicesScreen} options={{ drawerItemStyle: { height: 0 } }} />
        <Drawer.Screen name="ServicesDetails" component={ServicesDetailsScreen} options={{ drawerItemStyle: { height: 0 } }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;
