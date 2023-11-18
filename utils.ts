import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import rehypePrism from 'rehype-prism-plus';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import {unified} from 'unified';

interface MatterData {
  title: string;
  date: string;
  slug: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as MatterData),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }

    return -1;
  });
}

export async function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map(fileName => ({id: fileName.replace(/\.md$/, '')}));
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContents = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypePrism)
    .process(matterResult.content);
  const contentHtml = processedContents.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as MatterData),
  };
}
