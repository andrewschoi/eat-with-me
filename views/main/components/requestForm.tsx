import React, { useContext, useState, useEffect } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import userContext from "../../../contexts/userContext";
import { Picker } from "@react-native-picker/picker";
import { Pressable, Text, View } from "react-native";
import * as BE from "../../../firebase/common";

type RequestFormProps = {
  navigation: StackNavigationProp<any>;
};

const RequestForm = (navigation: RequestFormProps) => {
  const UserContext = useContext(userContext);
  const [locationsInRad, setLocationsInRad] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  useEffect(() => {
    if (UserContext?.locations) setLocationsInRad(UserContext.locations);
  }, [UserContext?.locations]);

  const handleRequestAdd = async () => {
    if (
      UserContext !== null &&
      UserContext.user !== null &&
      selectedLocation !== ""
    ) {
      const name = UserContext.user.name;
      const success = await BE.addRequest(name, selectedLocation);
    }
  };

  return (
    <View>
      <Picker
        selectedValue={selectedLocation}
        onValueChange={(itemValue) => setSelectedLocation(itemValue)}
      >
        {locationsInRad.length > 0
          ? locationsInRad.map((loc) => (
              <Picker.Item key={loc} value={loc} label={loc} />
            ))
          : null}
      </Picker>
      <Pressable onPress={handleRequestAdd}>
        <Text>Broadcast Request</Text>
      </Pressable>
    </View>
  );
};

export default RequestForm;
