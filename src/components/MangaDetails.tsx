import { observer } from "mobx-react-lite";
import { Manga } from "../Models/Manga";

const MangaDetails = observer(({ manga }: { manga: Manga }) => {
  return (
    <section className="manga-details">
      <h1>{manga?.title}</h1>
      
      <div className="manga-meta">
        <p><strong>Author:</strong> {manga?.author}</p>
        <p><strong>Genre:</strong> {manga?.genre}</p>
        <p><strong>Published:</strong> {manga?.published}</p>
        <p><strong>Volumes:</strong> {manga?.volumes}</p>
      </div>
      
      <div className="manga-image">
        <img src={manga?.image} alt={manga?.title} />
      </div>
      
      <div className="manga-plot">
        <h2>Plot</h2>
        <p>{manga?.plot}</p>
      </div>
      
      <div className="manga-characters">
        <h2>Main Characters</h2>
        <ul>
          {manga?.mainCharacters?.map((character, index) => (
            <li key={index}>{character}</li>
          ))}
        </ul>
      </div>
      
      <div className="manga-links">
        <a href={manga?.articleLink} target="_blank" rel="noopener noreferrer">
          Read Full Article
        </a>
      </div>
    </section>
  );
});

export default MangaDetails;