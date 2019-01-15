import { ActionTree } from 'vuex';
import { State } from './';
import { versionCheck } from '@/functions';
import {
  VERSION_FRESH,
  VERSION_UPDATED,
  VERSION_OUTDATED,
  VERSION_SAME,
  RESET_CONFIG,
  QUERY_CONFIG,
  SET_CONFIG,
  QUERY_TRANSLATION,
  CONTEXT_MENU_TRANSLATING,
} from '@/types';
import { base as baseConfig } from '@/defaults/config';
import { updatedConfigKeys, extensionName } from '@/variables';
import { tabActionSender } from '@/pages/background';
import i18n from '@/i18n';
import debug from '@/functions/debug';

let contextMenusId: string | number | null = null;
const contextMenusListener: menusOnClickedListener = (info) => {
  tabActionSender({
    type: CONTEXT_MENU_TRANSLATING,
    meta: { from: 'background', contextMenus: true },
  });
};

export const actions: ActionTree<State, State> = {
  // TODO: treat most error situations reasonably
  startup: async ({ dispatch, state }): Promise<std> => {
    const [err1, config]: std = await dispatch('storage/init');
    if (err1 !== null) { return [err1]; }

    const [err2] = await dispatch('version', {
      version: baseConfig.version,
      last_version: config.version,
    });
    if (err2 !== null) { return [err2]; }

    return [null];
  },

  version: async ({ state, dispatch }, { version, last_version }): Promise<std> => {
    const [, status, incompatible] = versionCheck(version, last_version);
    const updateVersions = () => dispatch('storage/update', [{ version, last_version }, 'local']);

    switch (status) {
      case VERSION_FRESH: // first install
        await dispatch('storage/reset');
        await updateVersions();
        return [null];

      case VERSION_UPDATED:
        // config keys that needed to reset in this updating
        let keys: Array<keyof DefaultConfig>;

        // the old is not compatible with the new version completely
        // so need to reset keys of all
        if (incompatible === 1) {
          keys = [];
        } else { // incompatible: -1 or 0
          // compatible version, but may need to reset some config items the manifest at
          // @see `src/variables.ts` -> updatedConfigKeys
          keys = Object.entries(updatedConfigKeys).reduce((p: Array<keyof DefaultConfig>, [v, a]) => {
            const [, status] = versionCheck(v, last_version);
            if (status === VERSION_OUTDATED) { return p; }
            return [...p, ...a];
          }, []);
        }

        await dispatch('storage/reset', { keys });
        await updateVersions();
        return [null];

      case VERSION_OUTDATED:
        await dispatch('storage/reset');
        await updateVersions();
        return [null];

      case VERSION_SAME: // nothing change
        return [null];
      default:
        return [null];
    }
  },

  createContextMenus: ({ state }) => {
    if (contextMenusId !== null) { return [null, 'has context menu']; }

    contextMenusId = browser.contextMenus.create({
      id: extensionName,
      title: i18n.t('context_menus_translate') as string,
    });
    browser.contextMenus.onClicked.addListener(contextMenusListener);

    return [null, contextMenusId, contextMenusListener];
  },

  removeContextMenus: () => {
    if (contextMenusId === null) { return [null, 'no context menu']; }

    browser.contextMenus.onClicked.removeListener(contextMenusListener);
    browser.contextMenus.remove(contextMenusId);
    contextMenusId = null;

    return [null];
  },
};

export const ipcActions: ActionTree<State, State> = {
  [RESET_CONFIG]: async ({ dispatch }, { payload: keys }): Promise<std> => {
    return await dispatch('storage/reset', { keys });
  },

  [QUERY_CONFIG]: async ({ dispatch }, { payload: keys }): Promise<std> => {
    return await dispatch('storage/query', { keys });
  },

  [SET_CONFIG]: async ({ dispatch }, { payload: config, storage = 'local' }) => {
    return await dispatch('storage/update', [config, storage as storageType]);
  },

  [QUERY_TRANSLATION]: async ({ dispatch }, { payload: { type, params } }) => {
    return await dispatch('translation/query', { type, params });
  },
};

export default {
  ...actions,
  ...ipcActions,
};
