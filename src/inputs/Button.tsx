interface ButtonProps {
    disabled?: boolean;
    onClick?: () => any;
    text?: any;
}

export function Button(props: ButtonProps) {

    return <div className={`btn btn-light ${props.disabled ? "disabled" : ""}`}
                onClick={() => props.onClick ? props.onClick() : ""}>
        {props.text}
    </div>
}