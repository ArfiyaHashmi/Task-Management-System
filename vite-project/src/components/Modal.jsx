import React from "react";

function Modal(props) {
  return (
    <div
      className="fixed inset-0 min-h-screen w-full bg-black bg-opacity-50 flex justify-center items-center z-20"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="max-h-[95vh] bg-white rounded shadow-lg overflow-y-auto scrollbar-thin"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
