import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Paper, Stack, SxProps, useTheme } from "@mui/material";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentEntityType } from 'common/enums';
import { Comment } from "common/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { LinkifiedText } from 'src/components/LinkifiedText';
import { useAuthenticatedUser } from "src/context/Authentication";
import { relativeTimeShortFormat } from 'src/context/Locale';
import { useIsMobileScreen } from 'src/layout/useAppSizes';
import { deleteRequest } from 'src/utils/deleteRequest';
import { patchRequest } from 'src/utils/patchRequest';
import { LikeButton } from '../likes/LikeButton';
import { LikeListIconButton } from '../likes/LikeListButton';
import { DeleteMenuItem } from "../menu/DeleteMenuItem";
import { EditMenuItem } from "../menu/EditMenuItem";
import { IconPopupMenu } from "../menu/IconPopupMenu";
import { UserAvatar } from '../user/UserAvatar';
import { UserFullName } from '../user/UserFullName';
import { EditCommentForm } from './EditCommentForm';
import { CommentSectionVariant } from "./types";

export function CommentItem({
    comment, 
    queryKey,
    entityType,
    style, 
    variant,
}: {
    comment: Comment,
    queryKey: QueryKey,
    entityType: CommentEntityType,
    style?: React.CSSProperties,
    variant?: CommentSectionVariant,
}) {
    const queryClient = useQueryClient()

    const editItem = useMutation({
        mutationFn: async (comment: Comment) => {
            const data: Pick<Comment, "comment"> = { 
                comment: comment.comment
            }
            return await patchRequest(`/api/${entityType}/comments/${comment.id}`, data)
        },
        onError: () => {
            window.alert("Fikk ikke til å redigere kommentaren.\nSi ifra til webansvarlig!")
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({ queryKey })
        }
    })

    const deleteItem = useMutation({
        mutationFn: async () => {
            return await deleteRequest(`/api/${entityType}/comments/${comment.id}`)
        },
        onError: () => {
            window.alert("Fikk ikke til å slette kommentaren.\nSi ifra til webansvarlig!")
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({ queryKey })
        }
    })

    const [isEditing, setIsEditing] = useState(false)

    const onEditClick = () => {
        setIsEditing(true)
    }

    const onPostEdit = (comment: Comment) => {
        editItem.mutate(comment)
        setIsEditing(false)
    }

    const onAbortEditClick = () => {
        setIsEditing(false)
    }

    const onDeleteClick = () => {
        if(window.confirm("Vil du permanent slette denne kommentaren?")) {
            deleteItem.mutate()
        }
    }

    if(deleteItem.isPending)
        return <></>

    return (
        <Stack
            direction="row"
            spacing={variant === "normal" ? 2 : 1}
            style={style}
            aria-label='Kommentar'
            sx={{
                mt: isEditing ? 5 : undefined,
                mb: isEditing ? 5 : undefined,
            }}
        >
            <UserAvatar
                userId={comment.createdBy}
                style={{
                    marginTop: "5px"
                }} />
            {!isEditing && (
                <ReadOnlyComment 
                    comment={editItem.isPending ? editItem.variables : comment} 
                    variant={variant}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    />
            )}
            {isEditing && ( 
                <EditCommentForm
                    initialValue={comment}
                    onAbortClick={onAbortEditClick}
                    onSubmit={onPostEdit}
                    entityType={entityType}
                />
            )}
        </Stack>
    );
}

function ReadOnlyComment({
    variant,
    comment,
    onEditClick,
    onDeleteClick,
}: {
    comment: Comment,
    variant?: CommentSectionVariant,
    onEditClick?: () => void,
    onDeleteClick?: () => void,
}) {
    const isMobile = useIsMobileScreen()
    const isCompact = variant === "compact" || isMobile

    return (
        <div style={{
            width: variant === "normal" ? "100%" : undefined,
        }}>
            <Stack 
                direction="row" 
                alignItems="center" 
            >
                <CommentBubble comment={comment} variant={variant} />
                <CommentMenu 
                    comment={comment}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    fontSize={isCompact ? "small" : "medium"}
                    sx={{
                        ml: {
                            xs: 0, 
                            sm: variant === "normal" ? 0.8 : 0.5,
                        },
                        p: isCompact ? 0.5 : 0.8,
                    }}
                    />
            </Stack>
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
    )
}

function CommentBubble({ comment, variant }: {comment: Comment, variant?: CommentSectionVariant}) {
    const theme = useTheme();
    return ( 
        <div
            style={{
                backgroundColor: theme.palette.divider,
                minWidth: "130px",
                padding: variant === "normal" ? "12px" : "7px 14px 10px 14px",
                borderRadius: variant === "normal" ? "10px" : "16px",
                position: "relative",
                width: "100%",
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
    )
}

function CommentMenu({
    comment,
    onEditClick,
    onDeleteClick,
    sx,
    fontSize = "medium",
}: {
    comment: Comment,
    onEditClick?: () => void,
    onDeleteClick?: () => void,
    sx?: SxProps,
    fontSize?: "small" | "medium",
}) {
    const {isAdmin, user} = useAuthenticatedUser()
    const canEdit = user.id === comment.createdBy
    const canDelete = canEdit || isAdmin 

    if(!canEdit && !canDelete) 
        return <></>

    return (
        <IconPopupMenu
            icon={ <MoreHorizIcon fontSize={fontSize} />}
            ariaLabel="Kommentarmeny"
            sx={{
                ...sx,
            }}
        >
            {canEdit && (
                <EditMenuItem divider={canDelete} onClick={onEditClick}/>
            )}
            {canDelete && (
                <DeleteMenuItem onClick={onDeleteClick}/>
            )}
        </IconPopupMenu>
    )
}