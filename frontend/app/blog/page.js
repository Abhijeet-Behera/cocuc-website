import LatestBlogs from '@/components/LatestBlogs'

export default function BlogPage() {
  return (
    <div>
      <section style={{ backgroundColor: 'var(--color-primary-dark)', color: 'var(--color-white)', padding: '150px 0 100px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Church Blog</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            Read the latest messages, devotionals, and updates from our pastoral team.
          </p>
        </div>
      </section>

      <section className="section container">
        <LatestBlogs />
      </section>
    </div>
  )
}
