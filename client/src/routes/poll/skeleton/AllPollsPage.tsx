import { Skeleton, Stack } from "@mui/material";

export { AllPollsPage as AllPollsPageSkeleton };

function AllPollsPage() {
    return (
        <div>
            <h1>Avstemning</h1>
            <div style={{
                marginBottom: "40px",
                display: "inline-block",
                minWidth: "MIN(100%, 500px)",
                maxWidth: "900px",
                marginLeft: "1px"
            }}>
                <PollList/>
            </div>
        </div>
    );
}

function PollList( { length = 17 }: {length?: number}) {
    return Array(length).fill(1).map((_, index) => (
        <div key={index}>
            <Stack 
                direction="row" 
                alignItems="center"
                gap="10px"
                style={{
                    marginBottom: "17px"
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
    ))
}