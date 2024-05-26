interface ButtonProps {
    disabled?: boolean;
    onClick?: () => any;
    text?: any;
}

export function ButtonTwo(props: ButtonProps) {

    return <div className={`btn btn-dark ${props.disabled ? "disabled" : ""}`}
                onClick={() => props.onClick ? props.onClick() : ""}>
        {props.text}
    </div>
}