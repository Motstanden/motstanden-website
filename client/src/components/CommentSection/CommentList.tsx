import { LikeEntityType } from "common/enums";
import { Comment } from "common/interfaces";
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppBarStyle } from 'src/context/AppBarStyle';
import { LikesContextProvider } from '../likes/LikesContext';
import { CommentItem } from "./CommentItem";
import { CommentSectionVariant } from "./CommentSection";

export function CommentList({
    comments, likeEntityType, variant,
}: {
    comments: Comment[];
    likeEntityType: LikeEntityType;
    variant?: CommentSectionVariant;
}) {
    const { scrollMarginTop } = useAppBarStyle();

    const location = useLocation();
    useLayoutEffect(() => {
        if (location.hash && location.hash.startsWith("#comment-")) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                window.scrollTo({ top: 0, left: 0, behavior: "auto" });

                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 600);
            }
        }
    }, []);

    return (
        <>
            {comments.map(comment => (
                <LikesContextProvider
                    entityType={likeEntityType}
                    entityId={comment.id}
                    key={comment.id}
                >
                    <div
                        id={`comment-${comment.id}`}
                        style={{
                            scrollMarginTop: `${scrollMarginTop + 10}px`,
                            marginBottom: "15px"
                        }}>
                        <CommentItem
                            comment={comment}
                            variant={variant ?? "normal"} />
                    </div>
                </LikesContextProvider>
            ))}
        </>
    );
}
