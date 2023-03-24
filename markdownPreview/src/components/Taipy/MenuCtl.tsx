import { MenuProps } from "@mui/material";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

const MenuCtl = (props: MenuProps) => {
    const [_, setMenuProps] = useSessionStorage("menu", "");
    useEffect(() => {
        setMenuProps(JSON.stringify(props));
    }, []);
    return <></>;
};

export default MenuCtl;
