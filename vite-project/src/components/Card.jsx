import React, { useState } from "react";
import { CheckSquare, Clock, MoreHorizontal } from "react-feather";

import Dropdown from "./Dropdown";
import CardInfo from "./CardInfo";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id, title, date, tasks, labels } = props.card;

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!date) return "";

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Aprl",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    return day + " " + month;
  };

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setShowModal(false)}
          card={props.card}
          boardId={props.boardId}
          updateCard={props.updateCard}
        />
      )}
      <div
        className="p-2 flex flex-col gap-2 bg-white rounded-lg hover:[&_.card-top-more]:opacity-100"
        draggable
        onDragEnd={() => props.dragEnded(props.boardId, id)}
        onDragEnter={() => props.dragEntered(props.boardId, id)}
        onClick={() => setShowModal(true)}
      >
        {/* Top Section */}
        <div className="flex items-start">
          <div className="flex-3 flex flex-wrap gap-1 text-sm leading-[21px]">
            {labels?.map((item, index) => (
              <label
                key={index}
                className="rounded-full px-3 py-1 text-white w-fit text-xs"
                style={{ backgroundColor: item.color }}
              >
                {item.text}
              </label>
            ))}
          </div>
          <div
            className="card-top-more w-[30px] h-[20px] translate-x-[15px] flex-1 cursor-pointer opacity-0 transition-opacity duration-200"
            onClick={(event) => {
              event.stopPropagation();
              setShowDropdown(true);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board_dropdown"
                onClose={() => setShowDropdown(false)}
              >
                <p onClick={() => props.removeCard(props.boardId, id)}>
                  Delete Card
                </p>
              </Dropdown>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="font-bold text-base leading-7 flex-1">{title}</div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          {date && (
            <p className="rounded-full px-3 py-1 bg-gray-100 text-black text-sm leading-[21px] flex gap-1 items-center w-fit">
              <Clock className="h-[13px] w-[13px]" />
              {formatDate(date)}
            </p>
          )}
          {tasks && tasks?.length > 0 && (
            <p className="rounded-full px-3 py-1 bg-gray-100 text-black text-sm leading-[21px] flex gap-1 items-center w-fit">
              <CheckSquare className="h-[13px] w-[13px]" />
              {tasks?.filter((item) => item.completed)?.length}/{tasks?.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
