import { persisted } from 'svelte-persisted-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const user = persisted('user', {})
export const tokens = persisted('tokens', {})