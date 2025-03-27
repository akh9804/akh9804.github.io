import type {Config} from '@react-router/dev/config';
import {getAllPosts} from './app/utils/md.server';

export default {
  ssr: false,
  async prerender() {
    const posts = await getAllPosts();

    return ['/', ...posts.map(post => `/posts/${post.slug}`)];
  },
} satisfies Config;
