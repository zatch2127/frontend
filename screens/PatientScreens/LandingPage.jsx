import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  View,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Animated,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import SideBarNavigation from "../../components/PatientScreenComponents/SideBarNavigation";
import { useChatbot } from "../../contexts/ChatbotContext";
import { useFocusEffect } from "@react-navigation/native";
import HeaderLoginSignUp from "../../components/PatientScreenComponents/HeaderLoginSignUp";
import Title from "../../components/PatientScreenComponents/Title";
import { TrackEvent } from "../../utils/TrackEvent";
import { useAuth } from "../../contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

const LandingPage = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const { setChatbotConfig, isChatExpanded } = useChatbot();
  const { user } = useAuth();

  // Animation State
  const borderAnim = useRef(new Animated.Value(0)).current;
  const [showLabel, setShowLabel] = useState(false);

  const isDesktop = Platform.OS === "web" && width > 1024;

  const handlePress = (eventName, params, navigateTo) => {
    TrackEvent(eventName, params);
    navigation.navigate("PatientAppNavigation", { screen: navigateTo });
  };

  useFocusEffect(
    useCallback(() => {
      setChatbotConfig({ height: "57%" });
      setShowLabel(true);
      borderAnim.setValue(0);

      const bounceAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(borderAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(borderAnim, {
            toValue: 0,
            duration: 0, // Reset instantly
            useNativeDriver: true,
          }),
        ])
      );

      setTimeout(() => bounceAnimation.start(), 1000);

      return () => bounceAnimation.stop();
    }, [borderAnim, setChatbotConfig])
  );

  // Web Payment Logic
  const [webPaymentHandled, setWebPaymentHandled] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get("paymentSuccess");
    const id = params.get("doctorId");

    if (success === "true" && id && !webPaymentHandled) {
      setWebPaymentHandled(true);
      navigation.navigate("LandingPage", { paymentSuccess: true, doctorId: id });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [navigation, webPaymentHandled]);

  // Payment Alert Logic
  const { paymentSuccess, doctorId } = route?.params || {};
  const alertShownRef = useRef(false);

  useEffect(() => {
    if (paymentSuccess && !alertShownRef.current) {
      alertShownRef.current = true;
      const msg = "You have successfully subscribed to doctor. Now book your slot.";

      if (Platform.OS === "web") {
        alert(msg);
        navigation.navigate("PatientAppNavigation", {
          screen: "DoctorResultShow",
          params: { highlightDoctorId: doctorId },
        });
      } else {
        Alert.alert("Subscription Successful", msg, [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("PatientAppNavigation", {
                screen: "DoctorResultShow",
                params: { highlightDoctorId: doctorId },
              }),
          },
        ]);
      }
    }
  }, [doctorId, navigation, paymentSuccess]);

  // ---------------- RENDER HELPERS ----------------

  const renderCard = (imageSource, onPress, label = null) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className={`
        relative items-center justify-center 
        w-[45%] aspect-square 
        md:w-[22%] md:h-[300px] md:aspect-auto
        bg-white/20 rounded-2xl border border-white/30 shadow-sm overflow-hidden
        hover:scale-105 transition-transform duration-200
      `}
    >
      <Image
        source={imageSource}
        className="w-full h-full"
        resizeMode="contain"
      />
      {label && (
        <View className="absolute bottom-4 bg-black/50 px-3 py-1 rounded-full">
          <Text className="text-white font-bold text-xs md:text-sm">{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderAICard = () => (
    <View className="items-center justify-center w-[45%] md:w-[22%] aspect-square md:aspect-auto md:h-[300px]">
      <Animated.View
        style={{
          transform: [
            {
              translateY: borderAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, -15, 0],
              }),
            },
          ],
        }}
        className="w-full h-full rounded-2xl border-4 border-green-400 overflow-hidden bg-transparent shadow-lg"
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PatientAppNavigation", {
              screen: "MobileChatbot",
            })
          }
          activeOpacity={0.9}
          className="w-full h-full"
        >
          <ImageBackground
            source={require("../../assets/Images/AI_Support.png")}
            className="w-full h-full justify-end"
            resizeMode="cover"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* "Try Me" Label */}
      {showLabel && (
        <Animated.View
          style={{
            opacity: borderAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.6, 1, 0.6],
            }),
          }}
          className="absolute -bottom-12 w-full items-center"
        >
          <ImageBackground
            source={require("../../assets/Images/Union.png")}
            className="w-32 h-10 justify-center items-center"
            resizeMode="stretch"
          >
            <Text className="text-white font-bold text-xs mt-1">Try Me for Free</Text>
          </ImageBackground>
        </Animated.View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ImageBackground
        source={require("../../assets/Images/main_background.jpg")}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        {/* Dark Overlay for better text readability */}
        <View className="absolute inset-0 bg-black/40" />

        <SafeAreaView className="flex-1 flex-row">
          {/* Sidebar (Desktop Only) */}
          {isDesktop && (
            <View className="w-[80px] lg:w-[15%] h-full bg-white/90 border-r border-gray-200 hidden md:flex">
              <SideBarNavigation navigation={navigation} />
            </View>
          )}

          {/* Main Content */}
          <View className="flex-1 flex-col">
            {/* Header */}
            <View className="z-20 w-full">
              <HeaderLoginSignUp navigation={navigation} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              className="w-full"
            >
              {/* Title Section */}
              <View className="mt-8 mb-8 w-full items-center">
                <Title />
              </View>

              {/* Cards Grid */}
              {!isChatExpanded && (
                <View className="w-full max-w-6xl px-4 flex-row flex-wrap justify-center gap-4 md:gap-8">

                  {/* Consultation Card */}
                  {renderCard(
                    require("../../assets/Images/Consultation.png"),
                    () => handlePress(
                      "consultation_card_click",
                      { clickText: "Consultation", clickID: "consultation-card" },
                      "Doctors"
                    ),
                    // "Consultation"
                  )}

                  {/* Medilocker Card */}
                  {renderCard(
                    require("../../assets/Images/Medilocker.png"),
                    () => navigation.navigate("PatientAppNavigation", { screen: "Medilocker" }),
                    //  "Medilocker"
                  )}

                  {/* AI Chatbot Card (Animated) */}
                  {renderAICard()}

                  {/* Dashboard Card */}
                  {renderCard(
                    require("../../assets/Images/DashboardCard.png"),
                    () => navigation.navigate("PatientAppNavigation", { screen: "UserDashboard" }),
                    //  "Dashboard"
                  )}

                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default LandingPage;
