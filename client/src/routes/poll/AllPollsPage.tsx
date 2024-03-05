import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Paper, Stack, Theme } from "@mui/material";
import { CommentEntityType } from "common/enums";
import { Poll } from "common/interfaces";
import { useState } from "react";
import { CommentSection } from "src/components/CommentSection";
import { useIsMobileScreen } from "src/layout/useAppSizes";
import { usePolls } from "./Context";
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

    const isMobile = useIsMobileScreen()

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const onMenuOpen = () => setIsMenuOpen(true);
    const onMenuClose = () => setIsMenuOpen(false);

    const {deletePoll, isDeleting} = useDeletePollFunction(poll);

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
                    width: "100%",
                    borderBottomWidth: "0px",
                    borderBottomStyle: "solid",
                    backgroundColor: "transparent",
                    borderRadius: "0px",
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    sx={{
                        backgroundColor: (theme: Theme) => isMenuOpen ? theme.palette.action.hover : "transparent",
                        flexDirection: "row-reverse",
                        py: "0px",
                        px: {xs: "2px", sm: "6px", md: "10px"},
                        ml: {xs: "-6px", md: "0px"},
                        fontSize: isMobile ? "normal" : "large",
                        fontWeight: "bold",
                        borderRadius: "15px",
                        ":hover": { 
                            bgcolor: (theme: Theme) => theme.palette.action.hover,
                        }
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
                        <Box sx={{ ml: { xs: "2px", sm: "6px", md: "10px"} }}>
                            {poll.title}
                        </Box>
                        <div onClick={onMenuClick}>
                            <PollMenu 
                                poll={poll} 
                                onDeleteClick={deletePoll}
                                onMenuOpen={onMenuOpen}
                                onMenuClose={onMenuClose}
                                sx={{
                                    p: {xs: "4px", md: "6px" },
                                    my: {xs: "-2px", md: "-3px"},
                                    mx: {xs: "0px", md: "10px"}
                                }}
                            />
                        </div>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails 
                    sx={{ 
                        maxWidth: "600px",
                        mx: {xs: -1, sm: 0, md: 4},
                    }}>
                    <Paper
                        elevation={4} 
                        sx={{
                            py: {xs: 2},
                            px: {xs: 2, md: 3},
                            mt: 2,
                            mb: 6
                    }}>
                        <PollContent poll={poll} /> 
                    </Paper>
                    <CommentSection
                        entityType={CommentEntityType.Poll}
                        entityId={poll.id}
                        variant="compact"
                    />                   
                    <Divider sx={{mt: 5, mb: 2}}/>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
