import React, {useState, useEffect} from 'react';
import {useColorScheme, StyleSheet, View} from 'react-native';
import {Text, Divider} from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRecoilState, useRecoilValue} from 'recoil';

import {currentUserState} from '../atoms/users';
import {totalFoodMacro} from '../atoms/food';
import {backgroundThemeColor} from '../styles/globalStyles';

import {API_URL} from '../config';

const Dashboard = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const backgroundStyle = {
    backgroundColor: isDarkMode
      ? backgroundThemeColor.dark
      : backgroundThemeColor.light,
  };

  const [currentDate, setCurrentDate] = useState(null);
  const [data, setData] = useState({
    id: null,
    name: null,
    email: null,
    role: null,
    provider: null,
    created_at: null,
    updated_at: null,
  });

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
  const currentFoodMacro = useRecoilValue(totalFoodMacro);

  useEffect(() => {
    const dateFormat = new Date().toLocaleDateString();
    const dateDay = new Date();
    const dayOfWeek = weekdays[dateDay.getDay()]; // returns a string like "Monday"

    setCurrentDate(prevData => ({
      ...prevData,
      date: dateFormat,
      day: dayOfWeek,
    }));

    API = `${API_URL}/api/users/me`;
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.access_token}`,
      },
    };
    fetch(API, options)
      .then(res => {
        return res.json();
      })
      .then(responseData => {
        setData(previousData => ({
          ...previousData,
          id: responseData.data.user.id,
          name: responseData.data.user.name,
          email: responseData.data.user.email,
          role: responseData.data.user.role,
          provider: responseData.data.user.provider,
          created_at: responseData.data.user.created_at,
          updated_at: responseData.data.user.updated_at,
        }));
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    if (data.id !== null) {
      setCurrentUser(prevData => ({
        ...prevData,
        name: data.name,
        id: data.id,
        email: data.email,
        isLoggedIn: true,
      }));
    }
    const storeData = async () => {
      try {
        if (data.name !== null) {
          const name = JSON.stringify(data.name);
          await AsyncStorage.setItem('@name', name);
        }
      } catch (err) {
        console.log('Error in Login: ', err);
      }
    };
    storeData();
  }, [data]);

  return (
    <View style={[styles.body, backgroundStyle]}>
      <View style={styles.viewHeading}>
        <Text variant="headlineLarge">Dashboard</Text>
      </View>
      <View style={{padding: 10}}>
        <View style={{flexDirection: 'row'}}>
          {currentDate && (
            <Text variant="headlineSmall">{currentDate.day} - </Text>
          )}
          {currentDate && (
            <Text variant="headlineSmall">{currentDate.date}</Text>
          )}
        </View>
      </View>
      {currentFoodMacro && (
        <View style={{padding: 20}}>
          <View>
            <Text variant="titleLarge" style={{fontWeight: 'bold'}}>
              Nutrition
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text variant="titleLarge">Calories: </Text>
              <Text variant="titleMedium">
                {currentFoodMacro.Calories ? currentFoodMacro.Calories : 0}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text variant="titleLarge">Protein: </Text>
              <Text variant="titleMedium">
                {currentFoodMacro.Protein ? currentFoodMacro.Protein : 0}g
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text variant="titleLarge">Fat: </Text>
              <Text variant="titleMedium">
                {currentFoodMacro.Fat ? currentFoodMacro.Fat : 0}g
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text variant="titleLarge">Carbohydrate: </Text>
              <Text variant="titleMedium">
                {currentFoodMacro.Carbohydrate
                  ? currentFoodMacro.Carbohydrate
                  : 0}
                g
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: 10}}>
              <Text variant="titleLarge">Fiber: </Text>
              <Text variant="titleMedium">
                {currentFoodMacro.Fiber ? currentFoodMacro.Fiber : 0}g
              </Text>
            </View>
          </View>
        </View>
      )}
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  viewHeading: {
    alignItems: 'center',
    padding: 25,
  },
  textTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 2,
  },
});

export default Dashboard;
