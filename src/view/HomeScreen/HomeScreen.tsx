import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { Article } from '@/domain/models/Article';
import type { GetAllArticlesAction } from '@/application/GetAllArticlesAction';

function factory(getAllArticlesAction: GetAllArticlesAction) {
  return function HomeScreen() {
    const [articles, setArticles] = useState<Article[]>([]);
    useEffect(() => {
      getAllArticlesAction.execute().then((a) => setArticles(a));
    }, []);

    return (
      <View>
        <Text>{articles.map((a) => a.title).join('\n')}</Text>
      </View>
    );
  };
}

export { factory };
export type Type = ReturnType<typeof factory>;
