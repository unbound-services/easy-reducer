import { insertOrUpdateMultiple } from "..";

test("insertOrUpdate should return a new state object", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    [{ id: 1 }]
  );
  expect(newState).not.toBe(state);
});

test("insertOrUpdate with array should merge objects with existing id", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  // since we're inserting id 1 with no changes, this should have no effect on the state
  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    [{ id: 1 }, { id: 2 }]
  );
  expect(newState).toMatchObject(state);
});

test("insertOrUpdate with map should merge objects with existing id", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  // since we're inserting id 1 with no changes, this should have no effect on the state
  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    { 1: { id: 1 }, 2: { id: 2 } }
  );
  expect(newState).toMatchObject(state);
});

test("insertOrUpdate with array should insert objects with new ids", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
    },
    order: [1, 3],
  };

  const newObject1 = { id: 2, name: "two" };
  const newObject2 = { id: 4, name: "four" };
  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    [newObject1, newObject2]
  );
  expect(newState).toMatchObject({
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
      2: newObject1,
      4: newObject2,
    },
    order: [1, 3, 2, 4],
  });
});

test("insertOrUpdate should insert objects with new ids", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
    },
    order: [1, 3],
  };

  const newObject1 = { id: 2, name: "two" };
  const newObject2 = { id: 4, name: "four" };
  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    { 2: newObject1, 4: newObject2 }
  );
  expect(newState).toMatchObject({
    entities: {
      1: { id: 1, name: "one" },
      3: { id: 3, name: "three" },
      2: newObject1,
      4: newObject2,
    },
    order: [1, 3, 2, 4],
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

  const newState = insertOrUpdateMultiple<{ id: number; name?: string }>(
    state,
    [
      {
        id: 1,
        name: "one-new-name",
      },
      {
        id: 2,
        name: "two-new-name",
      },
    ]
  );
  expect(newState.entities[1].name).toBe("one-new-name");
  expect(newState.entities[2].name).toBe("two-new-name");
});
