import { LoadingButton } from "@mui/lab"
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, Theme, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Poll, PollOption, PollWithOption } from "common/interfaces"
import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function PollPage(){
    const polls = useOutletContext<Poll[]>()
    const [currentPoll, ...remainingPolls] = polls

    return(
        <div>
            <div style={{marginBlock: "40px"}}>
                <CurrentPoll poll={currentPoll}/>
            </div>
            <PreviousPolls polls={remainingPolls}/>
        </div>
    )
}

function CurrentPoll( { poll }: { poll: Poll }){
    return(
        <div style={{
            display: "inline-block", 
            minWidth: "MIN(100%, 500px)"
        }}>
            <TitleCard title={poll.title}>
                <PollOptions poll={poll}/>
            </TitleCard>
        </div>
    )
}

function PreviousPolls( {polls}: { polls: Poll[] }) {

    return (
        <>
            <h2>Tidligere avstemminger</h2>
            {polls.map((poll, index) => (
                <Accordion 
                    key={index} 
                    TransitionProps={{ unmountOnExit: true }} 
                    disableGutters
                    >
                    <AccordionSummary>
                        <h3>
                            {poll.title}
                        </h3>
                    </AccordionSummary>
                    <AccordionDetails>
                        <PollOptions poll={poll}/>
                    </AccordionDetails>
                </Accordion>
            ))}
        </>
    )
}



function PollOptions( {poll}: {poll: Poll} ) {

    const {isLoading, isError, data, error} = useQuery<PollOption[]>( [ poll.id, "FetchPollOptions"], () => fetchAsync<PollOption[]>(`/api/polls/${poll.id}/options`))
    
    if(isLoading)
        return <></> // TODO: Loading skeleton

    if(isError)
        return <></>

    const pollData: PollWithOption = {
        ...poll,
        options: data
    }

    const userHasVoted = pollData.options.find(option => option.isVotedOnByUser) !== undefined

    if(userHasVoted)
        return <PollResult poll={pollData}/>

    if(poll.type === "multiple")
        return <MultipleChoicePollOptions poll={pollData}/>
    
    return <SingleChoicePollOptions poll={pollData} />
}

function SingleChoicePollOptions( {poll}: {poll: PollWithOption}) {

    const [selectedIndex, setSelectedIndex] = useState(poll.options.findIndex( p => p.isVotedOnByUser))

    return (
        <div>
            <FormControl>
                <RadioGroup value={selectedIndex}>
                    {poll.options.map((option, index) => (
                        <OptionItem 
                            key={index}
                            value={index}
                            option={option}
                            variant="single"
                            onClick={() => setSelectedIndex(index)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
            <div style={{marginTop: "2em", marginBottom: "1em"}}>
                <SubmitButtons />
            </div>
        </div>
    )
}

function OptionItem({
    option, 
    value, 
    variant,
    onClick
}: {
    option: PollOption, 
    value: unknown, 
    variant: "single" | "multiple",
    onClick?: React.MouseEventHandler<HTMLLabelElement> 
}) {

    const [isMouseOver, setIsMouseOver] = useState(false)

    const srcControl = variant === "single" 
        ? <Radio color="secondary" /> 
        : <Checkbox color="secondary" />

    return (
        <FormControlLabel 
            value={value}
            label={option.text}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            style={isMouseOver ? {textDecoration: "underline"} : {}}
            onClick={onClick}
            control={srcControl}
        />
    )
}

function SubmitButtons({
    onShowResultClick,
    loading,
    disabled
}: {
    onShowResultClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
    loading?: boolean,
    disabled?: boolean,
}) {
    const isSmallScreen: boolean = useMediaQuery("(max-width: 360px)")

    const buttonSize = isSmallScreen ? "small" : "medium"

    const buttonMinWidth = isSmallScreen ? "112px" : "120px"
    const buttonStyle: React.CSSProperties = { minWidth: buttonMinWidth }

    return (
        <Stack direction="row" justifyContent="space-between">
            <LoadingButton
                type="submit"
                loading={loading}
                startIcon={<HowToVoteIcon />}
                variant="contained"
                size={buttonSize}
                disabled={disabled}
                style={buttonStyle}
            >
                Stem
            </LoadingButton>
            <Button
                startIcon={<BarChartIcon />}
                color="secondary"
                variant="outlined"
                size={buttonSize}
                disabled={loading}
                onClick={onShowResultClick}
                style={buttonStyle}
            >
                resultat
            </Button>
        </Stack>
    )
}

function MultipleChoicePollOptions( {poll}: {poll: PollWithOption}) {
    return (
        <>Todo: Implement Multiple choice...</>
    )
}

function PollResult( {poll}: {poll: PollWithOption}) {
    return (
        <>Todo: Show Results...</>
    )
}