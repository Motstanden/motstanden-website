import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Icon, Link, Stack, Theme, useMediaQuery } from "@mui/material"
import { Poll } from "common/interfaces"
import { strToNumber } from "common/utils"
import { Navigate, Link as RouterLink, useParams } from "react-router-dom"
import { pollListQueryKey, usePolls } from "./Context"
import { PollCard } from "./components/PollCard"

export {
    PollItemPage,
    Header as PollItemPageHeader
}


function PollItemPage() {
    const poll = usePollParam()
    if (!poll)
        return <Navigate to="/avstemninger/alle" />

    return (
        <>
            <Header/>
            <div style={{
                minWidth: "MIN(100%, 500px)",
                maxWidth: "800px"
            }}>
                <PollCard poll={poll} srcQueryKey={pollListQueryKey} />
            </div>
        </>
    )
}

function Header() {

    const isMediumScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("lg"))

    let marginTop = "-2px"
    if(isMediumScreen) {
        marginTop = "10px"
    } 

    return (
        <div style={{
            marginTop: marginTop,
        }}>
            <Link
                component={RouterLink}
                to="/avstemninger/alle"
                color="inherit"
                underline="hover"
                sx={{
                    opacity: "0.5",
                    fontSize: "9px",
                    fontWeight: "bold"
                }}
            >
                <Icon fontSize='inherit' sx={{marginRight: "2px"}}>
                    <ArrowBackIcon sx={{ fontSize: "inherit"}}/> 
                </Icon>
                <span>
                    ALLE AVSTEMNINGER
                </span>
            </Link>
            <h1 style={{
                marginTop: "0px",
                paddingTop: "0px"
            }}>
                Avstemning
            </h1>
        </div>
    )
}

function usePollParam(): Poll | undefined {
    const pollId = strToNumber(useParams().pollId)
    const { polls } = usePolls()

    if (pollId === undefined)
        return undefined

    return polls.find(p => p.id === pollId)
}