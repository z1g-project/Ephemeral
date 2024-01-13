export default function View() {
  const searchParams = new URLSearchParams(window.location.search);
  const src = searchParams.get("src");
  return (
    <iframe
      src={`/light/${src}`}
      className="absolute bottom-0 left-0 right-0 top-0 h-screen w-screen border-none p-0"
    />
  );
}
