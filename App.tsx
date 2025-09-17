import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";

// Example: small subset of global cities for demo
const allCities = [
  "Kozhikode", "Delhi", "Mumbai", "New York", "London", "Dubai",
  "Cairo", "Makkah", "Medina", "Karachi", "Istanbul"
];

export default function App() {
  const [prayerTimes, setPrayerTimes] = useState<Record<string,string> | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredCities, setFilteredCities] = useState(allCities);
  const [selectedCity, setSelectedCity] = useState("Kozhikode");

  useEffect(() => {
    fetchPrayerTimes(selectedCity);
  }, [selectedCity]);

  useEffect(() => {
    const filtered = allCities.filter(city =>
      city.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCities(filtered);
  }, [searchText]);

  const fetchPrayerTimes = async (city: string) => {
    try {
      setLoading(true);
      const response = await axios.get("https://api.aladhan.com/v1/timingsByCity", {
        params: {
          city,
          country: "India", // You can make dynamic later
          method: 2, // MWL
        }
      });
      setPrayerTimes(response.data.data.timings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setLoading(false);
    }
  };

  const formatTime12 = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr,10);
    const ampm = hour >= 12 ? "PM":"AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Times</Text>

      <TextInput
        placeholder="Search city..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => setSelectedCity(item)} style={styles.cityItem}>
            <Text style={styles.cityText}>{item}</Text>
          </TouchableOpacity>
        )}
        style={{maxHeight:150, marginBottom:20}}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        prayerTimes &&
        Object.entries(prayerTimes).map(([name,time]) => (
          <Text key={name} style={styles.text}>{name}: {formatTime12(time)}</Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, justifyContent:"center", alignItems:"center", padding:20 },
  header:{ fontSize:20, fontWeight:"bold", marginBottom:10 },
  input:{ width:"80%", borderWidth:1, borderColor:"#ccc", padding:8, marginBottom:10, borderRadius:5 },
  cityItem:{ padding:10, backgroundColor:"#eee", marginVertical:2, borderRadius:5, width:"80%" },
  cityText:{ fontSize:16 },
  text:{ fontSize:16, marginVertical:5 },
});
