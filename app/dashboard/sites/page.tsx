import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import prisma from '@/app/utils/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import DefaultImage from '@/public/default.png'
import EmptyState from '@/app/components/dashboard/EmptyState'

async function getData(userId: string) {
    const data = await prisma.site.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return data;
}

const SitesPage = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        return redirect('/api/auth/login')
    }

    const data = await getData(user.id);
    console.log(data)

    return (
        <>
            <div className="flex w-full justify-end">
                <Button asChild className='dark:text-white'>
                    <Link href="/dashboard/sites/new">
                        <PlusCircle className='mr-2 size-4' /> Create Site
                    </Link>
                </Button>
            </div>

            {data === undefined || data.length === 0 ? (
                <EmptyState
                    href='/dashboard/sites/new'
                    title="You don't have any Sites created"
                    description="You currently don't have any Sites. Please create some so that you can see them right here!"
                    buttonText="Create Site"
                />
            ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7'>
                    {data.map((item) => (
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
            )}
        </>
    )
}

export default SitesPage