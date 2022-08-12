import React, { useState } from "react";

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
		setTimeout( () => setIndex(index + 1), 600)
	}

	if(!isAnimating && index !== 0){
		setIndex(0)
	}

	return ( 
		<div style={{
			position: "relative", 
			width: "100%", 
			height: "min(80vw,400px)",
			maxHeight: "min(80vw,400px)"
		}}>
			<Image src={gender.images[2]} display={isAnimating && index % 2 === 0}/>
			<Image src={gender.images[1]} display={isAnimating && index % 2 === 1}/>
			<Image src={gender.images[0]} display={!isAnimating}/>
		</div>
	)
}

function GetRandomImage(): ILoadingImage {
	return Math.random() >= 0.5 ? BoyImg : GirlImg
}


function Image( { src, display, style }: {src: string; display: boolean, style?: React.CSSProperties}){
	const displayCss = display ? {display: "inline-block"} : {display: "none"} 
	return ( 
		<img 
			src={src} 
			alt="Person kledd i Motstanden-uniform"
			style={{
				borderRadius: "100%",
				maxHeight: "min(80vw,400px)",
				position: "absolute",
				right: "0",
				left: "0",
				marginLeft: "auto",
				marginRight: "auto",
				...displayCss,
				...style
			}} /> 
	)
}