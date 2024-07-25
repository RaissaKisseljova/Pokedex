import React, { useContext } from "react";
import styled from "styled-components";
import "../App.css";
import Modal from "react-bootstrap/Modal";
import { PokedexState } from "../context/pokedex";

export const PokemonModal = ({ active }) => {
  const pokedexState = useContext(PokedexState);
  const pokemon = pokedexState.selectedPokemon;

  return (
    <>
      <Modal
        show={active}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onEscapeKeyDown={() => pokedexState.setShowModal(false)}
        onHide={() => pokedexState.setShowModal(false)}
      >
        <Modal.Header
          closeButton
          onClick={() => pokedexState.setShowModal(false)}
        ></Modal.Header>
        <Modal.Body>
          {pokemon.types && 
          <Container color={`var(--${pokemon.types[0].type.name})`}>
            <LeftStats>
              <p>ID: #{pokemon.id}</p>
              <p>Name: {pokemon.name.toUpperCase()}</p>
              <p>Height: {pokemon.height}m</p>
              <p>Weight: {pokemon.weight}kg</p>
              <TypeP>
                <p>Type:</p>
                {pokemon.types.map((type, index) => (
                  <Type
                    color={`var(--${pokemon.types[index].type.name}-label)`}
                  >
                    {type.type.name}
                  </Type>
                ))}
              </TypeP>
              <AbilitiesP>
                <p>Abilities:</p>
                {pokemon.abilities.map((ability) => (
                  <Ability color={`var(--${pokemon.types[0].type.name}-label)`}>
                    {ability.ability.name}
                  </Ability>
                ))}
              </AbilitiesP>
              <p>Forms: {pokemon.forms[0].name}</p>
            </LeftStats>
            <PokemonImg src={pokemon.sprites.other.dream_world.front_default} />

            <RightStats>
              {pokemon.stats.map((stats) => (
                <Stats>
                  <span>{stats.stat.name.toUpperCase()}</span> :{" "}
                  <div
                    style={{
                      width: stats.base_stat + 80,
                      padding: 5,
                      backgroundColor: `var(--${stats.stat.name.toUpperCase()})`,
                      border: "2px solid white",
                      borderRadius: 5,
                    }}
                  >
                    {stats.base_stat}
                  </div>
                </Stats>
              ))}
              <PokeBall src="https://www.pngall.com/wp-content/uploads/4/Pokeball-PNG-Free-Download.png" />
            </RightStats>
          </Container>
          }
        </Modal.Body>
      </Modal>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: 90%;
  background-color: ${(props) => (props.color ? props.color : "yellow")};
  justify-content: space-evenly;
  align-items: center;
  display: flex;
  margin: 0;
  font-size: 16px;
  z-index: 4;
  border-radius: 5px;
  padding: 15px;

  @media (max-width: 1199px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PokemonImg = styled.img`
  z-index: 3;
`;

const LeftStats = styled.div``;

const RightStats = styled.div``;

const Type = styled.p`
  background-color: ${(props) => (props.color ? props.color : "white")};
  padding: 8px;
  margin-left: 5px;
  border-radius: 5px;
  width: 80px;
  border: 2px solid white;
`;

const AbilitiesP = styled.p`
  display: flex;
  text-align: center;
  align-items: center;
`;

const TypeP = styled.p`
  display: flex;
  text-align: center;
  align-items: center;
`;
const Ability = styled.p`
  background-color: ${(props) => (props.color ? props.color : "white")};
  padding: 8px;
  margin-left: 5px;
  border-radius: 5px;
  font-size: 16px;
  border: 2px solid white;
`;

const Stats = styled.p`
  font-size: 16px;
`;

const PokeBall = styled.img`
  position: absolute;
  width: 640px;
  bottom: 0;
  right: -120px;
  opacity: 0.1;
  z-index: 2;
`;
