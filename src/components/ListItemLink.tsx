import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

interface ListItemLinkProps {
  icon?: React.ReactElement;
  primary: string;
  to: string;
}

export default function ListItemLink(props: ListItemLinkProps) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
        <Link to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
