import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// import { Container } from './styles';

export default function User({ navigation }) {
  console.tron.log(navigation.getParam('user'));

  return <View />;
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
