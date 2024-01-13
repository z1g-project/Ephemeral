export default function View() {
    const searchParams = new URLSearchParams(window.location.search);
    const src = searchParams.get("src");
    return (
        <iframe src={`/light/${src}`} className="absolute w-screen h-screen top-0 right-0 bottom-0 left-0 border-none p-0" />
    )
}