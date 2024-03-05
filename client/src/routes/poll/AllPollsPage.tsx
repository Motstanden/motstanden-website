import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Theme } from "@mui/material";
import { Poll } from "common/interfaces";
import { pollListQueryKey, usePolls } from "./Context";
import { PollContent } from "./components/PollContent";
import { PollMenu } from "./components/PollMenu";
import { useDeletePollFunction } from "./components/useDeletePollFunction";


export function AllPollsPage() {
    const { polls } = usePolls()

    if (polls.length <= 0)
        return <></>;

    return (
        <>
            <h1>Avstemning</h1>
            <div style={{
                maxWidth: "900px",
                marginTop: "-10px"
            }}>
                {polls.map((poll) => (
                    <AccordionItem 
                        key={poll.id} 
                        poll={poll} />
                ))}
            </div>
        </>
    );
}

function AccordionItem( {poll}: {poll: Poll}) {

    const {deletePoll, isDeleting} = useDeletePollFunction(poll, pollListQueryKey);

    const onMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation() // Stop the click event from bubling and then toggle the expansion of the accordion
    }

    // Delete optimisticly.
    // Todo: Handle the case were the delete fails.
    if(isDeleting)
        return <></>

    return (
        <div>
            <Accordion
                disableGutters
                elevation={0}
                style={{
                    display: "inline-block",
                    width: "100%",
                    borderBottomWidth: "0px",
                    borderBottomStyle: "solid",
                    backgroundColor: "transparent",
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
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        style={{
                            width: "100%",
                        }}
                    >
                        <div style={{ marginLeft: "10px" }}>
                            {poll.title}
                        </div>
                        <div onClick={onMenuClick}>
                            <PollMenu 
                                poll={poll} 
                                onDeleteClick={deletePoll}
                            />
                        </div>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        borderLeftWidth: "1px",
                        borderLeftStyle: "solid",
                        borderLeftColor: (theme: Theme) => theme.palette.divider,
                        padding: "0px 10px 20px 30px",
                        marginLeft: "12px",
                    }}>  
                    <PollContent poll={poll} />                    
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
