interface IComment {
    className: string
}

const Comment = ({ className }: IComment) => {
    return (
        <svg
            fill="#000000"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M1662.178 0v1359.964h-648.703l-560.154 560.154v-560.154H0V0h1662.178ZM906.794 755.55H453.32v117.53h453.473V755.55Zm302.063-302.365H453.32v117.529h755.536V453.185Z"
                fillRule="evenodd"
            />
        </svg>
    )
}

export default Comment
