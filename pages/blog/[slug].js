import dayjs from 'dayjs'

export default function BlogPostPage(props) {
    const { title, content, date } = props.post

    return (
        <div className="container mx-auto mt-16 w-6/12">
            <h1 className="font-bold text-4xl mb-3">{title}</h1>
            <p className="text-sm text-gray-400">{dayjs(date).format('MMMM D, YYYY')}</p>
            <section className="mt-5 prose" dangerouslySetInnerHTML={{__html: content}} />
        </div>
    )
}

// this function will get called at build time
export async function getStaticProps(context) {
    const fs = require('fs')
    const remark = require('remark')
    const html = require('remark-html')
    const matter = require('gray-matter')

    const postsDir = `${process.cwd()}/posts`

    const { slug } = context.params
    const rawContent = fs.readFileSync(`${postsDir}/${slug}.md`)
    const { data, content } = matter(rawContent)

    const result = await remark()
        .use(html)
        .process(content)

    return {
        props: { 
            post: { 
                ...data, 
                content: result.toString(),
            },
        }
    }
}

// this function will get called at build time
export async function getStaticPaths(context) {
    const fs = require('fs')
    const files = fs.readdirSync(`${process.cwd()}/posts`, 'utf-8')

    const filenames = files
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''))

    return {
        paths: filenames.map(filename => (
            { 
                params: {
                    slug: filename,
                },
            }
        )),
        fallback: false,
    }
}