import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchUserStarred() {
    const user = navigation.getParam('user');

    setLoading(true);

    const response = await api.get(`/users/${user.login}/starred`);

    setStars(response.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchUserStarred();
  }, []);

  async function load(pageIndex = 1) {
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page: pageIndex },
    });

    setStars(pageIndex >= 2 ? [...stars, ...response.data] : response.data);
    setPage(pageIndex);
    setLoading(false);
    setRefreshing(false);
  }

  async function loadMore() {
    const nextPage = page + 1;

    load(nextPage);
  }

  async function refreshList() {
    setRefreshing(true);
    setStars([]);
    load();
  }

  async function handleNavigate(repository) {
    navigation.navigate('Repository', { repository });
  }

  const user = navigation.getParam('user');

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      {loading ? (
        <ActivityIndicator size="large" color="#7159c1" />
      ) : (
        <Stars
          data={stars}
          onRefresh={refreshList}
          refreshing={refreshing}
          onEndReachedThreshold={0.2}
          onEndReached={loadMore}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred onPress={() => handleNavigate(item)}>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};
