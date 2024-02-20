import { useParams } from "react-router-dom";

export default function App() {
  const { url } = useParams();
  return (
    <>
      <iframe
        src={`../apps/${url}`}
      />
    </>
  );
}