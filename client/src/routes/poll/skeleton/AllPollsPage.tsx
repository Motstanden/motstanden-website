import { Skeleton, Stack } from "@mui/material";

export {
    AllPollsPage as AllPollsPageSkeleton,
    PollItem as PollAccordionItemSkeleton
};

function AllPollsPage() {
    return (
        <div>
            <div style={{
                marginBottom: "40px",
                maxWidth: "870px",
            }}>
                <PollList/>
            </div>
        </div>
    );
}

function PollList( { length = 17 }: {length?: number}) {
    return Array(length).fill(1).map((_, index) => (
        <PollItem key={index}/>
    ))
}

function PollItem() {
    return (
        <div>
            <Stack 
                direction="row" 
                alignItems="center"
                gap="10px"
                sx={{
                    mb: {xs: "9px", sm: "13px", md: "17px"},
                    mx: {xs: "0px", md: "10px"}
                }}
                >
                <Skeleton 
                    variant="circular"
                    width="25px"
                    height="23px"
                />
                <Skeleton
                    variant="text"
                    height="40px"
                    width="100%"
                    />
            </Stack>
        </div>
    )
}