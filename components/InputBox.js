import Image from 'next/image';
import { useSession } from 'next-auth/client';
import { EmojiHappyIcon } from '@heroicons/react/outline';
import { CameraIcon , VideoCameraIcon } from '@heroicons/react/solid';
import { useRef } from 'react';
import { useState } from 'react';
import { db , storage } from '../firebase';
import firebase from 'firebase';

const InputBox=()=>{
	const [session , loading]=useSession();
	const inputRef=useRef(null);
	const filePickerRef=useRef(null);
	const [imageToPost , setImageToPost]=useState(null);

	const sendPost=(event)=>{
		event.preventDefault();
		console.log(inputRef.current);
		if (!inputRef.current.value) return ;

		db.collection('posts').add({
			message:inputRef.current.value,
			name:session.user.name,
			email:session.user.email,
			image:session.user.image,
			timestamp: firebase.firestore.FieldValue.serverTimestamp()
		}).then(doc=>{
			if(imageToPost){
				const uploadTask=storage.ref(`posts/${doc.id}`).putString(imageToPost , 'data_url')
			
				removeImage();
			
				uploadTask.on('state_change' , null , (error)=>console.log(error) , ()=>{
					//WHEN THE UPLOAD COMPLETES
					storage.ref(`posts`).child(doc.id).getDownloadURL().then(url =>{
						db.collection('posts').doc(doc.id).set({postImage:url} ,{merge:true})
					})
				});
			}
		});

		inputRef.current.value='';
	}

	const addImageToPost=(e)=>{
		const reader=new FileReader();
		if(e.target.files[0]){
			reader.readAsDataURL(e.target.files[0]);
		}

		reader.onload=(readerEvent)=>{
			setImageToPost(readerEvent.target.result);
		}
	}

	const removeImage=()=>{
		setImageToPost(null);
	}

	return(
		<div className='bg-white p-2 rounded-2xl shadow-md text-gray-500 font-medium mt-6'>
			<div className='flex space-x-4 p-4 items-center'>
				<Image
					className='rounded-full'
					src={session.user.image}
					width={40}
					height={40}
				/>
				<form className='flex flex-1'>
					<input className='rounded-full h-12 bg-gray-100 flex-grow px-5 focus:outline-none' type='text' placeholder={`what's on your mind ${session.user.name}`} ref={inputRef} />
					<button hidden type='submit' onClick={sendPost}>Submit</button>
				</form>

				{imageToPost && (
					<div onClick={removeImage} className='flex flex-col filter hover:brightness-110 transition duration-150 transform hover:scale-105 cursor-pointer'>
						<img src={imageToPost} alt="Can't load image" width='35'height='35'/>
						<p className='text-xs text-red-500 text-center'>Remove</p>
					</div>
				)}
			</div>
			<div className='flex justify-evenly p-3 border-t'>
				<div className='InputIcon'>
					<VideoCameraIcon className='h-7 text-red-500' />
					<p className='text-xs sm:text-sm xl:text-base'>Live Vide</p>
				</div>
			{/*THIS WILL TRIGGER THE CLICK EVENT ON THE HIDDEN INPUT FIELD WHEN THIS DIV IS CLICKED.PRETTY GENIUS I KNOW!!!*/}
				<div onClick={()=> filePickerRef.current.click()} className='InputIcon'>
					<CameraIcon className='h-7 text-blue-400' />
					<p className='text-xs sm:text-sm xl:text-base'>Photo View</p>
					<input onChange={addImageToPost} type='file' ref={filePickerRef} hidden />
				</div>
				<div className='InputIcon'>
					<EmojiHappyIcon className='h-7 text-yellow-500' />
					<p className='text-xs sm:text-sm xl:text-base'>Feeling/Activity</p>
				</div>
			</div>
		</div>
	);
}
export default InputBox;