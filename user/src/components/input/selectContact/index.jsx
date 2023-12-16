import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Option from "@mui/joy/Option";
import Select, { selectClasses } from "@mui/joy/Select";
import * as React from "react";

export default function SelectContact({
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
        [`& .${selectClasses.indicator}`]: {
          transition: "0.2s",
          [`&.${selectClasses.expanded}`]: {
            transform: "rotate(180deg)",
          },
        },
      }}
      value={selectInput}
      onChange={e => setSelectInput(e.target.textContent)}
    >
      <Option value=""></Option>
      <Option value="Dúvida">Dúvidas</Option>
      <Option value="Sugestão">Sugestões</Option>
      <Option value="Pedido">Problema com pedido</Option>
    </Select>
  );
}
