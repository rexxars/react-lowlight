interface LowlightMarker {
    line: number;
    className?: number;
}
interface LowlightProps {
    className?: string;
    language?: string;
    value: string;
    prefix?: string;
    subset?: string[];
    inline?: boolean;
    markers: number[] | LowlightMarker[];
}
declare function Lowlight(props: LowlightProps): JSX.Element;
declare namespace Lowlight {
    var displayName: string;
    var registerLanguage: (language: string, syntax: any) => void;
    var hasLanguage: (lang: string) => boolean;
}
export default Lowlight;
