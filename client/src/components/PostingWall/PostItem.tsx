import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Divider, Paper, Stack, SxProps } from "@mui/material";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentEntityType } from "common/enums";
import { WallPost } from "common/interfaces";
import dayjs from "dayjs";
import { useState } from "react";
import { CommentSection } from "src/components/CommentSection";
import { useAuthenticatedUser } from "src/context/Authentication";
import { deleteRequest } from 'src/utils/deleteRequest';
import { patchRequest } from 'src/utils/patchRequest';
import { LinkifiedText } from "../LinkifiedText";
import { LikeButton } from "../likes/LikeButton";
import { CopyLinkMenuItem } from "../menu/CopyLinkMenuItem";
import { DeleteMenuItem } from "../menu/DeleteMenuItem";
import { EditMenuItem } from "../menu/EditMenuItem";
import { IconPopupMenu } from "../menu/IconPopupMenu";
import { UserAvatar } from "../user/UserAvatar";
import { UserFullName } from "../user/UserFullName";
import { EditPostForm } from './EditPostForm';
import { PostItemLikes } from "./PostItemLikes";


export function PostItem({
    post, 
    queryKey, 
    style
}: {
    post: WallPost;
    queryKey: QueryKey;
    style?: React.CSSProperties;
}) {
    const queryClient = useQueryClient();

    const editItem = useMutation({
        mutationFn: async (newPost: WallPost) => {
            const data: Pick<WallPost, "content"> = {
                content: newPost.content
            };
            return await patchRequest(`/api/wall-posts/${post.id}`, data);
        },
        onError: () => {
            window.alert("Fikk ikke til å redigere veggposten.\nSi ifra til webansvarlig!");
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({ queryKey: queryKey });
        },
    });

    const deleteItem = useMutation({
        mutationFn: async () => {
            return await deleteRequest(`/api/wall-posts/${post.id}`);
        },
        onError: () => {
            window.alert("Fikk ikke til å slette veggposten.\nSi ifra til webansvarlig!");
        },
        onSuccess: async () => {
            return await queryClient.invalidateQueries({ queryKey: queryKey });
        },
    });

    const [isEditing, setIsEditing] = useState(false);

    const onEditClick = () => {
        setIsEditing(true);
    };

    const onPostEdit = (newPost: WallPost) => {
        editItem.mutate(newPost);
        setIsEditing(false);
    };

    const onAbortEditClick = () => {
        setIsEditing(false);
    };

    const onDeleteClick = () => {
        if (window.confirm("Vil du permanent slette denne posten?")) {
            deleteItem.mutate();
        }
    };

    if (deleteItem.isPending)
        return <></>;

    return (
        <Paper
            elevation={2}
            aria-label='Veggpost'
            sx={{
                paddingBlock: "20px",
                paddingInline: { xs: "10px", sm: "20px" },
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: theme => theme.palette.divider,
                ...style,
            }}
        >
            <Header
                post={post}
                onDeleteClick={onDeleteClick}
                onEditClick={onEditClick} />
            {!isEditing && (
                <Content post={editItem.isPending ? editItem.variables : post} />
            )}
            {isEditing && (
                <EditPostForm
                    initialValue={post}
                    onAbortClick={onAbortEditClick}
                    onSubmit={onPostEdit} />
            )}
            <Divider sx={{ mb: 3, mt: 1 }} />
            <CommentSection
                entityType={CommentEntityType.WallPost}
                entityId={post.id}
                variant="compact" />
        </Paper>
    );
}

function Header({
    post, 
    onEditClick, 
    onDeleteClick
}: {
    post: WallPost;
    onEditClick?: VoidFunction;
    onDeleteClick?: VoidFunction;
}) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <HeaderText
                createdBy={post.createdBy}
                wallId={post.wallUserId}
                createdAt={post.createdAt} />
            <HeaderMenu
                post={post}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                sx={{
                    marginRight: "-5px"
                }} />
        </Stack>
    );
}

function HeaderText({
    createdBy, 
    wallId, 
    createdAt,
}: {
    createdBy: number;
    wallId: number;
    createdAt: string;
}) {

    const formatDate = (dateString: string): string => {
        const date = dayjs.utc(dateString);
        const now = dayjs();
        if (date.isAfter(now.subtract(4, "day"))) {
            return date.fromNow();
        }

        if (date.isSame(now, "year")) {
            return date.format("D MMMM");
        }

        return date.format("D MMMM, YYYY");
    };

    return (
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
        >
            <UserAvatar
                userId={createdBy}
                style={{}} />
            <div>
                <div>
                    <UserFullName
                        userId={createdBy}
                        style={{
                            marginRight: "3px"
                        }} />
                    {createdBy !== wallId && (
                        <>
                            <ArrowRightIcon
                                style={{
                                    fontSize: "16pt",
                                    opacity: 0.5,
                                    marginBottom: "-5px",
                                    marginRight: "3px"
                                }} />
                            <UserFullName
                                userId={wallId}
                                style={{
                                    marginTop: "-10px"
                                }} />
                        </>
                    )}
                </div>
                <div style={{
                    fontSize: "small",
                    opacity: 0.6,
                }}>
                    {formatDate(createdAt)}
                </div>
            </div>
        </Stack>
    );
}

function HeaderMenu({
    post, 
    sx, 
    onEditClick, 
    onDeleteClick
}: {
    post: WallPost;
    sx: SxProps;
    onEditClick?: VoidFunction;
    onDeleteClick?: VoidFunction;
}) {

    const { isAdmin, user } = useAuthenticatedUser();
    const canEdit = user.id === post.createdBy;
    const canDelete = canEdit || isAdmin;
    // || user.id === post.wallUserId   // TODO: Modify backend to allow this!
    return (
        <IconPopupMenu
            icon={<MoreHorizIcon />}
            ariaLabel='Veggpostmeny'
            sx={{
                p: { xs: 0.65, sm: 1 },
                ...sx,
            }}
        >
            <CopyLinkMenuItem linkValue={`${window.location.origin}/vegg/${post.id}`}
                divider={canEdit || canDelete} />
            {canEdit && (
                <EditMenuItem divider={canDelete} onClick={onEditClick} />
            )}
            {canDelete && (
                <DeleteMenuItem onClick={onDeleteClick} />
            )}
        </IconPopupMenu>
    );
}

function Content({ post }: { post: WallPost; }) {
    return (
        <>
            <div
                style={{
                    marginTop: "15px",
                    marginLeft: "5px",
                    whiteSpace: "pre-line",
                    marginBottom: "15px"
                }}
            >
                <LinkifiedText>
                    {post.content}
                </LinkifiedText>
            </div>
            <Stack direction="row" justifyContent="space-between">
                <div>
                    <LikeButton
                        style={{
                            padding: "0px",
                            paddingInline: "6px",
                            minWidth: "0px",
                        }} />
                </div>
                <PostItemLikes />
            </Stack>
        </>
    );
}

