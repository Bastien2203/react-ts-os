interface PromptPrefixProps {
    user: string,
    host: string,
    cwd: string
}

export const PromptPrefix = (props: PromptPrefixProps) => <div className="text-gray-400 text-nowrap">{`${props.user}@${props.host}:${props.cwd}$`}&nbsp;</div>;