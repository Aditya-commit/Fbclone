import Image from 'next/image';
import { signIn } from 'next-auth/client'

const Login=()=>{
	return(
		<div className='grid place-items-center'>
			<Image
				src='https://links.papareact.com/t4i'
				height={200}
				width={400}
			/>
			<h1 onClick={()=>signIn()} className='p-5 bg-blue-500 rounded-full text-white text-center cursor-pointer'>Login to Facebook</h1>
		</div>
	);
}
export default Login;