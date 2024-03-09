import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Button, Grow, LinearProgress, Link, Stack } from "@mui/material";
import { PollOption, PollWithOption } from "common/interfaces";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useTimeout from 'src/hooks/useTimeout';
import { OptionItem } from './VoteForm';
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
            <div style={{ marginLeft: "5px"}}>
                {poll.options.map((option, index) => (
                    <PollResultItem
                        key={index}
                        pollId={poll.id}
                        option={option}
                        totalVotes={totalVotes}
                        optionIndex={index}
                        variant={poll.type}
                        style={{
                            marginBottom: "10px",
                        }} />
                ))}
            </div>
            <div style={{ marginTop: "30px", marginBottom: "15px" }}>
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
    pollId,
    option,
    totalVotes,
    optionIndex,
    variant,
    style,
}: {
    pollId: number;
    option: PollOption;
    totalVotes: number;
    optionIndex: number;
    variant: "single" | "multiple";
    style?: React.CSSProperties;
}) {
    const [startAnimation, setStartAnimation] = useState(false);
    useTimeout(() => setStartAnimation(true), 200)

    const exactPercentage = totalVotes <= 0 ? 0 : option.voteCount / totalVotes * 100;
    const percentage = Math.max(Math.min(Math.round(exactPercentage), 100));
    const animationDuration = 500;

    return (
        <div style={style}>
            <OptionItem
                option={option}
                value={null}
                variant={variant}
                checked={option.isVotedOnByUser}
                disabled
                controlSx={{py: "0px"}}
            />
            <Stack 
                direction="row" 
                alignItems="center"
                sx={{
                    ml: "32px",
                    lineHeight: "100%",
                }}
                >
                <LinearProgress
                    variant='determinate'
                    value={startAnimation ? percentage : 0}
                    sx={{
                        height: "7px",
                        borderRadius: "20px",
                        width: "100%",
                        bgcolor: (theme) => theme.palette.action.hover,
                        ".MuiLinearProgress-bar": {
                            bgcolor: (theme) => theme.palette.primary.light,
                        },
                        '& .MuiLinearProgress-bar1Determinate': {
                            transitionDuration: `${animationDuration}ms`, // Set your desired duration here
                        },
                        mr: "10px",
                    }}
                />
                <Stack direction="column">
                    <div style={{
                        whiteSpace: "nowrap",
                        fontSize: "x-small"
                    }}>
                        <AnimatedNumber value={startAnimation ? percentage : 0} duration={animationDuration}/>%
                    </div>
                </Stack>
            </Stack>
            {option.voteCount > 0 && ( 
                <div style={{ 
                    textAlign: "left", 
                    lineHeight: "100%",
                    marginLeft: "33px",
                    marginTop: "-5px",
                }}>
                    <Link
                        underline='hover'
                        color="secondary"
                        to={`?${buildUrlParams(pollId, optionIndex)}`}
                        component={RouterLink}
                        style={{
                            whiteSpace: "nowrap",
                            fontSize: "x-small",
                            width: "100%",
                        }}
                    >
                        <AnimatedNumber value={startAnimation ? option.voteCount : 0} duration={animationDuration}/>
                        {option.voteCount === 1 ? " stemme" : " stemmer"}
                    </Link>
                </div>
            )}
        </div>
    );
}

function AnimatedNumber({ value, duration }: { value: number, duration: number }) {
    const [displayValue, setDisplayValue] = useState<number>(0);
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        let start: number | null = null;
        let frameId: number;

        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            setDisplayValue(Math.min(value * (progress / duration), value));
            if (progress < duration) {
                frameId = window.requestAnimationFrame(step);
            }
        };
        frameId = window.requestAnimationFrame(step);

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [value, duration]);

    useEffect(() => {
        setChecked(true);
    }, []);

    return (
        <Grow in={checked}>
            <span>
                {Math.round(displayValue)}
            </span>
        </Grow>
    );
};