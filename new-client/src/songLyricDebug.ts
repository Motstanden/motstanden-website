class SongLyricItem {
    id: number
    title: string
    relativeUrl: string

    constructor(id: number, title: string){
        this.id = id
        this.title = title
        this.relativeUrl = this.createUrl(title);
    }

    private createUrl(inputData: string): string{
        return inputData.toLocaleLowerCase()
                        .replaceAll(" ","-")
                        .replaceAll("æ", "ae")
                        .replaceAll("ø", "oe")
                        .replaceAll("å", "aa")
    }
}

let data: SongLyricItem[] = [
    new SongLyricItem(1, "Asbest"),
    new SongLyricItem(2, "Bayer i Hånden"),
    new SongLyricItem(3, "Calypso"),
    new SongLyricItem(4, "De Ohmske")
]

// export default data
export function getSongLyricTitles(): SongLyricItem[]{
    return data;
}
