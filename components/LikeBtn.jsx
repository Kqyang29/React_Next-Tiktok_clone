import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function LikeBtn({ id }) {
	const { data: session } = useSession();
	const [likes, setLikes] = useState([]);
	const [hasLike, setHasLike] = useState(false);

  useEffect(() => {
		if (id) {
						
			 const likeUnSub = onSnapshot(
					collection(db, "tiktot_posts", id, "like"),
					(snapshot) => {
						setLikes(snapshot.docs);
					}
			);
			
			return likeUnSub;

		}
    
   
    
	}, [db,id]);

	useEffect(() => {
		
			setHasLike(
				likes.findIndex((like) => like.id === session?.user?.uid) !== -1
			);

  }, [likes]);
  
  const likeVideo = async () => {
		if (session) {
			if (hasLike) {
				await deleteDoc(
					doc(db, "tiktot_posts", id, "like", session?.user?.uid)
				);
			} else {
				await setDoc(
					doc(db, "tiktot_posts", id, "like", session?.user?.uid),
					{
						username: session.user?.username,
					}
				);
			}
		}
	};

	return (
		<div className="flex items-center space-x-1">
			{hasLike ? (
				<AiFillHeart
					onClick={likeVideo}
					className="text-3xl ml-2 cursor-pointer text-red-500"
				/>
			) : (
				<AiOutlineHeart
					onClick={likeVideo}
					className="text-3xl ml-2 cursor-pointer"
				/>
			)}

			{likes?.length > 0 && <p className="text-gray-500">{likes?.length}</p>}
		</div>
	);
}

export default LikeBtn