import { Alert, Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);
    const [publishLoading, setPublishLoading] = useState(false);

    const Navigate = useNavigate();

    const handleUploadImage = async () => {
        if (!imageFile) {
            setImageFileUploadError('Please select an image');
            return;
        }

        try {
            setImageFileUploadError(null);
            const storage = getStorage(app);
            const fileName = `${new Date().getTime()}-${imageFile.name}`;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, imageFile);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setImageFileUploadError("Error uploading image!");
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            setImageFileUploadError(null);
                            setImageUploadProgress(null);
                            setFormData({ ...formData, image: downloadURL });
                        })
                        .catch((err) => {
                            setImageFileUploadError('Image upload failed');
                            setImageUploadProgress(null);
                            console.error(err)
                        });
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setPublishLoading(true);
            const res = await fetch(`/api/post/create-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message);
                setPublishLoading(false);
                return;
            }
            else if (res.ok) {
                setPublishError(null);
                setPublishLoading(false);
                Navigate(`/post/${data.slug}`);
            }
        } catch (error) {
            setPublishLoading(false);
            setPublishError('Something went wrong!', error);
        }
    }

    return (
        <section className="p-3 max-w-3xl mx-auto min-h-svh">
            <h1 className="text-2xl font-semibold text-center my-7">Create a post</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex max-sm:flex-col gap-4 justify-between">
                    <TextInput onChange={(e) => setFormData({ ...formData, title: e.target.value })} type='text' placeholder='Title' required id='title' className='flex-1' />

                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                        <option value='python'>Python</option>
                    </Select>
                </div>

                <div className="flex items-center justify-between gap-4 border-4 border-teal-400 border-dotted p-3">
                    <FileInput onChange={handleImageChange} type='file' accept='image/*' />
                    <Button disabled={imageUploadProgress} onClick={handleUploadImage} type='button' className='font-semibold' outline gradientDuoTone='greenToBlue'>
                        {imageUploadProgress
                            ? <div className='w-16 h-16'>
                                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}% `} />
                            </div>
                            : 'Upload Image'
                        }
                    </Button>
                </div>

                {/* --view upload image-- */}
                {
                    formData.image && <img src={formData.image} alt="upload-img" className='w-full h-72 object-contain' />
                }

                {/* --error uploading image-- */}
                {imageFileUploadError && <Alert color={'failure'}>{imageFileUploadError}</Alert>}

                <ReactQuill onChange={(value) => setFormData({ ...formData, content: value })} theme='snow' placeholder='write something...' className='h-72 mb-12' required />

                <Button disabled={publishLoading} type='submit' gradientDuoTone={'purpleToPink'} className='font-semibold'>
                    {publishLoading
                        ? <>
                            <Spinner size={'sm'} />
                            <span className='ml-2'>Loading</span>
                        </>
                        : 'Publish'
                    }
                </Button>

                {
                    publishError && <Alert color={'failure'}>{publishError}</Alert>
                }
            </form>
        </section>
    )
};
