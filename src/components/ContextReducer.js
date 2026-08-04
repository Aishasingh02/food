import React, { createContext, useContext, useReducer } from "react";

const CartStateContext = createContext();
const CartDispatchContext = createContext();


const reducer = (state, action) => {

  switch(action.type) {


    case "ADD":

      let food = state.find(
        (item) =>
          item.id === action.id &&
          item.size === action.size
      );


      if(food){

        let newState = state.map((item)=>
          item.id === action.id &&
          item.size === action.size
          ?
          {
            ...item,
            qty:item.qty + action.qty,
            price:item.price + action.price
          }
          :
          item
        );

        localStorage.setItem(
          "cartData",
          JSON.stringify(newState)
        );

        return newState;

      }


      let updatedState = [
        ...state,
        {
          id:action.id,
          name:action.name,
          qty:action.qty,
          size:action.size,
          price:action.price,
          img:action.img
        }
      ];


      localStorage.setItem(
        "cartData",
        JSON.stringify(updatedState)
      );


      return updatedState;



    case "REMOVE":

      let removeState =
        state.filter(
          (_,index)=>index!==action.index
        );


      localStorage.setItem(
        "cartData",
        JSON.stringify(removeState)
      );


      return removeState;



    case "DROP":

      localStorage.removeItem("cartData");

      return [];



    default:
      return state;

  }

};



export const CartProvider = ({children})=>{


  const [state,dispatch] = useReducer(
    reducer,
    JSON.parse(localStorage.getItem("cartData")) || []
  );


  return (

    <CartDispatchContext.Provider value={dispatch}>

      <CartStateContext.Provider value={state}>

        {children}

      </CartStateContext.Provider>

    </CartDispatchContext.Provider>

  );

};



export const useCart = () =>
useContext(CartStateContext);


export const useDispatchCart = () =>
useContext(CartDispatchContext);