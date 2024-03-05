import HowToRegIcon from '@mui/icons-material/HowToReg';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Button, Link, useTheme } from "@mui/material";
import { PollOption, PollWithOption } from "common/interfaces";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { buildUrlParams } from './VoterListModal';

export function PollResult({ 
    poll, 
    onChangeVoteClick 
}: { 
    poll: PollWithOption; 
    onChangeVoteClick: React.MouseEventHandler<HTMLButtonElement>; 
}) {

    const userHasVoted = poll.options.find(option => option.isVotedOnByUser) !== undefined;
    const totalVotes = poll.options.reduce((accumulated, option) => accumulated + option.voteCount, 0);

    return (
        <div>
            <div>
                {poll.options.map((option, index) => (
                    <PollResultItem
                        key={index}
                        pollId={poll.id}
                        option={option}
                        totalVotes={totalVotes}
                        optionIndex={index}
                        style={{
                            marginBottom: "25px",
                        }} />
                ))}
            </div>
            <div style={{ marginTop: "40px", marginBottom: "1em" }}>
                <Button
                    variant="outlined"
                    color="secondary"
                    style={{ minWidth: "120px" }}
                    startIcon={<HowToVoteIcon />}
                    onClick={onChangeVoteClick}
                >
                    {userHasVoted ? "Endre stemme" : "Avgi stemme"}
                </Button>
            </div>
        </div>
    );
}

function PollResultItem({
    pollId, option, totalVotes, optionIndex, style,
}: {
    pollId: number;
    option: PollOption;
    totalVotes: number;
    optionIndex: number;
    style?: React.CSSProperties;
}) {
    const theme = useTheme();
    const percentage = totalVotes <= 0 ? 0 : option.voteCount / totalVotes * 100;
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
                        }} />
                )}
            </div>
            <BarChartItem
                percentage={percentage}
                voteCount={option.voteCount}
                voterListModalUrl={`?${buildUrlParams(pollId, optionIndex)}`} />
        </div>
    );
}

function BarChartItem({
    percentage, voteCount, voterListModalUrl
}: {
    percentage: number;
    voteCount: number;
    voterListModalUrl: string;
}) {
    const theme = useTheme();
    let newPercentage = Math.max(Math.min(Math.round(percentage), 100)); // Round value to nearest integer between 0 and 100
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
                <Link
                    underline='hover'
                    color="secondary"
                    to={voterListModalUrl}
                    component={RouterLink}
                >
                    {voteCount} {voteCount === 1 ? "stemme" : "stemmer"}
                </Link>
            </div>
        </div>
    );
}
