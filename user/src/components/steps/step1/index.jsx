import Input from "../../input/form/input";

export default function Step1({ adressUser, setState, selectedOption }) {
  const handleOptionChange = (e) =>
    setState((preState) => ({ ...preState, selectedOption: e.target.value }));
  const addressParts = adressUser.line_1.split(",");
  const address = `${addressParts[1]}, ${addressParts[0]} - ${addressParts[2]}`;

  return (
    <>
      <Input
        className="w-1/3 md:w-full"
        label="Cep"
        placeholder="cep"
        value={adressUser.zip_code}
        disabled
      />
      <div className="flex gap-6">
        <Input
          className="w-2/3"
          label="Endereço"
          placeholder="Endereço"
          value={address}
          disabled
        />
        <Input
          className="w-1/3"
          label="Complemento"
          placeholder="Complemento"
          value={adressUser.line_2}
          disabled
        />
      </div>
      <div className="flex gap-6">
        <Input
          className="w-2/3"
          label="Cidade"
          placeholder="Cidade"
          value={adressUser.city}
          disabled
        />
        <Input
          className="w-1/3"
          label="Estado"
          placeholder="Estado"
          value={adressUser.state}
          disabled
        />
      </div>
      <div className="flex flex-col">
        {["Sedex", "PAC"].map((option) => (
          <label key={option} className="cursor-pointer">
            <input
              className="cursor-pointer"
              type="radio"
              name="shippingOption"
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
            />
            Envio por {option}
          </label>
        ))}
      </div>
    </>
  );
}
