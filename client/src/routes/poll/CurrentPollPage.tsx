import { Divider } from '@mui/material';
import { CommentEntityType } from 'common/enums';
import { Poll } from "common/interfaces";
import { CommentSection } from 'src/components/CommentSection';
import { useTitle } from 'src/hooks/useTitle';
import { usePolls } from './Context';
import { PollCard } from './components/PollCard';

export default function CurrentPollPage(){
    useTitle("Avstemninger")

    const { currentPoll } = usePolls()

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
            <PollCommentSection poll={currentPoll}/>
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
        <PollCard poll={currentPoll}/>
    )
}

export function PollCommentSection({poll}: {poll?: Poll}) {

    if(poll === undefined) {
        return <></>
    }

    return (
        <div style={{maxWidth: "700px"}}>
            <Divider sx={{ my: 6 }} />
            <CommentSection 
                entityType={CommentEntityType.Poll}
                entityId={poll.id}            
                />
        </div>
    )
}