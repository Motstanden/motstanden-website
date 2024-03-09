import BarChartIcon from '@mui/icons-material/BarChart';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { LoadingButton } from "@mui/lab";
import { Button, Checkbox, FormControlLabel, FormGroup, Radio, RadioGroup, Stack, SxProps, useMediaQuery } from "@mui/material";
import { PollOption, PollWithOption } from "common/interfaces";
import React, { useState } from "react";

export function VoteForm({
    poll, onShowResultClick, onSubmit,
}: {
    poll: PollWithOption;
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement>;
    onSubmit: (selectedItems: PollOption[]) => Promise<void>;
}) {

    const [selectedItems, setSelectedItems] = useState<PollOption[]>(poll.options.filter(option => option.isVotedOnByUser));
    const [isLoading, setIsLoading] = useState(false);

    const onFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        await onSubmit(selectedItems);

        setIsLoading(false);
    };

    const onItemClicked = (item: PollOption, index: number) => {
        if (poll.type === "single") {
            setSelectedItems([item]);
            return;
        }

        const newItems = [...selectedItems];
        if (newItems.includes(item)) {
            newItems.splice(newItems.indexOf(item), 1);
        }
        else {
            newItems.push(item);
        }

        setSelectedItems(newItems);
    };

    return (
        <form onSubmit={onFormSubmit}>
            <OptionItemGroup
                variant={poll.type}
                style={{ marginLeft: "5px" }}>
                {poll.options.map((option, index) => (
                    <OptionItem
                        key={index}
                        value={index}
                        option={option}
                        variant={poll.type}
                        checked={selectedItems.includes(option)}
                        onClick={() => onItemClicked(option, index)} 
                        sx={{
                            mb: "6px"
                        }}/>
                ))}
            </OptionItemGroup>
            <div style={{ marginTop: "30px", marginBottom: "15px" }}>
                <SubmitButtons
                    onShowResultClick={onShowResultClick}
                    disabled={selectedItems.length <= 0}
                    loading={isLoading} />
            </div>
        </form>
    );
}

function OptionItemGroup({ children, variant, style }: { children: React.ReactNode; variant: "single" | "multiple"; style?: React.CSSProperties; }) {
    if (variant === "single") {
        return (
            <RadioGroup style={style}>
                {children}
            </RadioGroup>
        );
    }

    return (
        <FormGroup style={style}>
            {children}
        </FormGroup>
    );
}

export function OptionItem({
    option, 
    value, 
    variant, 
    onClick, 
    checked,
    disabled,
    sx,
    controlSx,
}: {
    option: PollOption;
    value: unknown;
    variant: "single" | "multiple";
    onClick?: React.MouseEventHandler<HTMLLabelElement>;
    checked?: boolean;
    disabled?: boolean;
    sx?: SxProps;
    controlSx?: SxProps;
}) {

    const srcControl = variant === "single"
        ? <Radio color="secondary" checked={checked} disabled={disabled} sx={controlSx}/>
        : <Checkbox color="secondary" checked={checked} disabled={disabled} sx={controlSx}/>;

    const onControlClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <FormControlLabel
            value={value}
            label={option.text}
            disabled={disabled}
            onClick={onControlClick}
            control={srcControl} 
            sx={{
                ":hover": {
                    textDecoration: "underline"
                },
                '&.Mui-disabled': {
                    textDecoration: "none",
                    '.MuiFormControlLabel-label': { 
                        color: 'inherit' 
                    },
                },
                ...sx
            }}
            />
    );
}

function SubmitButtons({
    onShowResultClick, loading, disabled
}: {
    onShowResultClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
    loading: boolean;
    disabled: boolean;
}) {
    const isSmallScreen: boolean = useMediaQuery("(max-width: 360px)");

    const buttonSize = isSmallScreen ? "small" : "medium";

    const buttonMinWidth = isSmallScreen ? "112px" : "120px";
    const buttonStyle: React.CSSProperties = { minWidth: buttonMinWidth };

    return (
        <Stack direction="row" justifyContent="space-between">
            <LoadingButton
                type="submit"
                loading={loading}
                startIcon={<HowToVoteIcon />}
                variant="contained"
                size={buttonSize}
                disabled={disabled}
                style={buttonStyle}
            >
                Stem
            </LoadingButton>
            <Button
                startIcon={<BarChartIcon />}
                color="secondary"
                variant="outlined"
                size={buttonSize}
                disabled={loading}
                onClick={onShowResultClick}
                style={buttonStyle}
            >
                resultat
            </Button>
        </Stack>
    );
}
