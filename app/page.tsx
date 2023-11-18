import Date from '@/components/date';
import {getSortedPostsData} from '@/utils';
import Link from 'next/link';
import styles from './home.module.css';

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <ul className={styles.post_list}>
      {allPostsData.map(({id, title, date, slug}) => (
        <li key={id} className={styles.post_item}>
          <header className={styles.post_item_header}>
            <Link href={`/posts/${id}`}>
              <h1 className={styles.post_item_title}>{title}</h1>
            </Link>
            <Date className={styles.post_item_date} dateString={date} />
          </header>
          <section>
            <p className={styles.post_item_description}>{slug}</p>
          </section>
        </li>
      ))}
    </ul>
  );
}
