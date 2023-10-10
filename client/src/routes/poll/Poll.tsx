import BarChartIcon from '@mui/icons-material/BarChart'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import { LoadingButton } from "@mui/lab"
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, Stack, useMediaQuery, useTheme } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Poll, PollOption, PollWithOption } from "common/interfaces"
import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { TitleCard } from "src/components/TitleCard"
import { fetchAsync } from "src/utils/fetchAsync"

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

    return <PollOptionsRenderer poll={pollData}/>
}

function PollOptionsRenderer( {poll}: {poll: PollWithOption}) {

    const [showResult, setShowResult] = useState(poll.options.find(option => option.isVotedOnByUser) !== undefined) 

    const onShowResultClick = () => setShowResult(true)
    const onExitResultClick = () => setShowResult(false)

    if(showResult)
        return <PollResult poll={poll} onExitResultClick={onExitResultClick}  />

    if(poll.type === "multiple")
        return <MultipleChoicePollOptions poll={poll} onShowResultClick={onShowResultClick}/>
    
    return <SingleChoicePollOptions poll={poll} onShowResultClick={onShowResultClick} />
}

interface PollChoiceProps {
    poll: PollWithOption,
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement>,
}

function SingleChoicePollOptions(props: PollChoiceProps) {

    const {poll, onShowResultClick} = props

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
                <SubmitButtons onShowResultClick={onShowResultClick} />
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
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement> | undefined
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

function MultipleChoicePollOptions(poll: PollChoiceProps) {
    return (
        <>Todo: Implement Multiple choice...</>
    )
}

function PollResult( {poll, onExitResultClick}: {poll: PollWithOption, onExitResultClick: React.MouseEventHandler<HTMLButtonElement>}) {

    const userHasVoted = poll.options.find(option => option.isVotedOnByUser) !== undefined
    const totalVotes = poll.options.reduce((accumulated, option) => accumulated + option.voteCount, 0)

    return (
        <div>
            <div>
                {poll.options.map((option, index) => (
                    <div 
                        key={index} 
                        style={{ marginBottom: "25px" }}
                    >
                        <div style={{
                            marginLeft: "2px",
                            fontSize: "1.1em",
                        }}>
                            {option.text}
                        </div>
                        <BarChartItem 
                            percentage={option.voteCount / totalVotes * 100} 
                            voteCount={option.voteCount}
                            />
                    </div>
                ))}
            </div>
            <div style={{marginTop: "1em", marginBottom: "1em"}}>
                <Button 
                    variant="outlined"
                    color="secondary"
                    style={{minWidth: "120px"}}
                    startIcon={<HowToVoteIcon />}
                    onClick={onExitResultClick}
                    >
                        {userHasVoted ? "Endre stemme" : "Avgi stemme"}
                </Button>
            </div>
        </div>
    )
}

function BarChartItem( {percentage, voteCount}: {percentage: number, voteCount: number}){
    const theme = useTheme();
    let newPercentage =  Math.max(Math.min(Math.round(percentage), 100))  // Round value to nearest integer between 0 and 100
    
    return (
        <div style={{
            height: "40px",
            width: "100%",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: theme.palette.grey[600],
            borderRadius: "4px",
            position: "relative",
        }}>
            <div style={{
                height: "100%",
                width: `${newPercentage}%`,
                backgroundColor: theme.palette.primary.light,
                borderRadius: "3px",
            }}>
            </div>
            <div style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: "10px",
                fontWeight: "bold",
                color: theme.palette.text.secondary,
                fontSize: "1.1em"
            }}>
                {newPercentage}%
            </div>
            <div style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: "10px",
                fontSize: "small",
                fontWeight: "light",
                color: theme.palette.text.secondary,
            }}>
                {voteCount} stemmer
            </div>
        </div>
    )
}