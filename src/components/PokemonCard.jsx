import styled from "styled-components";
import "../App.css";
import React, { useContext } from "react";
import { PokedexState } from "../context/pokedex";

export const PokemonCard = (props) => {
  const pokedexState = useContext(PokedexState);
  const { pokemon } = props;
  return (
    <PokemonContainer
      key={pokemon.name}
      onClick={(e) => {
        pokedexState.setSelectedPokemon(pokemon);
        if (pokedexState.selectedPokemon)
          return pokedexState.setShowModal(true);
      }}
      color={`var(--${pokemon.types[0].type.name})`}
    >
      <PokeBall src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png" />
      <div>
        <PokemonId>#{pokemon.id}</PokemonId>
        <PokemonName color={`var(--${pokemon.types[0].type.name}-label)`}>
          {pokemon.name}
        </PokemonName>

        {pokemon.types.map((type, index) => (
          <PokemonType
            color={`var(--${pokemon.types[index].type.name}-label)`}
            key={type.type.name}
          >
            {type.type.name}
          </PokemonType>
        ))}
      </div>

      <div>
        <PokemonImg src={pokemon.sprites.other.dream_world.front_default} />
      </div>
    </PokemonContainer>
  );
};

const PokemonContainer = styled.div`
  background-color: ${(props) => (props.color ? props.color : "white")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 15px;
  border-radius: 10px;
  margin-top: 50px;
  position: relative;
  z-index: 2;
  font-weight: bold;
`;

const PokemonName = styled.h2`
  color: white;
`;

const PokemonId = styled.p`
  font-size: 28px;
  color: rgba(104, 104, 104, 0.386);
`;

const PokemonImg = styled.img`
  width: 80%;
  height: 220px;
  z-index: 2;
  margin-left: 25px;
`;

const PokemonType = styled.h1`
  font-size: 18px;
  background-color: ${(props) => (props.color ? props.color : "white")};
  padding: 8px;
  border-radius: 5px;
  width: 90px;
  text-align: center;
  border: 2px solid white;
`;

const PokeBall = styled.img`
  position: absolute;
  width: 340px;
  bottom: 0;
  right: -70px;
  opacity: 0.1;
  z-index: -1;
`;
