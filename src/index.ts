import { isObject } from "./util";

/**
 * @description converts a single object, or integer mapped object, to an array
 * @deprecated this came as a way not to accidentally parse normalize objects. Typescript prevents this
 * @param item
 * @returns
 */
export function arrayWrap(item: any): any[] {
  let retItem = item;

  // if it's an array, we don't want to rewrap it
  if (Array.isArray(item)) {
    return item;
  }

  if (isObject(item)) {
    // if its not an array, see if its an object mapped as an array
    const keys = Object.keys(item);
    let isMappedObject = true;
    let keysUUIDs = true;

    for (let i = 0; i < keys.length; i++) {
      // we could probably do better, but this is a cheap way
      // to see if the thing coming in has already been normalized
      if (keys[i] && keys[i].length !== 36) keysUUIDs = false;
      if (isNaN(keys[i] as any) && !keysUUIDs) {
        isMappedObject = false;
        break;
      }
    }

    // if its a mapped object convert it to an array
    if (isMappedObject) {
      retItem = keys.map((id) => item[id]);
    } else {
      // otherwise just wrap it in an array
      retItem = [item];
    }
  }

  return [retItem];
}

/**
 *
 * @param state the easy-reducer-compatible state
 * @param item the item to insert or update. Can be an object or the entities object out of a normalizr call
 * @param idField optional - the id field of the entity. Defaults to "id"
 * @returns
 */
export const insertOrUpdate = <
  EntityType extends EasyReducerEntity = EasyReducerEntity
>(
  state: EasyReducerState<EntityType>,
  item: EntityType,
  idField: ObjectKey = "id"
): EasyReducerState<EntityType> => {
  const newState: EasyReducerState = { ...state };
  newState.entities = { ...newState.entities };
  // stash if new item
  const itemId = item[idField];

  if (!newState.entities[itemId]) {
    if (!newState.order) newState.order = [];
    newState.order = [...newState.order];
    newState.order.push(itemId);
    newState.entities[itemId] = item;
  } else {
    // update existing item
    // allow for partial update
    newState.entities[itemId] = Object.assign(
      {},
      newState.entities[itemId],
      item
    );
  }

  return newState;
};

/**
 *  @param state the easy-reducer-compatible state
 * @param items an array of items to delete - can be the objects themselves, or their ids
 * @param idField optional - the id field of the entity. Defaults to "id"
 * */
export const deleteEntities = <
  EntityType extends EasyReducerEntity = EasyReducerEntity
>(
  state: EasyReducerState<EntityType>,
  itemsOrIds: (EntityType | ObjectKey)[],
  idField: ObjectKey = "id"
): EasyReducerState<EntityType> => {
  const newState: EasyReducerState = { ...state };
  newState.entities = { ...newState.entities };
  newState.order = [...newState.order];
  itemsOrIds.forEach((item) => {
    let id;
    if (isObject(item)) {
      id = (item as EntityType)[idField];
    } else {
      id = item as ObjectKey;
    }
    // remove the object from the entities
    delete newState.entities[id];
    // remove the object from the order
    const index = newState.order.indexOf(id);
    if (index > -1) {
      newState.order.splice(index, 1);
    }
  });

  return newState;
};

/**
 *
 * @param state the easy-reducer-compatible state
 * @param items the list of items to insert or update. Can be an array or the entities object out of a normalizr call
 * @param idField optional - the id field of the entity. Defaults to "id"
 * @returns the reduced state
 */
export function insertOrUpdateMultiple<
  EntityType extends EasyReducerEntity = EasyReducerEntity
>(
  state: EasyReducerState<EntityType>,
  items: EntityStore<EntityType> | EntityType[],
  idField: ObjectKey = "id"
): EasyReducerState<EntityType> {
  // make sure theres something to add
  if (!items) return state;
  if (!state.entities) {
    throw new Error(
      "insertOrUpdateMultiple requires a normalized state object with entity and order fields"
    );
  }

  // if its an object, we assume its a map of entities
  let newState = { ...state };

  // this works on both arrays and objects
  let itemArray: EntityType[];
  if (Array.isArray(items)) {
    itemArray = items;
  } else {
    itemArray = Object.values(items as EntityStore<EntityType>) as EntityType[];
  }
  itemArray.forEach((item) => {
    // stash if new item
    newState = insertOrUpdate(newState, item);
  });

  return newState;
}

// ==============================================
//    SELECTORS
// ==============================================

/**
 *
 * @param list
 * @returns
 */
// normalizr helpers
export function denormalize(normalizedData: NormalizedData, list: ObjectKey[]) {
  // consider removing this
  if (!list) {
    if (normalizedData.order) {
      list = normalizedData.order;
    } else {
      throw "No order provided or found in state";
    }
  }

  const retList = list.map((id) => normalizedData.entities[id]);

  return retList;
}

/**============== ============== ==============
 * ============== TYPES ===========
 *============== ============== ============== */

export interface EasyReducerEntity {
  [attributeKey: string]: ObjectKey;
}

export type AdditionalProps = {
  // Your additional properties here...
};

export type Entity<IDName extends ObjectKey = "id"> = EasyReducerEntity &
  AdditionalProps;

export type EntityStore<EntityType extends EasyReducerEntity = any> = {
  [objectId: ObjectKey]: EntityType;
};

/**
 * @member entities - the normalized list of entities - the unique copy of each entity
 */
export interface NormalizedData<EntityType extends EasyReducerEntity = any> {
  entities: EntityStore<EntityType>;
  order?: ObjectKey[];
}

// the easyreducer state always has an order object
export interface EasyReducerState<EntityType extends EasyReducerEntity = any>
  extends NormalizedData<EntityType> {
  order: ObjectKey[];
}

export type ObjectKey = string | number;
