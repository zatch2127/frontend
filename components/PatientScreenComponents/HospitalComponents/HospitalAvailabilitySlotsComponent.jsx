
import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  useWindowDimensions,
  FlatList,
  ScrollView,
} from "react-native";

const HospitalAvailabilitySlotsComponent = ({ navigation, route, hospitals }) => {
  const { width } = useWindowDimensions();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();

  useEffect(() => {
    if (hospitals.availability) {
      setSelectedDay(today); // Always set today as default, even if no slots
    }
  }, [hospitals.availability]);

  const selectedSlots =
    selectedDay && hospitals.availability[selectedDay]?.slots
      ? hospitals.availability[selectedDay].slots
      : { morning: [], afternoon: [], evening: [] };

  const chunkSize = 3;

  const availabilityArray = hospitals?.availability
    ? Object.keys(hospitals.availability).map((day) => ({
        day,
        slotsAvailable: hospitals.availability[day]?.slotsAvailable || 0,
        slots: hospitals.availability[day]?.slots || [0],
      }))
    : [];

  const chunkedAvailability = [];
  for (let i = 0; i < availabilityArray.length; i += chunkSize) {
    chunkedAvailability.push(availabilityArray.slice(i, i + chunkSize));
  }

  const [visibleChunks, setVisibleChunks] = useState(1); // Show first 3 days initially

  // Function to load more days when scrolling
  const loadMoreDays = () => {
    if (visibleChunks < chunkedAvailability.length) {
      setVisibleChunks(visibleChunks + 1);
    }
  };
  const handleSlotSelection = (slot) => {
    setSelectedSlot((prevSlot) => (prevSlot === slot ? null : slot));
  };

  const findNextAvailableDay = () => {
    const days = Object.keys(hospitals.availability);
    const currentIndex = days.indexOf(selectedDay);

    for (let i = currentIndex + 1; i < days.length; i++) {
      if (hospitals.availability[days[i]].slotsAvailable > 0) {
        setSelectedDay(days[i]);
        return;
      }
    }
  };

  return (
    <>
      <View style={styles.availabilityBox}>
        <View style={styles.daysContainer}>
          <FlatList
            //   data={availabilityList}
            data={chunkedAvailability.slice(0, visibleChunks).flat()}
            horizontal
            keyExtractor={(item) => item.day}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dayColumn,
                  selectedDay === item.day && styles.selectedDay,
                ]}
                onPress={() => setSelectedDay(item.day)}
              >
                <Text style={styles.dayTitle}>
                  {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                </Text>
                <Text style={styles.slotsAvailable}>
                  {item.slotsAvailable > 0
                    ? `${item.slotsAvailable} slots Available`
                    : "No slot today"}
                </Text>
              </TouchableOpacity>
            )}
            onEndReached={loadMoreDays}
            onEndReachedThreshold={0.5}
          />
        </View>
        {/* <View style={{ flex: 1 }}> */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {selectedDay && (
            <View style={styles.timeSlotContainer}>
              {/* Check if all slots are empty */}
              {selectedSlots.morning.length === 0 &&
              selectedSlots.afternoon.length === 0 &&
              selectedSlots.evening.length === 0 ? (
                <View style={styles.noSlotsContainer}>
                  <Text style={styles.noSlots}>No slots for Today</Text>
                  <TouchableOpacity
                    style={styles.nextAvailableButton}
                    onPress={findNextAvailableDay}
                  >
                    <Text style={styles.nextAvailableText}>
                      Next Availability on Tomorrow
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {/* Morning Slots */}
                  <Text style={styles.slotCategory}>Morning</Text>
                  <View style={styles.slotGrid}>
                    {selectedSlots.morning.length > 0 ? (
                      selectedSlots.morning.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.slotButton,
                            selectedSlot === slot && styles.selectedSlot, // Apply selected style
                          ]}
                          onPress={() => handleSlotSelection(slot)}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              selectedSlot === slot && styles.selectedSlotText, // Change text color
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noSlots}>
                        No morning slots available
                      </Text>
                    )}
                  </View>

                  {/* Afternoon Slots */}
                  <Text style={styles.slotCategory}>Afternoon</Text>
                  <View style={styles.slotGrid}>
                    {selectedSlots.afternoon.length > 0 ? (
                      selectedSlots.afternoon.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.slotButton,
                            selectedSlot === slot && styles.selectedSlot, // Apply selected style
                          ]}
                          onPress={() => handleSlotSelection(slot)}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              selectedSlot === slot && styles.selectedSlotText, // Change text color
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noSlots}>
                        No afternoon slots available
                      </Text>
                    )}
                  </View>
                  <Text style={styles.slotCategory}>Evening</Text>
                  <View style={styles.slotGrid}>
                    {selectedSlots.evening.length > 0 ? (
                      selectedSlots.evening.map((slot, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.slotButton,
                            selectedSlot === slot && styles.selectedSlot, // Apply selected style
                          ]}
                          onPress={() => handleSlotSelection(slot)}
                        >
                          <Text
                            style={[
                              styles.slotText,
                              selectedSlot === slot && styles.selectedSlotText, // Change text color
                            ]}
                          >
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text style={styles.noSlots}>
                        No evening slots available
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          )}
        </ScrollView>
        {/* </View> */}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  //   availabilityBox: {
  //     flexDirection: "column",
  //     //borderWidth: 1,
  //     justifyContent: "space-around",
  //     height:"100%",
  //   },
  daysContainer: {
    // borderWidth: 1,
    backgroundColor: "rgb(233, 233, 233)",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    minHeight: 65,
    paddingTop: "0%",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "nowrap",
    paddingLeft: 5,
  },
  dayColumn: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(155, 154, 154, 1)",
    //minHeight:70,
    paddingHorizontal: "0%",
    width: 108,
    backgroundColor: "#fff",
  },
  selectedDay: {
    backgroundColor: " rgb(254, 248, 248)",
    borderWidth: 1,
    borderColor: "rgba(255, 112, 114, 1)",
  },

  dayTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  slotsAvailable: {
    color: "green",
    fontSize: 12,
  },
  timeSlotContainer: {
    //marginTop: "5%",
    minHeight: 100,
    flexGrow: 1,
    flexDirection: "column",
    //borderWidth: 1,
    width: "100%",
    alignItems: "flex-start",
    padding: "2%",
  },
  noSlotsContainer: {
    alignSelf: "center",
    //borderWidth:1,
    marginVertical: "18%",
    height: "70%",
    ...Platform.select({
      web: {
        // borderWidth:1,
        width: "70%",
      },
    }),
  },
  noSlots: {
    color: "gray",
    fontSize: 15,
    alignSelf: "center",
  },
  nextAvailableButton: {
    //borderWidth:1,
    paddingHorizontal: "2%",
    marginTop: "26%",
    borderRadius: 8,
    backgroundColor: "rgb(243, 119, 119)",
    height: "20%",
    paddingTop: "3%",
    ...Platform.select({
      web: {
        height: "27%",
      },
    }),
  },
  nextAvailableText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    textAlign: "center",
  },
  slotCategory: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: "2%",
    color: "#000000",
    marginTop: "2%",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginVertical: "1%",
    ...Platform.select({
      web: {
        width: "100%",
      },
    }),
  },
  selectedSlot: {
    backgroundColor: "#007BFF", // Highlighted color when selected
  },
  selectedSlotText: {
    color: "#FFFFFF", // Text color when selected
  },
  slotText: {
    fontSize: 13,
    fontWeight: 400,
    color: "rgba(22, 128, 236, 0.75)",
  },
  slotButton: {
    //backgroundColor: "#E0EBFF",
    paddingVertical: "3%",
    paddingHorizontal: "4%",
    borderRadius: 5,
    alignSelf: "flex-start",
    // marginTop: "2%",
    borderColor: "rgba(22, 128, 236, 0.75)",
    borderWidth: 1,
    width: "26%",
  },
});
export default HospitalAvailabilitySlotsComponent;
