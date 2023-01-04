import styles from "./FileDropZone.module.css";


export default function FileDropZone({ onChange, accept }: {onChange: (newFiles: File[]) => void, accept: string}) {
    
    const handleDrop = (_: React.DragEvent<HTMLDivElement>) => {
        //todo
    }

    const handleDragOver = (_: React.DragEvent<HTMLDivElement>) => {
        //todo
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!onChange)
            return;

        const files  = e.target.files 

        if(files === null)
            return onChange([]);

        const newFiles: File[] = [];
        for(const file of files) {

            // TODO: Validate file here
            
            newFiles.push(file)
        }
        onChange(newFiles)
    }

    return (
            <label>
                <input 
                    type="file" 
                    multiple
                    accept={accept} 
                    style={{opacity: 0}} 
                    onChange={handleInputChange} 
                />
                <div 
                    className={styles.dropZone} 
                    onDrop={handleDrop} 
                    onDragOver={handleDragOver} >
                </div>
            </label>
            
    )
}