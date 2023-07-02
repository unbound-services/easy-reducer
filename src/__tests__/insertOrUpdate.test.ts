import { insertOrUpdate, insertOrUpdateMultiple } from "..";

test("insertOrUpdate should return a new state object", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  const newState = insertOrUpdate<{ id: number; name?: string }>(state, {
    id: 1,
  });
  expect(newState).not.toBe(state);
});

test("insertOrUpdate should merge objects with existing id", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  // since we're inserting id 1 with no changes, this should have no effect on the state
  const newState = insertOrUpdate<{ id: number; name?: string }>(state, {
    id: 1,
  });
  expect(newState).toMatchObject(state);
});

test("insertOrUpdate should insert objects with new ids", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
    },
    order: [1, 3],
  };

  const newObject = { id: 2, name: "two" };
  const newState = insertOrUpdate<{ id: number; name?: string }>(
    state,
    newObject
  );
  expect(newState).toMatchObject({
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
      2: newObject,
    },
    order: [1, 3, 2],
  });
});

test("insertOrUpdate should overwrite properties of existing ids", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  const newState = insertOrUpdate<{ id: number; name?: string }>(state, {
    id: 1,
    name: "one-new-name",
  });
  expect(newState.entities[1].name).toBe("one-new-name");
});
