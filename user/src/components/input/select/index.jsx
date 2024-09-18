import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Option from "@mui/joy/Option";
import Select, { selectClasses } from "@mui/joy/Select";
import * as React from "react";

export default function SelectProduct({
  className,
  setSelectInput,
  selectInput,
  categories,
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
      onChange={(_, newValue) => setSelectInput(newValue)}
    >
      <Option value="Todos">Todos</Option>
      {categories?.length > 0 &&
        categories.map((category, key) => {
          console.log({ category, key });
          return (
            <Option key={key} value={category.name}>
              {category.name}
            </Option>
          );
        })}
    </Select>
  );
}
