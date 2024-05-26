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
            <div style={{
                    display: "inline-block",
                    minWidth: "MIN(100%, 500px)",
                    maxWidth: "800px"
                }}>
                <CurrentPoll/>
            </div>
            <PollCommentSection poll={currentPoll}/>
        </div>
    )
}

function CurrentPoll() {
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
        <div style={{maxWidth: "700px", marginTop: "60px"}}>
            <CommentSection 
                entityType={CommentEntityType.Poll}
                entityId={poll.id}            
                />
        </div>
    )
}