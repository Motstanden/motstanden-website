import React, { useEffect, useState } from "react";

import boy1 from "../../assets/pictures/loginAvatar/boy1.png"
import boy2 from "../../assets/pictures/loginAvatar/boy2.png"
import boy3 from "../../assets/pictures/loginAvatar/boy3.png"

import girl1 from "../../assets/pictures/loginAvatar/girl1.png"
import girl2 from "../../assets/pictures/loginAvatar/girl2.png"
import girl3 from "../../assets/pictures/loginAvatar/girl3.png"

interface ILoadingImage {
	gender: string,
	images: string[]
}

const BoyImg = {
	gender: "boy",
	images: [
		boy1,
		boy2,
		boy3
	]
}

const GirlImg = {
	gender: "girl",
	images: [
		girl1,
		girl2,
		girl3
	]
}

export function AnimationAvatar({ isAnimating }: { isAnimating: boolean; }) {

	const [gender, setGender] = useState<ILoadingImage>(GetRandomImage());
	const [index, setIndex] = useState(0)

	if(isAnimating){
		setTimeout( () => setIndex(index % 2 + 1), 200)
	}

	if(!isAnimating && index !== 0){
		setIndex(0)
	}

	return <Image src={gender.images[index]}/>
}

function GetRandomImage(): ILoadingImage {
	return Math.random() >= 0.5 ? BoyImg : GirlImg
}


function Image( { src }: {src: string}){
	return ( 
		<img 
			src={src} 
			alt="Person kledd i Motstanden-uniform"
			style={{
				borderRadius: "100%",
				width: "100%",
				maxWidth: "400px"
			}} /> 
	)
}