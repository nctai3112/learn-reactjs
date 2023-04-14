import React from "react";

const SelectionList = ({ items, selected, onChange }) => {
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => onChange(index)}
          style={{
            backgroundColor: selected === index ? "#f2f2f2" : "transparent",
            padding: "10px",
            borderRadius: "5px",
            margin: "5px",
            cursor: "pointer",
            boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SelectionList;
