import React, { useEffect, useRef } from "react";

function Dropdown(props) {
  const dropdownRef = useRef();

  const handleClick = (event) => {
    if (
      dropdownRef &&
      !dropdownRef.current?.contains(event.target) &&
      props.onClose
    )
      props.onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-full bg-white rounded overflow-y-auto z-10 min-h-10 min-w-20 w-fit h-fit max-w-60 max-h-96 ${props.class ? props.class : ""}`}
    >
      {props.children}
    </div>
  );
}

export default Dropdown;