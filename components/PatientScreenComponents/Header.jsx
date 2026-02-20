import React, { useContext, useState } from "react";
import {
  Pressable,
  View,
  Text,
  Image,
  Platform,
  useWindowDimensions,
  Modal,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { AuthContext } from "../../contexts/AuthContext";
import { useLoginModal } from "../../contexts/LoginModalContext";
import { MaterialIcons } from "@expo/vector-icons";
import SideBarNavigation from "./SideBarNavigation";
import NewestSidebar from "../DoctorsPortalComponents/NewestSidebar";

const Header = ({ navigation, isDoctorPortal = false }) => {
  const { user, logout } = useContext(AuthContext);
  const { triggerLoginModal } = useLoginModal();
  const { width } = useWindowDimensions();
  const [isSideBarVisible, setIsSideBarVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Helper to determine if we are on a "Desktop" width (Web + Wide)
  const isDesktop = Platform.OS === "web" && width > 1000;

  const handleOptionPress = () => {
    setDropdownVisible(false);
    navigation.navigate("DoctorPatientLandingPage");
  };

  return (
    <SafeAreaView className="bg-white z-50 w-full shadow-sm">
      {/* ----------------- DESKTOP HEADER (Web > 1000px) ----------------- */}
      {isDesktop && user && (
        <View className="flex-row items-center justify-between px-8 py-4 w-full bg-white shadow-sm z-50">
          {/* Left: Welcome Text */}
          <View className="flex-col justify-center">
            <Text className="text-2xl font-bold text-gray-800">
              Welcome {user?.name || "User"}!
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Here is your sales Medical dashboard
            </Text>
          </View>

          {/* Center: Search Bar */}
          <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2 w-1/3 border border-gray-200">
            <Image
              source={require("../../assets/Icons/search.png")}
              className="w-4 h-4 mr-2 opacity-50"
              resizeMode="contain"
            />
            <TextInput
              className="flex-1 text-base text-gray-800 outline-none"
              placeholder="Search your query"
              placeholderTextColor="#9ca3af"
              style={{ outlineStyle: "none" }} // Web only
            />
          </View>

          {/* Right: Icons & Profile */}
          <View className="flex-row items-center gap-6">
            <Pressable>
              <Image
                source={require("../../assets/Icons/notification1.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </Pressable>

            {/* Profile Dropdown */}
            <View className="relative z-50">
              <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
                <Image
                  source={
                    user?.picture
                      ? { uri: user.picture }
                      : require("../../assets/Images/user-icon.jpg")
                  }
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
              </Pressable>
              {dropdownVisible && (
                <View className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg w-40 py-2 z-50">
                  <TouchableOpacity
                    onPress={() => {
                      setDropdownVisible(false);
                      navigation.navigate("PatientAppNavigation", {
                        screen: "Settings",
                      });
                    }}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <Text className="text-gray-700">Profile</Text>
                  </TouchableOpacity>
                  <Pressable
                    onPress={() => {
                        setDropdownVisible(false);
                         logout();
                    }}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <Text className="text-gray-700">Logout</Text>
                  </Pressable>
                  <Pressable
                     onPress={() => {
                        setDropdownVisible(false);
                         logout();
                    }}
                    className="px-4 py-2 hover:bg-gray-50"
                  >
                    <Text className="text-red-500">Delete Account</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {isDesktop && !user && (
         <View className="w-full h-20 flex-row items-center justify-end px-12 gap-8 bg-white">
            <Pressable
                onPress={() => navigation.navigate("DoctorsSignUp")}
                className="border border-rose-400 rounded-md px-6 py-2 bg-white hover:bg-rose-50 transition-colors"
            >
                <Text className="text-rose-500 font-bold text-lg">Are you a doctor ?</Text>
            </Pressable>

            <Pressable
                onPress={() => triggerLoginModal({ mode: "login" })}
                className="bg-primary px-6 py-2 rounded-md hover:opacity-80 transition-opacity"
            >
                <Text className="text-black font-bold text-lg hover:text-rose-500">Login</Text>
            </Pressable>

             <Pressable
                onPress={() => navigation.navigate("DoctorPatientLandingPage")}
                className="bg-primary px-6 py-2 rounded-md hover:opacity-80 transition-opacity"
            >
                <Text className="text-black font-bold text-lg hover:text-rose-500">Signup</Text>
            </Pressable>
         </View>
      )}

      {/* ----------------- MOBILE / TABLET HEADER (< 1000px) ----------------- */}
      {!isDesktop && (
        <View className="w-full flex-row items-center justify-between px-4 h-16 bg-white shadow-sm z-30">
          {/* Logo & Hamburger */}
          <View className="flex-row items-center gap-2">
            <Pressable onPress={() => setIsSideBarVisible(true)} className="p-1">
              <MaterialIcons name="menu" size={30} color="black" />
            </Pressable>
            <Image
              source={require("../../assets/Images/KokoroLogo.png")}
              className="w-8 h-8"
              resizeMode="contain"
            />
            <Text className="text-lg font-bold text-black ml-1">
              Kokoro.Doctor
            </Text>
          </View>

          {/* Right Side Actions */}
          <View className="flex-row items-center gap-4">
            {user ? (
              // Logged In Mobile
              <>
                 <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
                  <Image
                    source={
                      user?.picture
                        ? { uri: user.picture }
                        : require("../../assets/Images/user-icon.jpg")
                    }
                    className="w-9 h-9 rounded-full border border-gray-200"
                  />
                </Pressable>
                {/* <Pressable>
                  <MaterialIcons name="notifications-none" size={28} color="black" />
                </Pressable> */}
              </>
            ) : (
                // Logged Out Mobile
               <Pressable onPress={() => setDropdownVisible(!dropdownVisible)}>
                  <MaterialIcons name="person" size={30} color="black" />
               </Pressable>
            )}

             {/* Mobile Dropdown */}
             {dropdownVisible && (
                  <View className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg w-48 py-2 z-50">
                    {user ? (
                        <>
                         <Pressable
                            onPress={() => {
                                setDropdownVisible(false);
                                navigation.navigate("PatientAppNavigation", { screen: "Settings" });
                            }}
                            className="px-4 py-3 border-b border-gray-100"
                          >
                             <Text className="text-base text-gray-800">Profile</Text>
                          </Pressable>
                          <Pressable
                             onPress={() => {
                                setDropdownVisible(false);
                                logout();
                             }}
                             className="px-4 py-3"
                          >
                              <Text className="text-base text-red-500">Logout</Text>
                          </Pressable>
                        </>
                    ) : (
                        <>
                             <Pressable
                                onPress={() => {
                                    setDropdownVisible(false);
                                    navigation.navigate("DoctorsSignUp");
                                }}
                                className="px-4 py-3 border-b border-gray-100"
                            >
                                <Text className="text-sm font-bold text-rose-500">Are you a doctor?</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setDropdownVisible(false);
                                    triggerLoginModal({ mode: "login" });
                                }}
                                className="px-4 py-3 border-b border-gray-100"
                            >
                                <Text className="text-base text-gray-800">Login</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    setDropdownVisible(false);
                                    handleOptionPress();
                                }}
                                className="px-4 py-3"
                            >
                                <Text className="text-base text-gray-800">Signup</Text>
                            </Pressable>
                        </>
                    )}
                  </View>
             )}
          </View>
        </View>
      )}
      
      {/* Mobile Sidebar Modal */}
      <Modal
        visible={isSideBarVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSideBarVisible(false)}
      >
        <View className="flex-1 flex-row">
            {/* Sidebar Content */}
          <View className="w-[75%] h-full bg-white shadow-xl z-50">
            {isDoctorPortal ? (
              <NewestSidebar
                navigation={navigation}
                closeSidebar={() => setIsSideBarVisible(false)}
              />
            ) : (
              <SideBarNavigation
                navigation={navigation}
                closeSidebar={() => setIsSideBarVisible(false)}
              />
            )}
          </View>

          {/* Overlay to close */}
          <Pressable
            className="flex-1 bg-black/50"
            onPress={() => setIsSideBarVisible(false)}
          />
        </View>
      </Modal>

      {/* Mobile Greeting (Below Header) */}
      {!isDesktop && user && !isDoctorPortal && (
        <View className="flex-row px-6 pb-2 items-end bg-white">
             <Text className="text-lg font-semibold text-gray-800">Hello, </Text>
             <Text className="text-lg font-extrabold text-black">{user?.name || "User"}!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Header;
