// layout.js (Main Layout combining both)

import ServerLayout from './ServerLayout';
import RootLayout from './RootLayout';

export default function CombinedLayout({ children }) {
  return (
    <ServerLayout>
      <RootLayout>{children}</RootLayout>
    </ServerLayout>
  );
}
