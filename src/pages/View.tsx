export default function View() {
  const searchParams = new URLSearchParams(window.location.search);
  const src = encodeURIComponent(searchParams.get("src") ?? "");
  function getProxy():string {
    if (localStorage.getItem("proxy") === "ultraviolet") {
      return "dark";
    } else if (localStorage.getItem("proxy") === "ampere") {
      return "light";
    } else {
      return "dark";
    }
  }
  return (
    <iframe
      src={`/~/${getProxy()}/${src}`}
      className="absolute bottom-0 left-0 right-0 top-0 h-screen w-screen border-none p-0"
    />
  );
}
