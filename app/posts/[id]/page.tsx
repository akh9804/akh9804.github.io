import Date from '@/components/date';
import {getAllPostIds, getPostData} from '@/utils';
import styles from './post.module.css';

interface Props {
  params: {
    id: string;
  };
}

export default async function Post({params}: Props) {
  const postData = await getPostData(params.id);

  return (
    <article>
      <header className={styles.post_header}>
        <h1 className={styles.post_title}>{postData.title}</h1>
        <Date className={styles.post_date} dateString={postData.date} />
      </header>
      <section>
        <div className={styles.post_content} dangerouslySetInnerHTML={{__html: postData.contentHtml}} />
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  return await getAllPostIds();
}
