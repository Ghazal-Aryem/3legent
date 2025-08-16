import { Providers } from '../store/provider.js';
import './globals.css';

export const metadata = {
  title: '3 legents',
  description: 'Your app description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}