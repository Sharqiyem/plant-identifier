import * as React from 'react';
import { render } from '@testing-library/react-native';
import { InfoSection } from '@/components/home/InfoSection';

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
