import { InfoSection } from '@/components/home/InfoSection';
import { render } from '@testing-library/react-native';
import * as React from 'react';

describe('InfoSection', () => {
  it(`renders correctly`, () => {
    const tree = render(<InfoSection />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it(`renders match with snapshot`, () => {
    const { getByText } = render(<InfoSection />);
    expect(getByText('How to Use')).toBeDefined();
  });
});
