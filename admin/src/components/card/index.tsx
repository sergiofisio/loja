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
      <h2 className="font-main text-xl text-center">{text}</h2>
      <h2 className="font-main text-3xl text-center">{info}</h2>
    </div>
  );
}
