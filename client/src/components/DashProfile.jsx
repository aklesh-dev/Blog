import { Alert, Button, FloatingLabel } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const filePickerRef = useRef();

  
  useEffect(() => {
    if (imageFile) {

      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));        
      },
      (error) => {
        setImageFileUploadError("Could not upload the file (file must be less than 2mb)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setImageFileUrl(downloadURL);
          })
          .catch((err) => {
            console.error("Error getting downloadUrl:", err);
          })
      }
    );

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  return (
    <section className="max-w-lg mx-auto w-full p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form className="flex flex-col gap-4">
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        <div
          onClick={() => filePickerRef?.current?.click()}
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden"
        >
          {
            imageFileUploadProgress && (
              <CircularProgressbar
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  },
                  path: {
                    stroke: `rgba(62,152,199, ${imageFileUploadProgress/100})`
                  },
                }}

              />
            )
          }
          <img
            src={imageFileUrl || currentUser.profilePic}
            alt="user"
            className={`w-full h-full rounded-full object-cover border-8 border-double border-[#dddbdb] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-80'}`}
          />
        </div>

        {
          imageFileUploadError && <Alert color={'failure'}>{imageFileUploadError}</Alert>
        }

        <FloatingLabel
          variant="outlined"
          label="username"
          defaultValue={currentUser.username}
          id="username"
        />
        <FloatingLabel
          variant="outlined"
          label="email"
          defaultValue={currentUser.email}
          id="email"
        />
        <FloatingLabel variant="outlined" label="password" id="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>

      <div className="flex justify-between text-red-500 my-5">
        <span className="cursor-pointer hover:text-red-700">
          Delete Account
        </span>
        <span className="cursor-pointer hover:text-red-700">Sign out</span>
      </div>
    </section>
  );
}
