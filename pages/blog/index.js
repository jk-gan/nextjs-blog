import Link from 'next/link'
import dayjs from 'dayjs'

export default function Blog({ posts }) {
  return (
    <div className="container mx-auto mt-16 w-6/12 divide-y-2">
      <h1 className="font-bold text-4xl mb-3">Articles</h1>
      <ul className="pt-5">
        {posts.map(post => (
          <li className="mb-3" key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <a className="font-semibold text-2xl hover:text-red-500">{post.title}</a>
            </Link>
            <p className="text-sm text-gray-400">{dayjs(post.date).format('MMMM D, YYYY')}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// this function will get called at build time
export async function getStaticProps() {
  const fs = require('fs')
  const matter = require('gray-matter')
  const uniqid = require('uniqid')

  const postsDir = `${process.cwd()}/posts`

  const files = fs.readdirSync(postsDir, 'utf-8')
  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const rawContent = fs.readFileSync(`${postsDir}/${file}`, { encoding: 'utf8' })
      const { data } = matter(rawContent)

      return { ...data, id: uniqid()}
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return {
    props: { posts }
  }
}