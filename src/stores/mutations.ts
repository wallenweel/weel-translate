import { Mutation } from 'vuex';
import { State } from '.';

type M = Mutation<State>;

export const update: M = (state, payload: DefaultConfig): void => {
  for (const [name, value] of Object.entries(payload)) {
    state[name] = value;
  }
};

export const clear: M = (state) => {
  state = Object.assign({});
};
