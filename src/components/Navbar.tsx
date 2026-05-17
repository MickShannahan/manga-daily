import { NavLink } from 'react-router'

export default function NavBar(){
  return(
    <nav className="sticky top-0 z-50 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] nav-bg">
      <div className="flex items-center px-5 py-3 gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm font-bold transition-colors ${
              isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`
          }
        >
          Daily
        </NavLink>
        <NavLink
          to="/scores"
          className={({ isActive }) =>
            `text-sm font-bold transition-colors ${
              isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
            }`
          }
        >
          Scores
        </NavLink>
      </div>
      <div className="lg:bg-red-600 p-5">
        <div className="text-white text-[32px] font-[800]">Manga Daily</div>
      </div>
    </nav>
  )
}