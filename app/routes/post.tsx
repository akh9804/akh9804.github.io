import {getPost} from '@/utils/md.server';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/post';

export async function loader({params}: Route.LoaderArgs) {
  return getPost(params.slug);
}

export default function Post() {
  const post = useLoaderData<typeof loader>();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>
        <em>{post.date}</em>
      </p>
      <div dangerouslySetInnerHTML={{__html: post.html}} />
    </article>
  );
}
