import {useEffect} from "react";

// @ts-ignore
const ChangePageTitle = ({pageTitle}) => {
    useEffect(() => {
        const defaultTitle = document.title;
        document.title = pageTitle;
        return () => {
            document.title = defaultTitle;
        };
    });

    return <></>;
}

export default ChangePageTitle;
