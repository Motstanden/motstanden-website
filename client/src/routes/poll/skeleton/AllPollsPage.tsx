import { Skeleton, Stack } from "@mui/material";

export { 
    AllPollsPage as AllPollsPageSkeleton,
    PollItem as PollAccordionItemSkeleton 
};

function AllPollsPage() {
    return (
        <div>
            <h1>Avstemning</h1>
            <div style={{
                marginBottom: "40px",
                maxWidth: "870px",
                marginLeft: "1px"
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
                style={{
                    marginBottom: "17px",
                    marginLeft: "10px",
                    width: "100%"
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