export default function Card({ classname, text, info }) {
  return (
    <div className={classname}>
      <h2>{text}</h2>
      <h2>{info}</h2>
    </div>
  );
}
