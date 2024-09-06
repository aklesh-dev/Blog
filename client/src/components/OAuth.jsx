import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from 'react-icons/ai';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.getCustomParameters({ prompt: 'select_account' });

        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    photoUrl: resultFromGoogle.user.photoURL,
                }),
            });
            const data = await res.json();
            if(res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Button onClick={handleGoogleClick} gradientDuoTone='pinkToOrange' outline type="button" className="font-semibold">
            <AiFillGoogleCircle color="red" className="w-6 h-6 mr-2 " />
            Continue with Google
        </Button>
    )
}
