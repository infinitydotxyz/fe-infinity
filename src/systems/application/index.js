import React from 'react';
import styles from './interface/styles';
import events from './interface/events';
import settings from './interface/settings';
import { useMachine } from '@xstate/react';
import { machine, service } from './definition';
import { useHotkeys } from 'react-hotkeys-hook';

/*
  ======================================
    'create' hook creates a localized
    version of the state chart of this system.
    If you wish to create a shared service
    of this system, then you need to use the `.use`
    function, after you've wrapped the tree
    in the provider.
  ======================================
*/
export const create = () => {
  const [state, send, service] = useMachine(machine, { devTools: true });
  const data = {
    settings: settings(state, send),
    styles: styles(state, send, settings(state, send)),
    events: events(state, send, settings(state, send))
  };

  /*
    ======================================
      Keybindings:
      1. layout.next             =   Ctrl + Shift + Up
      2. layout.prev             =   Ctrl + Shift + Down
      3. theme.next              =   Ctrl + Shift + Right
      4. theme.prev              =   Ctrl + Shift + Left
    ======================================
  */

  useHotkeys('ctrl+shift+down', (e) => {
    const element = document.activeElement;
    e.preventDefault();
    element?.blur();
    data.settings.layout.events.prev();
    element?.focus();
  });

  useHotkeys('ctrl+shift+up', (e) => {
    const element = document.activeElement;
    e.preventDefault();
    element?.blur();
    data.settings.layout.events.next();
    element?.focus();
  });

  useHotkeys('ctrl+shift+left', (e) => {
    const element = document.activeElement;
    e.preventDefault();
    element?.blur();
    data.settings.theme.events.prev();
    element?.focus();
  });

  useHotkeys('ctrl+shift+right', (e) => {
    const element = document.activeElement;
    e.preventDefault();
    element?.blur();
    data.settings.theme.events.next();
    element?.focus();
  });

  return { state, ...data };
};
/*
  ======================================
    Code below is just the framework-glue
    required to run the state machine
    (described within definition) within react.
  ======================================
*/
export const Context = React.createContext();
export const Consumer = Context.Consumer;
export const Provider = (p) => <Context.Provider value={create()} {...p} />;
export const use = () => React.useContext(Context);
export default { machine, service, Context, Provider, Consumer, use, create };
