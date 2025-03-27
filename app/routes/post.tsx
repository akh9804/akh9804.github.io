import {getPost} from '@/utils/md.server';
import hljs from 'highlight.js';
import {useEffect} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/post';

export function meta({params}: Route.MetaArgs) {
  return [{title: `ahntree.log | ${params.slug}`}, {name: 'description', content: params.slug}];
}

export async function loader({params}: Route.LoaderArgs) {
  return getPost(params.slug);
}

export default function Post() {
  const post = useLoaderData<typeof loader>();

  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <article className="post">
      <h1 className="text-[var(--color-title)] text-5xl font-bold font-title">{post.title}</h1>
      <p className="text-sm text-gray-700 mt-2">{post.date}</p>
      <div className="markdown mt-10" dangerouslySetInnerHTML={{__html: post.html}} />
    </article>
  );
}
