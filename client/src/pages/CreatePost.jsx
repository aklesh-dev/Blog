import { Button, FileInput, FloatingLabel, Select, TextInput } from 'flowbite-react'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {

    return (
        <section className="p-3 max-w-3xl mx-auto min-h-svh">
            <h1 className="text-2xl font-semibold text-center my-7">Create a post</h1>

            <form className="flex flex-col gap-4">
                <div className="flex max-sm:flex-col gap-4 justify-between">
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                    {/* <FloatingLabel variant="outlined" label="Title" type='text' required id='title' className='flex-1' /> */}
                    <Select>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                        <option value='python'>Python</option>
                    </Select>
                </div>

                <div className="flex items-center justify-between gap-4 border-4 border-teal-400 border-dotted p-3">
                    <FileInput type='file' accept='image/*' />
                    <Button type='button' className='font-semibold' outline gradientDuoTone='greenToBlue'>Upload Image</Button>
                </div>

                <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12' required />

                <Button type='submit' gradientDuoTone={'purpleToPink'} className='font-semibold'>Publish</Button>
            </form>
        </section>
    )
};
