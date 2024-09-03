export class ErrorLogger {
    private errors: Error[] = [];

    log(err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.errors.push(error);
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }

    message() {
        if(this.hasErrors()) {
            const aggregatedErrors = this.errors.map((err, index) => `Error ${index + 1}:\n${err.message}`).join("\n\n");
            return `Encountered ${this.errors.length} errors:\n\n${aggregatedErrors}`; 
        } else {
            return "Encountered no errors.";
        }
    }
}