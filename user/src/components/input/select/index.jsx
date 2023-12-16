import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Option from "@mui/joy/Option";
import Select, { selectClasses } from "@mui/joy/Select";
import * as React from "react";

export default function SelectProduct({
  className,
  setSelectInput,
  selectInput,
}) {
  return (
    <Select
      className={className}
      placeholder={selectInput}
      indicator={<KeyboardArrowDown />}
      sx={{
        width: 240,
        [`& .${selectClasses.indicator}`]: {
          transition: "0.2s",
          [`&.${selectClasses.expanded}`]: {
            transform: "rotate(180deg)",
          },
        },
      }}
      value={selectInput}
      onChange={(e) => setSelectInput(e.target.textContent)}
    >
      <Option value="Todos">Todos</Option>
      <Option value="Bland">Bland</Option>
      <Option value="Caps">Caps</Option>
      <Option value="QuantION">QuantION</Option>
    </Select>
  );
}
