export default function NavBar(){
  return(
    <nav className="sticky top-0 z-50 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] nav-bg">
      <div></div>
      <div className="lg:bg-red-600 p-5">
        <div className="text-white text-[32px] font-[800]">Manga Daily</div>
      </div>
    </nav>
  )
}