import { Paper, Stack, useTheme } from "@mui/material";
import { Comment } from "common/interfaces";
import dayjs from "dayjs";
import { LinkifiedText } from 'src/components/LinkifiedText';
import { relativeTimeShortFormat } from 'src/context/Locale';
import { LikeButton } from '../likes/LikeButton';
import { LikeListIconButton } from '../likes/LikeListButton';
import { UserAvatar } from '../user/UserAvatar';
import { UserFullName } from '../user/UserFullName';
import { CommentSectionVariant } from "./CommentSection";

export function CommentItem({
    comment, style, variant,
}: {
    comment: Comment;
    style?: React.CSSProperties;
    variant?: CommentSectionVariant;
}) {
    const theme = useTheme();
    return (
        <Stack
            direction="row"
            spacing={variant === "normal" ? 2 : 1}
            style={style}
        >
            <UserAvatar
                userId={comment.createdBy}
                style={{
                    marginTop: "5px"
                }} />
            <div style={{
                width: variant === "normal" ? "100%" : undefined,
            }}>
                <div
                    style={{
                        backgroundColor: theme.palette.divider,
                        minWidth: "130px",
                        padding: variant === "normal" ? "12px" : "7px 14px 10px 14px",
                        borderRadius: variant === "normal" ? "10px" : "16px",
                        position: "relative"
                    }}
                >
                    <div>
                        <UserFullName
                            userId={comment.createdBy}
                            style={{
                                fontSize: variant === "normal" ? "inherit" : "small",
                            }} />
                    </div>
                    <div
                        style={{
                            whiteSpace: "pre-line"
                        }}>
                        <LinkifiedText>
                            {comment.comment}
                        </LinkifiedText>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            right: "0px",
                            zIndex: 1
                        }}
                    >
                        <Paper
                            style={{
                                borderRadius: "30px",
                                lineHeight: "0px",
                                padding: "0px",
                                margin: "0px",
                            }}
                            elevation={4}
                        >
                            <LikeListIconButton
                                maxItems={2}
                                style={{
                                    borderRadius: "30px",
                                    fontSize: "13pt",
                                    lineHeight: "15pt",
                                    padding: "0px 2px 1px 2px",
                                }} />
                        </Paper>
                    </div>
                </div>
                <div>
                    <span>
                        <LikeButton
                            style={{
                                fontSize: "small",
                                marginInline: "4px",
                                minWidth: "40px",
                            }} />
                    </span>
                    <span
                        style={{
                            fontSize: "small",
                            opacity: "0.6",
                        }}
                    >
                        {dayjs.utc(comment.createdAt).locale(relativeTimeShortFormat).fromNow()}
                    </span>
                </div>
            </div>
        </Stack>
    );
}
