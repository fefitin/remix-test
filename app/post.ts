import fs from 'fs/promises';
import invariant from 'tiny-invariant';
import { marked } from 'marked';
import parseFrontMatter from 'front-matter';
import path from 'path';

export type Post = {
  slug: string;
  title: string;
  html: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

const postsPath = path.join(__dirname, '..', 'posts');

function isValidPostAttributes(attributes: any): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts(): Promise<Post[]> {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(filename => {
      return getDataFromFilename(filename);
    })
  );
}

export async function getPost(slug: string): Promise<Post> {
  const filename = `${slug}.md`;
  return getDataFromFilename(filename);
}

async function getDataFromFilename(filename: string): Promise<Post> {
  const file = await fs.readFile(path.join(postsPath, filename));
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(isValidPostAttributes(attributes), `${filename} has bad meta data!`);
  return {
    slug: filename.replace(/\.md$/, ''),
    title: attributes.title,
    html: marked(body),
  };
}
