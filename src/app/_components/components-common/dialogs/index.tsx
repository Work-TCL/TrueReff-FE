import React, { Fragment } from "react";
import Logout from "./logout";
import PasswordSuccess from "./password-changed";

export default function Dialogs() {
  return (
    <Fragment>
      <Logout />
      <PasswordSuccess />
    </Fragment>
  );
}
