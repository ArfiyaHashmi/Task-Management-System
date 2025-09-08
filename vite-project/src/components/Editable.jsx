import React, { useState } from "react";
import { X } from "react-feather";

function Editable(props) {
  const [isEditable, setIsEditable] = useState(false);
  const [inputText, setInputText] = useState(props.defaultValue || "");

  const submission = (e) => {
    e.preventDefault();
    if (inputText && props.onSubmit) {
      setInputText("");
      props.onSubmit(inputText);
    }
    setIsEditable(false);
  };

  return (
    <div className="w-full">
      {isEditable ? (
        <form
          className={`flex flex-col gap-2.5 ${
            props.editClass ? props.editClass : ""
          }`}
          onSubmit={submission}
        >
          <input
            type="text"
            value={inputText}
            placeholder={props.placeholder || props.text}
            onChange={(event) => setInputText(event.target.value)}
            autoFocus
            className="border-2 border-[#0079bf] rounded-md outline-none text-base p-2.5"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="bg-[#0079bf] text-white px-4 py-2 rounded-md hover:bg-[#046daa] active:translate-y-0.5 transition duration-100"
            >
              {props.buttonText || "Add"}
            </button>
            <X
              onClick={() => setIsEditable(false)}
              className="cursor-pointer h-6 w-6"
            />
          </div>
        </form>
      ) : (
        <p
          className={`px-3 py-1.5 rounded bg-[#eee] text-black w-fit cursor-pointer transition duration-200 hover:bg-[#ddd] ${
            props.displayClass || ""
          }`}
          onClick={() => setIsEditable(true)}
        >
          {props.text}
        </p>
      )}
    </div>
  );
}

export default Editable;
