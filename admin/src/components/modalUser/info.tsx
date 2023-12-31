export default function InfoModalUser({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-2xl font-bold uppercase" htmlFor={label}>
        {label}
      </label>
      <h2 className="text-xl">{value}</h2>
    </div>
  );
}
