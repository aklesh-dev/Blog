import { Alert, Button, FloatingLabel, Spinner } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateInFailure, updateInStart, updateInSuccess } from "../redux/user/userSlice";

export default function DashProfile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();


  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploadError(null);
    setImageFileUploading(true);
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
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setImageFileUrl(downloadURL);
            setFormData({ ...formData, profilePic: downloadURL });
            setImageFileUploading(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {     
      dispatch(updateInFailure("No change made"))
      return;
    }

    if (imageFileUploading) {
      dispatch(updateInFailure("Please wait for image to upload."));
      return;
    }

    try {
      dispatch(updateInStart());
      setUpdateUserSuccess(null);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateInFailure(data.message));
      } else {
        dispatch(updateInSuccess(data));
        setUpdateUserSuccess("User updated successfully.");
      }

    } catch (error) {
      dispatch(updateInFailure(error.message));
    }

  };

  return (
    <section className="max-w-lg mx-auto w-full p-3">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    stroke: `rgba(62,152,199, ${imageFileUploadProgress / 100})`
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

        <FloatingLabel onChange={handleChange}
          variant="outlined"
          label="username"
          defaultValue={currentUser.username}
          id="username"
        />
        <FloatingLabel onChange={handleChange}
          variant="outlined"
          label="email"
          type="email"
          defaultValue={currentUser.email}
          id="email"
        />
        <FloatingLabel onChange={handleChange} variant="outlined" type="password" label="password" id="password" />
        <Button disabled={loading} type="submit" gradientDuoTone="purpleToBlue" outline>
          {
            loading
              ? <>
                <Spinner size={'sm'} />
                <span className="pl-3">Loading...</span>
              </>
              : 'update'
          }
        </Button>
      </form>

      <div className="flex justify-between text-red-500 my-5">
        <span className="cursor-pointer hover:text-red-700">
          Delete Account
        </span>
        <span className="cursor-pointer hover:text-red-700">Sign out</span>
      </div>
      {error && <Alert color={'failure'}>{error}</Alert>}
      {updateUserSuccess && <Alert color={'success'}>{updateUserSuccess}</Alert>}

    </section>
  );
}
