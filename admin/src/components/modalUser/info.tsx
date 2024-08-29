export default function InfoModalUser({
  label,
  value,
  type,
}: {
  label: string;
  value: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className={`text-2xl font-bold`} htmlFor={label}>
        {label}
      </label>
      <h2 className={`text-xl ${type === "email" ? "lowercase" : ""}`}>
        {value}
      </h2>
    </div>
  );
}
