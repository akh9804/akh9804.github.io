import type {Metadata} from 'next';
import {Audiowide, Noto_Sans_KR} from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import styles from './layout.module.css';
import './prism.css';

const audiowide = Audiowide({weight: '400', subsets: ['latin']});
const notoSansKR = Noto_Sans_KR({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'ahntree.log',
  description: 'ahntree blog',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ko">
      <body className={notoSansKR.className}>
        <header className={styles.header}>
          <div className={`${styles.inner_header} ${audiowide.className}`}>
            <Link href="/">
              <h1 className={styles.header_title}>ahntree.log</h1>
            </Link>
          </div>
        </header>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}
