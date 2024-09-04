import React, { useEffect, useMemo, useState } from "react"

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

type ImageSrc = typeof BoyImg | typeof GirlImg

export function AnimationAvatar({ isAnimating }: { isAnimating: boolean; }) {

	const imageSrc = useMemo(GetRandomImageSrc, [])
	const [index, setIndex] = useState(0)

	useEffect( () => {

		const timeout = setTimeout( () => {
			setIndex(prev => isAnimating ? prev + 1 : 0)
		}, 600)
		
		return () => clearTimeout(timeout)
	}, [index, isAnimating])

	return (
		<div style={{
			position: "relative",
			width: "100%",
			height: "min(80vw,400px)",
			maxHeight: "min(80vw,400px)"
		}}>
			<Image src={imageSrc.images[2]} display={isAnimating && index % 2 === 0} />
			<Image src={imageSrc.images[1]} display={isAnimating && index % 2 === 1} />
			<Image src={imageSrc.images[0]} display={!isAnimating} />
		</div>
	)
}

function Image({ src, display, style }: { src: string; display?: boolean, style?: React.CSSProperties }) {
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
				display: display ? "inline-block" : "none",
				...style
			}} />
	)
}

function GetRandomImageSrc(): ImageSrc {
	return Math.random() >= 0.5 ? BoyImg : GirlImg
}
