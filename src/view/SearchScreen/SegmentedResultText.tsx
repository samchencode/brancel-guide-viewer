import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { StringSegment } from '@/domain/models/Article';

type Props = {
  segments: StringSegment[];
};

function SegmentedResultText({ segments }: Props) {
  const elements = segments.map((s, i) =>
    s.includesMatch ? (
      // eslint-disable-next-line react/no-array-index-key
      <Text style={styles.match} key={i}>
        {s.text}
      </Text>
    ) : (
      // eslint-disable-next-line react/no-array-index-key
      <Text key={i}>{s.text}</Text>
    )
  );

  return <Text>{elements}</Text>;
}

const styles = StyleSheet.create({
  match: {
    fontWeight: 'bold',
  },
});

export { SegmentedResultText };
