import React from "react";

export function NewlineText({ text }: { text: string; }) {
    const lines = text.split('\n');
    return (
        <div>
            {lines.map((str, i) => (
                <React.Fragment key={i}>
                    <div style={{ minHeight: "10px" }}>
                        {str}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}
