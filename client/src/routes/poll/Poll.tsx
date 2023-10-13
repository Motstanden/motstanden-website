import BarChartIcon from '@mui/icons-material/BarChart'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import { LoadingButton } from "@mui/lab"
import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, FormControl, FormControlLabel, Radio, RadioGroup, Skeleton, Stack, useMediaQuery, useTheme } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Poll, PollOption, PollWithOption } from "common/interfaces"
import React, { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { AuthorInfo } from 'src/components/AuthorInfo'
import { TitleCard } from "src/components/TitleCard"
import { useTitle } from 'src/hooks/useTitle'
import { fetchAsync } from "src/utils/fetchAsync"
import { postJson } from 'src/utils/postJson'

export default function PollPage(){
    useTitle("Avstemninger")
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
            <TitleCard title={poll.title} paddingTop={0.5}>
                <PollContent poll={poll}/>
            </TitleCard>
        </div>
    )
}

function PreviousPolls( {polls}: { polls: Poll[] }) {

    const theme = useTheme()

    return (
        <>
            <h2>Tidligere avstemninger</h2>
            {polls.map((poll) => (
                <div key={poll.id}  >
                    <Accordion 
                        TransitionProps={{ unmountOnExit: true  }} 
                        disableGutters
                        elevation={0}
                        style={{ 
                            display: "inline-block",
                            minWidth: "MIN(100%, 500px)",
                            borderBottomWidth: "0px",
                            borderBottomStyle: "solid",
                            borderBottomColor: theme.palette.divider,
                            borderRadius: "0px",
                        }}
                        >
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            style={{
                                backgroundColor: "transparent",
                                flexDirection: "row-reverse", 
                                padding: "0px",
                                margin: "0px",
                                fontSize: "large",
                                fontWeight: "bold",
                            }}
                        >
                            <span style={{marginLeft: "10px"}}>
                                {poll.title}
                            </span>
                        </AccordionSummary>
                        <AccordionDetails
                            style={{
                                borderLeftWidth: "1px",
                                borderLeftStyle: "solid",
                                borderLeftColor: theme.palette.divider,
                                padding: "0px 10px 20px 30px",
                                marginLeft: "12px"
                            }}
                        >
                            <PollContent poll={poll}/>
                        </AccordionDetails>
                    </Accordion>
                </div>
            ))}
        </>
    )
}

function PollContent({poll}: {poll: Poll}) {
    return (
        <div>
            <div style={{marginBottom: "15px"}}>
                <AuthorInfo 
                    createdAt={poll.createdAt}
                    createdByUserId={poll.createdBy}
                    createdByUserName={poll.createdByName}
                    updatedAt={poll.updatedAt}
                    updatedByUserId={poll.updatedBy}
                    updatedByUserName={poll.updatedByName}
                />
            </div>
            <PollOptions poll={poll}/>
        </div>
    )
}

function PollOptions( {poll}: {poll: Poll} ) {
    const queryKey = [ poll.id, "FetchPollOptions"]
    
    const {isLoading, isError, data, error} = useQuery<PollOption[]>( queryKey, () => fetchAsync<PollOption[]>(`/api/polls/${poll.id}/options`))
    
    const queryClient = useQueryClient()
    const onSubmitSuccess = async () => await queryClient.invalidateQueries(queryKey)

    if(isLoading)
        return <PollOptionsSkeleton/>

    if(isError)
        return <div style={{minHeight: "300px"}}>{`${error}`}</div>

    const pollData: PollWithOption = {
        ...poll,
        options: data
    }

    return <PollOptionsRenderer poll={pollData} onSubmitSuccess={onSubmitSuccess}/>
}

function PollOptionsSkeleton( { length }: {length?: number}) {
    length = length ?? 3
    return (
        <div>
            {Array(length).fill(1).map( (_, index) => (
                <div 
                    key={index}
                    style={{
                        marginBottom: "20px"
                    }} 
                >
                    <Skeleton 
                        variant="text"
                        style={{
                            width: "200px",
                            height: "32px"
                        }}
                    />
                    <Skeleton 
                        variant="rounded"
                        style={{
                            height: "40px",
                        }}
                    />
                </div> 
            ))}
            <Skeleton 
                variant="rounded"
                style={{
                    height: "30px",
                    width: "160px",
                    marginTop: "30px",
                    marginBottom: "15px"
                }}
            />
        </div>
    )
 }


function PollOptionsRenderer( {poll, onSubmitSuccess}: {poll: PollWithOption, onSubmitSuccess: () => Promise<void>}) {

    const [showResult, setShowResult] = useState(poll.options.find(option => option.isVotedOnByUser) !== undefined) 

    const onShowResultClick = () => setShowResult(true)
    const onExitResultClick = () => setShowResult(false)

    const onSubmit = async (selectedItems: PollOption[]) => { 

        const url = `/api/polls/${poll.id}/vote/upsert`
        const optionIds: number[] = selectedItems.map(item => item.id)

        const response = await postJson(url, optionIds, { alertOnFailure: true})

        if(response && response.ok)
        {
            await onSubmitSuccess()
            setShowResult(true)
        }
    }

    if(showResult)
        return <PollResult poll={poll} onExitResultClick={onExitResultClick}  />

    if(poll.type === "multiple")
        return <MultipleChoicePollOptions poll={poll} onShowResultClick={onShowResultClick} onSubmit={onSubmit}/>
    
    return <SingleChoicePollOptions poll={poll} onShowResultClick={onShowResultClick} onSubmit={onSubmit} />
}

interface PollChoiceProps {
    poll: PollWithOption,
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement>,
    onSubmit: (selectedItems: PollOption[]) => Promise<void>
}

function SingleChoicePollOptions(props: PollChoiceProps) {

    const {poll, onShowResultClick} = props
    const [selectedIndex, setSelectedIndex] = useState(poll.options.findIndex( p => p.isVotedOnByUser))
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const selectedItems = [ poll.options[selectedIndex] ]
        await props.onSubmit(selectedItems)
        
        setIsLoading(false)
    }

    return (
        <form onSubmit={onSubmit}>
            <FormControl style={{marginLeft: "5px"}}>
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
            <div style={{marginTop: "30px", marginBottom: "15px"}}>
                <SubmitButtons 
                    onShowResultClick={onShowResultClick} 
                    disabled={selectedIndex < 0} 
                    loading={isLoading} 
                />
            </div>
        </form>
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
    loading: boolean,
    disabled: boolean,
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
                    <PollResultItem 
                        key={index} 
                        option={option} 
                        totalVotes={totalVotes}
                        style={{ 
                            marginBottom: "25px", 
                        }}
                    />
                ))}
            </div>
            <div style={{marginTop: "40px", marginBottom: "1em"}}>
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

function PollResultItem( {option, totalVotes, style}: {option: PollOption, totalVotes: number, style?: React.CSSProperties}){
    const theme = useTheme()
    return (
        <div style={style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "2px",
            }}>
                <span style={{
                    marginLeft: "2px",
                    fontSize: "1.1em",
                }}>
                    {option.text}
                </span>
                {option.isVotedOnByUser && ( 
                    <HowToRegIcon 
                        style={{
                            color: theme.palette.primary.light, 
                            marginRight: "1px" 
                        }}/>
                )}
            </div>
            <BarChartItem 
                percentage={option.voteCount / totalVotes * 100} 
                voteCount={option.voteCount}
                />
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