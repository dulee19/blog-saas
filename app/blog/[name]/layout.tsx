const BlogLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            {children}
        </main>
    )
}

export default BlogLayout