import fs from 'fs/promises';
import matter from 'gray-matter';
import {marked} from 'marked';
import path from 'path';

const postsDir = path.join(process.cwd(), 'app/posts');

export async function getPost(slug: string) {
  const filePath = path.join(postsDir, `${slug}.md`);
  const file = await fs.readFile(filePath, 'utf-8');
  const {content, data} = matter(file);
  const html = await marked(content);
  const preview = html.split('\n').slice(0, 3).join(' ');

  return {
    slug,
    html,
    preview,
    title: data.title,
    date: data.date,
  };
}

export async function getAllPosts() {
  const files = await fs.readdir(postsDir);
  const posts = await Promise.all(
    files.map(async file => {
      const slug = file.replace('.md', '');
      const {title, date, preview} = await getPost(slug);

      return {slug, title, date, preview};
    }),
  );

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
