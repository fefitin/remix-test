import { LoaderFunction, useLoaderData } from 'remix';
import { Post, getPost } from '~/post';

import invariant from 'tiny-invariant';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export default function PostSlug() {
  const { html } = useLoaderData<Post>();
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
