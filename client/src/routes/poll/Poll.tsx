import { Accordion, AccordionDetails, AccordionSummary, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Poll, PollOption, PollWithOption } from "common/interfaces"
import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { fetchAsync } from "src/utils/fetchAsync"

export default function PollPage(){
    const polls = useOutletContext<Poll[]>()
    const [currentPoll, ...remainingPolls] = polls

    return(
        <div>
            <h1>Avstemminger</h1>
            <CurrentPoll poll={currentPoll}/>
            <PreviousPolls polls={remainingPolls}/>
        </div>
    )
}

function CurrentPoll( { poll }: { poll: Poll }){
    return(
        <div>
            <h3>
                {poll.title}
            </h3>
            <PollOptions poll={poll}/>
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
        <RadioGroup value={selectedIndex}>
            {poll.options.map((option, index) => (
                <FormControlLabel 
                    key={index}
                    value={index}
                    label={option.text}
                    onClick={() => setSelectedIndex(index)}
                    control={<Radio color="secondary" />}
                    />
            ))}
        </RadioGroup>
    )
}

function MultipleChoicePollOptions( {poll}: {poll: PollWithOption}) {
    return (
        <>Multiple choice...</>
    )
}

function PollResult( {poll}: {poll: PollWithOption}) {
    return (
        <>Results...</>
    )
}