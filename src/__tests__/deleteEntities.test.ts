import { deleteEntities } from "..";

type TestType = { id: number; name?: string };
test("delteEntity should return a new state object", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  const newState = deleteEntities<TestType>(state, []);
  expect(newState).not.toBe(state);
});

test("delteEntity should delete objects with ids or whole objects", () => {
  const state = {
    entities: {
      1: { id: 1, name: "one" },
      2: { id: 2, name: "two" },
    },
    order: [1, 2],
  };

  const newState = deleteEntities<TestType>(state, [{ id: 1 }, 2]);
  expect(newState).toMatchObject({
    entities: {},
    order: [],
  });
});
