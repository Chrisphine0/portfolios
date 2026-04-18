
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), '_posts')

function isAuthenticated(req: NextRequest): boolean {
  const password = req.headers.get('Authorization')?.split(' ')?.[1]
  return password === (process.env.ADMIN_API_PASSWORD || 'password')
}

export async function GET(req: NextRequest, { params }: { params: { slug?: string[] } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = params.slug?.[0]

  if (slug) {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    return NextResponse.json({ 
      title: data.title, 
      excerpt: data.excerpt || '',
      content 
    })
  } else {
    const fileNames = fs.readdirSync(postsDirectory)
    const posts = fileNames.map(fileName => {
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return {
        slug: fileName.replace(/\.md$/, ''),
        title: data.title,
        date: data.date,
      }
    })
    return NextResponse.json(posts.sort((a, b) => (new Date(b.date) as any) - (new Date(a.date) as any)))
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, slug, content, excerpt } = await req.json()
  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post with this slug already exists' }, { status: 409 })
  }

  const fileContent = matter.stringify(content, { title, date: new Date().toISOString(), excerpt: excerpt || '' })
  fs.writeFileSync(filePath, fileContent)

  return NextResponse.json({ message: 'Post created successfully' }, { status: 201 })
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string[] } }) {
    if (!isAuthenticated(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = params.slug?.[0]
    if (!slug) {
        return NextResponse.json({ error: 'Slug is required for updating' }, { status: 400 })
    }

    const { title, content, excerpt } = await req.json()
    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const filePath = path.join(postsDirectory, `${slug}.md`)
    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const originalFile = fs.readFileSync(filePath, 'utf8')
    const { data: originalData } = matter(originalFile)

    const fileContent = matter.stringify(content, { title, date: originalData.date, excerpt: excerpt || '' })
    fs.writeFileSync(filePath, fileContent)

    return NextResponse.json({ message: 'Post updated successfully' })
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string[] } }) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = params.slug?.[0]
  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const filePath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  fs.unlinkSync(filePath)

  return NextResponse.json({ message: 'Post deleted successfully' })
}
