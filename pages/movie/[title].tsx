import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DocumentNode, gql, useQuery } from "@apollo/client";
import Header from '../../components/header'
import { FC } from "react";

type Props = {
  movieTitle: string;
  GET_MOVIE: DocumentNode;
};

const GET_MOVIE = gql`
  query GetMovie($movieTitle: String) {
    getMovie(filter: { title: $movieTitle }) {
      title
      tagline
      released
      actors {
        name
      }
      directors {
        name
      }
    }
  }
`

const Movie: FC<Props> = ({ movieTitle, GET_MOVIE }) => {
  const router = useRouter();
  const { title } = router.query;
  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { movieTitle: title },
  });

  if (loading) return <div>'Loading...'</div>;
  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div className="container">
      <Head>
        <title>Next with Neo4j</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header title={title} />

      <main>
        <div className="movie">
          <div className="info">
            <h2>Information</h2>
            <div>
              <strong>Tagline: </strong>
              {data.getMovie.tagline}
            </div>
            <div>
              <strong>Released: </strong>
              {data.getMovie.released}
            </div>
          </div>
          <div className="actors">
            <h2>Actors</h2>
            {data.getMovie.actors.map((actor) => (
              <div key={actor.name}>{actor.name}</div>
            ))}
          </div>
          <div className="directors">
            <h2>Directors</h2>
            {data.getMovie.directors.map((director) => (
              <div key={director.name}>{director.name}</div>
            ))}
          </div>
        </div>

        <div className="back">
          <Link href="/">
            <a>🔙 Go Back</a>
          </Link>
        </div>
      </main>

      <Footer />

      <style jsx>
        {`
          .container {
            width: 100vw;
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          main {
            display: flex;
            width: 100%;
            justify-content: center;
            padding: 2rem 0;
            text-align: center;
            flex-direction: column;
          }
          .movie {
            margin-bottom: 2rem;
          }
          .back {
            padding: 1rem 0;
          }
          .back a {
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default Movie;