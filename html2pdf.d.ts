declare module 'html2pdf.js' {
    interface Options {
        margin: number | number[];
        filename: string;
        image: { type: string; quality: number };
        html2canvas: {
            scale: number;
            useCORS: boolean;
            logging: boolean;
        };
        jsPDF: {
            unit: string;
            format: string;
            orientation: string;
        };
    }

    function html2pdf(
        element: HTMLElement,
        options?: Partial<Options>
    ): Promise<HTMLCanvasElement>;

    export = html2pdf;
}
