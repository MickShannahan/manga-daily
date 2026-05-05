import { observer } from "mobx-react-lite";
import type { Character } from "../Models/Character";



const CharacterCard = observer(({character}: {character: Character})=>{
  return(
    <section className="w-[19%] p-2 bg-black">
      <img src={character.image} alt={character.name} className="w-100 h-[240px] object-cover" />
      <div>
        {character.name}
      </div>
    </section>
  )
})

export default CharacterCard