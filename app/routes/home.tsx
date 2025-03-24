import {getAllPosts} from '@/utils/md.server';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{title: 'Ahntree Blog'}, {name: 'description', content: 'Welcome to Ahntree Blog'}];
}

export async function loader() {
  return await getAllPosts();
}

export default function Home() {
  const posts = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>블로그</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <h2>
              <Link to={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>
              <em>{post.date}</em>
            </p>
            <p>{post.preview}...</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
