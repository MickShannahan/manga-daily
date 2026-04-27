import { observer } from "mobx-react-lite";


const MangaDetails = observer(({manga}) => {


  return(
    <section>{manga?.title}</section>
  )
})

export default MangaDetails