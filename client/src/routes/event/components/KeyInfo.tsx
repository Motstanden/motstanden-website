import React from "react";
import { Theme, useMediaQuery } from "@mui/material";
import { KeyValuePair } from "common/interfaces";
import dayjs from "dayjs";

export function KeyInfo({
    keyInfo, 
    startTime, 
    endTime, 
    style
}: {
    keyInfo: KeyValuePair<string, string>[],
    startTime: string           // yyyy-mm-dd hh:mm:ss
    endTime?: string | null     // yyyy-mm-dd hh:mm:ss
    style?: React.CSSProperties
}) {
    return (
        <KeyValueList 
            style={style}
            items={[
                { 
                    key: "Tid:", 
                    value: formatTimeInfo(startTime, endTime ?? null)
                },
                ...keyInfo
            ]}
    />
    )
}

function formatTimeInfo(startStr: string, endStr: string | null): string {
    const start = dayjs(startStr)

    const dayFormat = start.year() === dayjs().year() 
                    ? "ddd D. MMM" 
                    : "ddd D. MMM YYYY,"
    const hourFormat = "HH:mm"

    if(!endStr) {
        return `${start.format(dayFormat)} ${start.format(hourFormat)}`
    }

    const end = dayjs(endStr)
    const isSameDate = start.format("YYYY-MM-DD") === end.format("YYYY-MM-DD")
    const isSmallDiff = start.diff(end, "hours") < 24 && end.hour() < 6

    if(isSameDate || isSmallDiff) {
        return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(hourFormat)}`
    }
    return `${start.format(dayFormat)} kl: ${start.format(hourFormat)} – ${end.format(dayFormat)} kl: ${end.format(hourFormat)}`
}

function KeyValueList({ items, style }: { items: KeyValuePair<string, string>[]; style?: React.CSSProperties; }) {
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    if (items.length === 0) {
        return <></>;
    }

    // Small screen
    if (isSmallScreen) {
        return (
            <div style={{
                marginTop: "10px",
                marginBottom: "10px",
                ...style
            }}
            >
                {items.map((item, index) => (
                    <div
                        key={`${index} ${item.key} ${item.value}`}
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        <strong>{item.key + " "}</strong>
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>
        );
    }

    // Large screen
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "min-content auto",
            columnGap: "10px",
            rowGap: "5px",
            margin: "10px",
            ...style
        }}
        >
            {items.map((item, index) => (
                // We must use react fragment in order to access the key attribute 
                <React.Fragment key={`${index} ${item.key} ${item.value}`}>
                    <div style={{whiteSpace: "nowrap"}}>
                        <strong>{item.key}</strong>
                    </div>
                    <div>
                        {item.value}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
