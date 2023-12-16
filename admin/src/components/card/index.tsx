export default function Card({
  classname,
  text,
  info,
}: {
  classname: string;
  text: string;
  info: string | number;
}) {
  return (
    <div className={classname}>
      <h2>{text}</h2>
      <h2>{info}</h2>
    </div>
  );
}
