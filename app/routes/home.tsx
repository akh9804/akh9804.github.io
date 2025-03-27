import Post from '@/components/Post';
import {getAllPosts} from '@/utils/md.server';
import {useLoaderData} from 'react-router';
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
      <div className="flex flex-col gap-8">
        {posts.map(post => (
          <Post key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
