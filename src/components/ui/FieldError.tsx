export default function FieldError({ message }: { message?: string }) {
  return message ? (
    <span role="alert" className="text-b3 text-danger">
      {message}
    </span>
  ) : null;
}
