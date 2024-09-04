import { useEffect, useMemo, useState } from "react"

import boy1 from "../../assets/pictures/loginAvatar/boy1.png"
import boy2 from "../../assets/pictures/loginAvatar/boy2.png"
import boy3 from "../../assets/pictures/loginAvatar/boy3.png"

import girl1 from "../../assets/pictures/loginAvatar/girl1.png"
import girl2 from "../../assets/pictures/loginAvatar/girl2.png"
import girl3 from "../../assets/pictures/loginAvatar/girl3.png"

const BoyImg = {
	gender: "boy",
	images: [
		boy1,
		boy2,
		boy3
	]
} as const

const GirlImg = {
	gender: "girl",
	images: [
		girl1,
		girl2,
		girl3
	]
} as const

function GetRandomImageSrc() {
	return Math.random() >= 0.5 ? BoyImg : GirlImg
}

export function AnimationAvatar({ isAnimating, style }: { isAnimating: boolean, style?: React.CSSProperties }) {

	const imageSrc = useMemo(GetRandomImageSrc, [])
	
	// Preload image so that the animation has a smooth start
	useEffect( () => {
		for(const src of imageSrc.images ) { 
			const img = new Image()
			img.src = src
		}
	}, [ imageSrc ])
	
	const [index, setIndex] = useState(0)

	// Increment index every 600ms if animating
	useEffect( () => {

		const timeout = setTimeout( () => {
			setIndex(prev => isAnimating ? prev + 1 : 0)
		}, 600)
		
		return () => clearTimeout(timeout)
	}, [index, isAnimating])

	let src = imageSrc.images[0]
	if(isAnimating) {
		src = imageSrc.images[index % 2 + 1]
	}
	return (
		
		<img
			src={src}
			alt="Person kledd i Motstanden-uniform"
			style={{
				borderRadius: "100%",
				...style,
			}} />
	)
}