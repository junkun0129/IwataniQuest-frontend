import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType = {
  userId: string;
  email: string;
  name: string;
  status: {
    at: number;
    exp: number;
    requireExp: number;
    hp: number;
    maxmumHp: number;
    level: number;
  };
};
const initialState: initialStateType = {
  userId: "",
  email: "",
  name: "",
  status: {
    at: 0,
    exp: 0,
    requireExp: 0,
    hp: 0,
    maxmumHp: 0,
    level: 0,
  },
};

export const userStatusSlice = createSlice({
  name: "userStatus",
  initialState,
  reducers: {
    createUser: (state, action: PayloadAction<initialStateType>) => {
      (state.userId = action.payload.userId),
        (state.email = action.payload.email),
        (state.name = action.payload.name),
        (state.status = {
          at: action.payload.status.at,
          exp: action.payload.status.exp,
          requireExp: action.payload.status.requireExp,
          hp: action.payload.status.hp,
          maxmumHp: action.payload.status.maxmumHp,
          level: action.payload.status.level,
        });
    },
    getAttackFromEnemy: (state, action: PayloadAction<{ attack: number }>) => {
      state.status.hp = state.status.hp - action.payload.attack;
    },
    restoreHP: (state, action: PayloadAction<{ hp: number }>) => {
      state.status.hp = action.payload.hp;
    },
    getExp: (state, action: PayloadAction<{ exp: number }>) => {
      console.log(state.status.exp, "original exp");
      console.log(action.payload.exp, "income exp");
      console.log(state.status.requireExp, "requireexp");
      let remainExp = action.payload.exp;

      if (state.status.exp + remainExp > state.status.requireExp) {
        console.log(";lk");
        console.log(remainExp);
        console.log(state.status.requireExp);
        do {
          console.log(";lk");

          const previousLevel = state.status.level;
          const previousExp = state.status.exp;
          state.status.level++;

          //set next require exp
          const previousRequireExp = state.status.requireExp;
          const A = previousRequireExp * 1.1;
          const B = previousLevel * 15;

          const nextRequireExp = (A + B) / 2;
          state.status.requireExp = Math.ceil(nextRequireExp);

          //set next exp
          remainExp -= previousRequireExp - previousExp;
        } while (remainExp > state.status.requireExp);

        state.status.exp = Math.ceil(remainExp);
      } else {
        console.log(";lk");

        state.status.exp += Math.ceil(remainExp);
      }
    },
  },
});

export default userStatusSlice.reducer;
export const { createUser, getAttackFromEnemy, restoreHP, getExp } =
  userStatusSlice.actions;
