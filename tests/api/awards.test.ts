import { assertEquals } from "@std/assert";
import { SBAward } from "../../src/interfaces.ts";
import { processAwards } from "../../src/api/awards.ts";

Deno.test("processAwards - should handle empty awards", () => {
  const result = processAwards([]);
  assertEquals(result, []);
});

Deno.test("processAwards - should process user awards correctly", () => {
  const mockData: SBAward[] = [
    {
      trophy_id: 50,
      users: { id: 1, name: "Player1" },
      characters: { id: 100, name: "Character1" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
  ];

  const result = processAwards(mockData);
  assertEquals(result, [
    {
      id: 50,
      chatId: 123,
      userId: 1,
      userName: "Player1",
      name: "Zeus d'or",
      emoji: "🥇🧔🏼",
      date: "2024-07-15T10:00:00.000Z",
    },
  ]);
});

Deno.test("processAwards - should process character awards correctly", () => {
  const mockData: SBAward[] = [
    {
      trophy_id: 51,
      users: { id: 0, name: "" }, // No user data
      characters: { id: 100, name: "Character1" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
  ];

  const result = processAwards(mockData);
  assertEquals(result, [
    {
      id: 51,
      chatId: 123,
      userId: 100,
      userName: "Character1",
      name: "Tro de plata",
      emoji: "🥈⛈️",
      date: "2024-07-15T10:00:00.000Z",
    },
  ]);
});

Deno.test("processAwards - should filter out awards with unknown trophy_id", () => {
  const mockData: SBAward[] = [
    {
      trophy_id: 999, // Unknown trophy ID
      users: { id: 1, name: "Player1" },
      characters: { id: 100, name: "Character1" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
    {
      trophy_id: 50, // Known trophy ID
      users: { id: 2, name: "Player2" },
      characters: { id: 101, name: "Character2" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
  ];

  const result = processAwards(mockData);
  assertEquals(result.length, 1);
  assertEquals(result[0].id, 50);
  assertEquals(result[0].userName, "Player2");
});

Deno.test("processAwards - should handle multiple awards", () => {
  const mockData: SBAward[] = [
    {
      trophy_id: 50,
      users: { id: 1, name: "Player1" },
      characters: { id: 100, name: "Character1" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
    {
      trophy_id: 200,
      users: { id: 2, name: "Player2" },
      characters: { id: 101, name: "Character2" },
      chat_id: 124,
      created_at: "2024-07-16T10:00:00.000Z",
    },
  ];

  const result = processAwards(mockData);
  assertEquals(result.length, 2);
  assertEquals(result[0].name, "Zeus d'or");
  assertEquals(result[1].name, "Ram de disculpes");
});

Deno.test("processAwards - should handle mixed user and character awards", () => {
  const mockData: SBAward[] = [
    {
      trophy_id: 50,
      users: { id: 1, name: "Player1" }, // User award
      characters: { id: 100, name: "Character1" },
      chat_id: 123,
      created_at: "2024-07-15T10:00:00.000Z",
    },
    {
      trophy_id: 51,
      users: { id: 0, name: "" }, // Character award (no user)
      characters: { id: 101, name: "Character2" },
      chat_id: 123,
      created_at: "2024-07-16T10:00:00.000Z",
    },
  ];

  const result = processAwards(mockData);
  assertEquals(result.length, 2);
  assertEquals(result[0].userId, 1); // User ID
  assertEquals(result[0].userName, "Player1");
  assertEquals(result[1].userId, 101); // Character ID
  assertEquals(result[1].userName, "Character2");
});
