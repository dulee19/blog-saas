import prisma from "@/app/utils/db"
import Image from "next/image";
import { notFound } from "next/navigation";
import Logo from '@/public/logo.svg'
import { ThemeToggle } from "@/app/components/dashboard/ThemeToggle";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DefaultImage from '@/public/default.png'

async function getData(subDir: string) {
    const data = await prisma.site.findUnique({
        where: {
            subdirectory: subDir
        },
        select: {
            name: true,
            posts: {
                select: {
                    smallDescription: true,
                    title: true,
                    image: true,
                    createdAt: true,
                    slug: true,
                    id: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!data) {
        return notFound();
    }

    return data;
}

const BlogPage = async ({ params }: { params: { name: string } }) => {
    const data = await getData(params.name)

    return (
        <>
            <nav className="grid grid-cols-3 my-10">
                <div className="col-span-1" />
                <div className="flex items-center gap-x-4 justify-center">
                    <Link href="/dashboard">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={40}
                            height={40}
                        />
                    </Link>
                    <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
                </div>

                <div className="col-span-1 flex w-full justify-end">
                    <ThemeToggle />
                </div>
            </nav>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'>
                {data.posts.map((item) => (
                    <Card key={item.id}>
                        <Image
                            src={item.image ?? DefaultImage}
                            alt={item.title}
                            width={400}
                            height={200}
                            className="rounded-t-lg object-cover w-full h-[200px]"
                        />
                        <CardHeader>
                            <CardTitle className='truncate'>{item.title}</CardTitle>
                            <CardDescription className='line-clamp-3'>{item.smallDescription}</CardDescription>
                        </CardHeader>

                        <CardFooter>
                            <Button asChild className='w-full'>
                                <Link href={`/blog/${params.name}/${item.slug}`}>Read more</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}

export default BlogPage