import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import EmptyState from "../components/dashboard/EmptyState";
import prisma from "../utils/db";
import { requireUser } from "../utils/requireUser";
import DefaultImage from '@/public/default.png'
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(userId: string) {
    const [sites, articles] = await Promise.all([
        prisma.site.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3
        }),
        await prisma.post.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 3
        })
    ]);

    return { sites, articles }
}

const DashboardPage = async () => {
    const user = await requireUser();
    const { articles, sites } = await getData(user.id);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-5">Your Sites</h2>
            {sites.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'>
                    {sites.map((item) => (
                        <Card key={item.id}>
                            <Image
                                src={item.imageUrl ?? DefaultImage}
                                alt={item.name}
                                width={400}
                                height={200}
                                className="rounded-t-lg object-cover w-full h-[200px]"
                            />
                            <CardHeader>
                                <CardTitle className='truncate'>{item.name}</CardTitle>
                                <CardDescription className='line-clamp-3'>{item.description}</CardDescription>
                            </CardHeader>

                            <CardFooter>
                                <Button asChild className='w-full'>
                                    <Link href={`/dashboard/sites/${item.id}`}>View Article</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="You don't have any sites created"
                    description="You currently don't have any Sites. Please create some so that you can see them right here."
                    href="/dashboard/sites/new"
                    buttonText="Create Site"
                />
            )}

            <h1 className="text-2xl mt-10 font-semibold mb-5">Recent Articles</h1>
            {articles.length > 0 ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'>
                    {articles.map((item) => (
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
                                    <Link href={`/dashboard/sites/${item.siteId}/${item.id}`}>Edit Article</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <EmptyState
                    title="You don't have any articles created"
                    description="You currently don't have any articles created. Please create some so that you can see them right here."
                    href="/dashboard/sites"
                    buttonText="Create Article"
                />
            )}
        </div>
    )
}

export default DashboardPage