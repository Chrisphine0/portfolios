
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), '_posts')

export interface PostData {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

export function getSortedPostsData(): Omit<PostData, 'content'>[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
      excerpt: matterResult.data.excerpt,
    }
  })

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: matterResult.data.title,
    date: matterResult.data.date,
    excerpt: matterResult.data.excerpt,
    content: contentHtml,
  }
}
