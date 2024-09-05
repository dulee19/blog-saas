'use client'

import { EditPostActions } from "@/app/actions";
import { UploadDropzone } from "@/app/utils/UploadthingComponents";
import { PostSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Atom } from "lucide-react";
import Image from "next/image";
import { JSONContent } from "novel";
import { useActionState, useState } from "react";
import slugify from "react-slugify";
import { toast } from "sonner";
import TailwindEditor from "../EditorWrapper";
import { SubmitButton } from "../SubmitButtons";

interface iAppProps {
    data: {
        slug: string;
        title: string;
        smallDescription: string;
        articleContent: any;
        id: string;
        image: string;
    };
    siteId: string;
}

const EditArticleForm = ({ data, siteId }: iAppProps) => {
    const [imageUrl, setImageUrl] = useState<undefined | string>(data.image);
    const [value, setValue] = useState<JSONContent | undefined>(data.articleContent);
    const [slug, setSlugValue] = useState<undefined | string>(data.slug);
    const [title, setTitle] = useState<undefined | string>(data.title);

    const [lastResult, action] = useActionState(EditPostActions, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({ formData }) {
            return parseWithZod(formData, {
                schema: PostSchema
            })
        },

        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })

    function handleSlugGeneration() {
        const titleInput = title;

        if (titleInput?.length === 0 || titleInput === undefined) {
            return toast.error('Please create a title first')
        }

        setSlugValue(slugify(titleInput));

        return toast.success('Slug has been created')
    }

    return (
        <Card className="mt-5">
            <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam numquam veritatis rerum animi quas cum quasi blanditiis qui quos?</CardDescription>
            </CardHeader>

            <CardContent>
                <form id={form.id} onSubmit={form.onSubmit} action={action} className="flex flex-col gap-6">
                    <input type="hidden" name="articleId" value={data.id} />
                    <input type="hidden" name="siteId" value={siteId} />
                    <div className="grid gap-2">
                        <Label>Title</Label>
                        <Input
                            key={fields.title.key}
                            name={fields.title.name}
                            defaultValue={fields.title.initialValue}
                            placeholder="Next Blogging Application"
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                        />
                        <p className="text-red-500 text-sm">{fields.title.errors}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Slug</Label>
                        <Input
                            key={fields.slug.key}
                            name={fields.slug.name}
                            defaultValue={fields.slug.initialValue}
                            placeholder="Article Slug"
                            onChange={(e) => setSlugValue(e.target.value)}
                            value={slug}
                        />
                        <Button onClick={handleSlugGeneration} variant="secondary" className="w-fit" type="button">
                            <Atom className="size-4 mr-2" /> Generate Slug
                        </Button>
                        <p className="text-red-500 text-sm">{fields.slug.errors}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Small Description</Label>
                        <Textarea key={fields.smallDescription.key} name={fields.smallDescription.name} defaultValue={data.smallDescription} className="h-32" placeholder="Small description for your blog article..." />
                        <p className="text-red-500 text-sm">{fields.smallDescription.errors}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Cover Image</Label>
                        <input
                            type="hidden"
                            name={fields.coverImage.name}
                            key={fields.coverImage.key}
                            defaultValue={fields.coverImage.initialValue}
                            value={imageUrl}
                        />
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt="Uploaded Image"
                                width={200}
                                height={200}
                                className="object-cover w-[200px] h-[200px] rounded-lg"
                            />
                        ) : (
                            <UploadDropzone onClientUploadComplete={(res) => {
                                setImageUrl(res[0].url)
                                toast.success("Image has been uploaded");
                            }}
                                endpoint="imageUploader"
                                onUploadError={() => {
                                    toast.error('Something went wrong')
                                }}
                            />
                        )}

                        <p className="text-red-500 text-sm">{fields.coverImage.errors}</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Article Content</Label>
                        <input
                            type="hidden"
                            name={fields.articleContent.name}
                            key={fields.articleContent.key}
                            defaultValue={fields.articleContent.initialValue}
                            value={JSON.stringify(value)}
                        />
                        <TailwindEditor
                            onChange={setValue}
                            initialValue={value}
                        />
                        <p className="text-red-500 text-sm">{fields.articleContent.errors}</p>
                    </div>

                    <SubmitButton
                        text="Edit Article"
                    />
                </form>
            </CardContent>
        </Card>
    )
}

export default EditArticleForm