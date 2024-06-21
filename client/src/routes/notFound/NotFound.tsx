import { useAppBarHeader } from "src/context/AppBarHeader"
import LondonSpyImg from "../../assets/pictures/spyInLondon.png"
import { useTitle } from "../../hooks/useTitle"
import { PageContainer } from "../../layout/PageContainer/PageContainer"

export function NotFoundPage() {
    return (
        <PageContainer>
            <NotFoundPageContent />
        </PageContainer>
    )
}

export function NotFoundPageContent() {
    useTitle("404")
    useAppBarHeader("404")
    return (
        <div style={{
            fontFamily: "Comic Sans MS, bold, sans-serif",
            textAlign: "center",
            marginBottom: "150px"
        }}>
            <h1>404</h1>
            <h1 style={{
                color: "#e144f0",
                textShadow: "2px 2px 2px #000000"
            }}>
                Beklager,<br />siden du leter etter er i London
            </h1>
            <img
                src={LondonSpyImg}
                loading="lazy"
                alt="Hemmelig spion i London..."
                style={{
                    width: "75%",
                    boxShadow: "0px 0px 10px 3px #000000",
                    marginTop: "20px",
                    marginBottom: "20px"
                }} />

            <h1>Fakta om London på engelsk:</h1>
            <ul style={{ fontSize: 22 }}>
                <li>
                    London is the biggest city in Britain and in Europe.
                </li>
                <li>
                    London occupies over 620 square miles
                </li>
                <li>
                    London has a population of 7,172,036 (2001)
                </li>
                <li>
                    About 12% of Britain’s overall population live in London (1998)
                </li>
                <li>
                    London is in the southeast of England.
                </li>
                <li>
                    The tallest building in London is the Canary Wharf Tower.
                </li>
            </ul>
        </div>
    )
}
