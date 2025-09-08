import React, { useState } from "react";
import { MoreHorizontal } from "react-feather";

import Card from "./Card";
import Dropdown from "./Dropdown";
import Editable from "./Editable";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-w-[290px] w-[290px] max-h-full flex-basis-[290px] flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <p className="font-bold text-base flex gap-1 items-center">
          {props.board?.title}
          <span className="text-gray-500">{props.board?.cards?.length || 0}</span>
        </p>
        <div
          className="cursor-pointer relative"
          onClick={() => setShowDropdown(true)}
        >
          <MoreHorizontal />
          {showDropdown && (
            <Dropdown
              class="shadow-md p-5 w-36 cursor-default"
              onClose={() => setShowDropdown(false)}
            >
              <p className="border-b border-gray-100 cursor-pointer" onClick={() => props.removeBoard()}>Delete Board</p>
            </Dropdown>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-2 rounded overflow-y-auto flex flex-col gap-2">
        {props.board?.cards?.map((item) => (
          <Card
            key={item.id}
            card={item}
            boardId={props.board.id}
            removeCard={props.removeCard}
            dragEntered={props.dragEntered}
            dragEnded={props.dragEnded}
            updateCard={props.updateCard}
          />
        ))}
        <Editable
          text="+ Add Card"
          placeholder="Enter Card Title"
          displayClass="bg-white text-black rounded-lg shadow w-full text-center"
          editClass="bg-white rounded-lg p-2"
          onSubmit={(value) => props.addCard(props.board?.id, value)}
        />
      </div>
    </div>
  );
}

export default Board;