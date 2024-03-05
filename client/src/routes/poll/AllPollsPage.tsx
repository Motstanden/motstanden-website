import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, useTheme } from "@mui/material";
import { usePolls } from "./Context";
import { PollContent } from "./components/PollContent";


export function AllPollsPage() {
    const theme = useTheme();
    const { polls } = usePolls()

    if (polls.length <= 0)
        return <></>;

    return (
        <>
            <h1>Avstemning</h1>
            <div style={{
                maxWidth: "900px"
            }}>
                {polls.map((poll) => (
                    <div key={poll.id}>
                        <Accordion
                            disableGutters
                            elevation={0}
                            style={{
                                display: "inline-block",
                                minWidth: "MIN(100%, 500px)",
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
                                <span style={{ marginLeft: "10px" }}>
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
                                <PollContent poll={poll} />
                            </AccordionDetails>
                        </Accordion>
                    </div>
                ))}
            </div>
        </>
    );
}
