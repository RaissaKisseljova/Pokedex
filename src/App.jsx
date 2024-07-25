import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import styled from "styled-components";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./App.css";
import { Loader } from "./components/Loader";
import { PokemonModal } from "./components/PokemonModal";
import { PokedexState } from "./context/pokedex";
import { PokemonCard } from "./components/PokemonCard";
export const App = () => {
  const pokedexState = useContext(PokedexState);
  const [selectedType, setSelectedType] = useState("no filter");
  const [search, setSearch] = useState("");

  const getAllPokemons = async () => {
    const { data } = await axios.get(
      "https://pokeapi.co/api/v2/pokemon?limit=151"
    );
    return data.results;
  };

  const fillPokemons = async (data) => {
    let arrayOfPromises = data.map(async (pok) => {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pok.name}`
      );
      return await response.json();
    });
    return await Promise.all(arrayOfPromises);
  };

  const getPokemonTypes = async () => {
    let { data } = await axios.get("https://pokeapi.co/api/v2/type");
    return [...data.results, { name: "no filter", url: "" }];
  };

  const getPokemonsByType = async () => {
    pokedexState.setErrorMessage('')
    toggleLoader(true);
    if (selectedType === "no filter") {
      init();
    } else {
      try {
        let response = await fetch(
          "https://pokeapi.co/api/v2/type/" + selectedType
        );
        if (response.ok) {
          let { pokemon } = await response.json();
          let fixedPokemonArray = pokemon.map((pkm) => pkm.pokemon);
          let pokemonArrayByType = await fillPokemons(fixedPokemonArray);
          pokedexState.setPokemons(keepJustFirstGeneration(pokemonArrayByType));
          toggleLoader(false);
        } else {
          console.log("error");
          toggleLoader(false);
        }
      } catch (error) {
        console.log(error);
        toggleLoader(false);
      }
    }
  };

  const keepJustFirstGeneration = (bigArray) =>
    bigArray.filter((pkm) => pkm.id <= 151);

  const toggleLoader = (value) => pokedexState.setLoading(value);

  const init = async () => {
    toggleLoader(true); // turns on the pokeball spinner
    let pokemonArraySimple = await getAllPokemons(); // returns a list of pokémon objects with name and URL
    let pokemonArrayFull = await fillPokemons(pokemonArraySimple); // uses the list above to get full pokemon objects
    pokedexState.setPokemons(pokemonArrayFull); // sets the context with the full pokemon array
    let types = await getPokemonTypes(); // gets the list of all pokemon types
    pokedexState.setAllTypes(types); // sets the context with all the pokemon types
    toggleLoader(false); // turn off the pokeball spinner
  };

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedType) {
      getPokemonsByType();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType]);

  const searchPokemon = async () => {
    toggleLoader(true);
    pokedexState.setErrorMessage("");
    if (!search) {
      init();
    } else {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${search}`
        );
        if (response.ok) {
          const foundPokemon = await response.json();
          pokedexState.setPokemons([foundPokemon]);
          toggleLoader(false);
        } else if (response.status === 404) {
          pokedexState.setPokemons([]);
          pokedexState.setErrorMessage("Pokémon wasn't found");
          toggleLoader(false);
        } 
      } catch (error) {
        console.log(error);
        toggleLoader(false);
      }
    }
  };

  return (
    <>
      <Container>
        <Logo src="/logo.png" alt="logo" />

        <Input className="input-group mb-5 mt-5">
          <form
          style={{display:'flex', margin:'0 auto', width:'70%'}}
            onSubmit={(e) => {
              e.preventDefault();
              searchPokemon();
            }}
          >
            <input
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              value={search}
              type="text"
              className="form-control"
              placeholder="Search Pokémon"
            />
            <button className="btn btn-primary" type="submit" disabled={!search}>
              Search
            </button>
          </form>
        </Input>

        {pokedexState.allTypes.map((type) => (
          <TypeButton
            color={`var(--${type.name}-label)`}
            onClick={() => setSelectedType(type.name)}
            key={type.name}
            myType={type.name}
            selectedType={selectedType}
          >
            {type.name}
          </TypeButton>
        ))}

        <PokemonModal active={pokedexState.showModal} />

        <Container className={pokedexState.showModal ? "blur" : ""}>
          {pokedexState.errorMessage && (
            <ErrorDiv>
              <Error>{pokedexState.errorMessage}</Error>
              <GoBackBtn
                onClick={() => {
                  pokedexState.setErrorMessage("");
                  setSearch('')
                  init();
                }}
              >
                Go back
              </GoBackBtn>
            </ErrorDiv>
          )}

          <Row>
            {pokedexState.pokemons &&
            !pokedexState.loading &&
            pokedexState.allTypes ? (
              pokedexState.pokemons.map((pokemon) => (
                <Col xs={12} sm={12} md={6} lg={6} xl={4} key={pokemon.id}>
                  <PokemonCard pokemon={pokemon} />
                </Col>
              ))
            ) : (
              <Loader />
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
};

const Logo = styled.img`
  text-align: center;
  display: block;
  margin: 50px auto 0 auto;
`;

const TypeButton = styled.button`
  background-color: ${(props) => (props.color ? props.color : "white")};
  margin-left: 15px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  width: 80px;
  margin-bottom: 10px;
  box-shadow: ${(props) =>
    props.myType === props.selectedType ? "inset 0 0 0 2px black" : "none"};
`;

const Error = styled.h1`
  color: purple;
  text-align: center;
  margin: 50px 0 25px 0;
`;

const Input = styled.div`
  margin: 0 auto;
`;

const ErrorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const GoBackBtn = styled.button`
  border: none;
  width: 200px;
  padding: 15px;
  border-radius: 5px;
  background-color: purple;
  color: white;
  font-weight: 600;
  font-size: 25px;
`;
