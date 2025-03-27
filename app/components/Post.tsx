import {Link} from 'react-router';

interface Props {
  post: {
    slug: string;
    title: string;
    date: string;
    preview: string;
  };
}

export default function Post({post}: Props) {
  return (
    <Link className="block py-4 hover:opacity-80 transition-all duration-300" to={`/posts/${post.slug}`}>
      <article key={post.slug}>
        <h2 className="text-[var(--color-title)] text-3xl font-bold font-title">{post.title}</h2>
        <p className="text-sm text-gray-700">{post.date}</p>
        <p className="text-base">{post.preview}</p>
      </article>
    </Link>
  );
}
