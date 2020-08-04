import React, { forwardRef } from "react";

function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
}

export default forwardRef(MyInput);
