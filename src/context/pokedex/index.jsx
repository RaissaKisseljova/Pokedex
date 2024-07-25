import React, { createContext, useState } from "react";
const nullFunction = () => null;

const defaultState = {
  pokemons: [],
  setPokemons: nullFunction,
  loading: true,
  setLoading: nullFunction,
  selectedPokemon: {},
  setSelectedPokemon: nullFunction,
  showModal: false,
  setShowModal: nullFunction,
  allTypes: [],
  setAllTypes: nullFunction,
  searchValue: "",
  setSearchValue: nullFunction,
  errorMessage: "",
  setErrorMessage: nullFunction,
};

const PokedexState = createContext(defaultState);

const PokedexProvider = ({ children }) => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [allTypes, setAllTypes] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <PokedexState.Provider
      value={{
        pokemons,
        setPokemons,
        loading,
        setLoading,
        selectedPokemon,
        setSelectedPokemon,
        showModal,
        setShowModal,
        allTypes,
        setAllTypes,
        searchValue,
        setSearchValue,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </PokedexState.Provider>
  );
};

export { PokedexProvider, PokedexState };
