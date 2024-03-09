import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { Button, Grow, LinearProgress, Link, Stack, SxProps } from "@mui/material";
import { PollOption, PollWithOption } from "common/interfaces";
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import useOnScreen from 'src/hooks/useOnScreen';
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

    const optionsRef = React.useRef<HTMLDivElement>(null);
    const startAnimation = useOnScreenAnimation(optionsRef, /*Delay: */ 200);

    return (
        <div>
            <div 
                ref={optionsRef}
                style={{ 
                    marginLeft: "5px"
                }}>
                {poll.options.map((option, index) => (
                    <PollResultItem
                        key={index}
                        pollId={poll.id}
                        option={option}
                        totalVotes={totalVotes}
                        optionIndex={index}
                        variant={poll.type}
                        startAnimation={startAnimation}
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
    startAnimation = true,
    animationDuration = 500
}: {
    pollId: number;
    option: PollOption;
    totalVotes: number;
    optionIndex: number;
    variant: "single" | "multiple";
    style?: React.CSSProperties;
    startAnimation: boolean;
    animationDuration?: number;
}) {

    const exactPercentage = totalVotes <= 0 ? 0 : option.voteCount / totalVotes * 100;
    const percentage = Math.max(Math.min(Math.round(exactPercentage), 100));

    return (
        <div style={style}>
            <OptionItem
                option={option}
                value={""}
                variant={variant}
                checked={option.isVotedOnByUser}
                disabled
                controlSx={{py: "0px"}}
            />
            <ProgressBar 
                animationDuration={animationDuration}
                percentage={percentage}
                startAnimation={startAnimation}
                sx={{
                    ml: "32px",
                }}
            />
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

function ProgressBar({
    percentage, 
    animationDuration,
    startAnimation = true,
    sx
}: {
    percentage: number, 
    animationDuration: number
    startAnimation?: boolean, 
    sx?: SxProps
}) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                lineHeight: "100%",
                ...sx
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
                }} />
            <Stack direction="column">
                <div style={{
                    whiteSpace: "nowrap",
                    fontSize: "x-small"
                }}>
                    <AnimatedNumber value={startAnimation ? percentage : 0} duration={animationDuration} />%
                </div>
            </Stack>
        </Stack>
    )
}

function useOnScreenAnimation(ref: React.RefObject<HTMLDivElement>, delay: number = 200) { 
    const isVisible = useOnScreen(ref);

    const [startAnimation, setStartAnimation] = useState(false);
    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;

        if(!startAnimation) {
            timeout = setTimeout(() => { 
                if (isVisible) {
                    setStartAnimation(true);
                }
            }, delay);
        }

        return () => timeout && clearTimeout(timeout);
    }, [isVisible]);

    return startAnimation
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