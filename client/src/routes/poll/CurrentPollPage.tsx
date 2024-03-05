import { useTitle } from 'src/hooks/useTitle';
import { pollListQueryKey, usePolls } from './Context';
import { PollCard } from './components/PollCard';

export default function CurrentPollPage(){
    useTitle("Avstemninger")


    return(
        <div>
            <h1>Avstemning</h1>
            <div style={{
                    display: "inline-block",
                    minWidth: "MIN(100%, 500px)",
                    maxWidth: "800px"
                }}>
                <Poll/>
            </div>

            {/* This comment section is coming soon™ */}
            {/* <Divider sx={{ my: 4 }} />
            <CommentSection 
                entityType={CommentEntityType.Poll}
                entityId={currentPoll.id}            
                />
            <Divider sx={{ my: 4 }} /> */}
        </div>
    )
}

function Poll() {
    const { currentPoll } = usePolls()

    if(currentPoll === undefined) {
        return (
            <div style={{
                marginBlock: "40px", 
                opacity: 0.8
            }}>
                Ingen avsteminger funnet...
            </div>
        )
    }
    
    return (
        <PollCard poll={currentPoll} srcQueryKey={pollListQueryKey}/>
    )
}