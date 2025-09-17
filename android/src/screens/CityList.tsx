import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList } from "react-native";
import SQLite, { SQLiteDatabase } from "react-native-sqlite-storage";

export default function CityList() {
  const [cities, setCities] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadDB = async () => {
      try {
        const db: SQLiteDatabase = await SQLite.openDatabase({
          name: "cities.db",
          createFromLocation: 1,
        });

        console.log("✅ Database opened");

        const results = await db.executeSql("SELECT * FROM cities LIMIT 20;");
        const rows = results[0].rows;
        let temp: any[] = [];
        for (let i = 0; i < rows.length; i++) {
          temp.push(rows.item(i));
        }
        setCities(temp);
      } catch (error) {
        console.error("❌ DB Error", error);
      }
    };

    loadDB();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Search City"
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <FlatList
        data={cities.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} ({item.country})</Text>
        )}
      />
    </View>
  );
}
