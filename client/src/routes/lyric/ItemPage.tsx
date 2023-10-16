import { useTheme } from '@mui/material';
import { SongLyric } from 'common/interfaces';
import { useOutletContext } from "react-router-dom";
import { AuthorInfo } from 'src/components/AuthorInfo';
import { MarkDownRenderer } from 'src/components/MarkDownEditor';
import { useTitle } from "../../hooks/useTitle";


export function LyricItemPage() {
    const lyric = useOutletContext<SongLyric>();
    useTitle(lyric.title);
    const theme = useTheme();
    return (
        <>
            <div style={{
                fontSize: "1.2em",
                lineHeight: "1.6em",
                color: theme.palette.text.secondary,
            }}>
                <h1 style={{}}>
                    {lyric.title}
                </h1>
                <AuthorInfo
                    createdByUserId={lyric.createdBy}
                    createdByUserName={lyric.createdByName}
                    createdAt={lyric.createdAt}
                    updatedByUserId={lyric.updatedBy}
                    updatedByUserName={lyric.updatedByName}
                    updatedAt={lyric.updatedAt}
                    style={{
                        fontSize: "small",
                        marginTop: "-20px",
                    }} />
                <MarkDownRenderer value={lyric.content} />
            </div>
        </>
    );
}
