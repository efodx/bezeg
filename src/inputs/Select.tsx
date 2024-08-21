interface SelectProps {
    options: { value: any; text: string; }[];
    selected?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => any
}


export function Select(props: SelectProps) {
    let getOptions = () => props.options.map((option: { value: any; text: string }) =>
        <option value={option.value}>{option.text}</option>);

    return <select onChange={(e) => props.onChange(e)} className="form-select" aria-label="Default select example">
        {props.selected ? <option selected>{props.selected}</option> : ""}
        {getOptions()}
    </select>;
}