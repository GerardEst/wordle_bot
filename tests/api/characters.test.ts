import { assertEquals } from "@std/assert";
import { SBCharacter } from "../../src/interfaces.ts";
import {
  findCharacterIdByName,
  transformChatCharacters,
} from "../../src/api/characters.ts";

// Mock data
const MOCK_CHARACTERS: SBCharacter[] = [
  { id: 1, name: "Aragorn", hability: 85 },
  { id: 2, name: "Legolas", hability: 90 },
  { id: 3, name: "Gimli", hability: 75 },
  { id: 4, name: "Gandalf", hability: 95 },
];

const MOCK_CHAT_CHARACTERS = [
  { characters: { id: 1, name: "Aragorn", hability: 85 } },
  { characters: { id: 2, name: "Legolas", hability: 90 } },
];

Deno.test("transformChatCharacters - should handle empty characters list", () => {
  const result = transformChatCharacters([]);
  assertEquals(result, []);
});

Deno.test("transformChatCharacters - should transform single character correctly", () => {
  const mockData = [
    { characters: { id: 1, name: "Aragorn", hability: 85 } },
  ];

  const result = transformChatCharacters(mockData);
  assertEquals(result, [
    { id: 1, name: "Aragorn", hability: 85 },
  ]);
});

Deno.test("transformChatCharacters - should transform multiple characters correctly", () => {
  const result = transformChatCharacters(MOCK_CHAT_CHARACTERS);
  assertEquals(result, [
    { id: 1, name: "Aragorn", hability: 85 },
    { id: 2, name: "Legolas", hability: 90 },
  ]);
});

Deno.test("transformChatCharacters - should preserve all character properties", () => {
  const mockData = [
    { characters: { id: 999, name: "Test Character", hability: 42 } },
  ];

  const result = transformChatCharacters(mockData);
  assertEquals(result[0].id, 999);
  assertEquals(result[0].name, "Test Character");
  assertEquals(result[0].hability, 42);
});

Deno.test("findCharacterIdByName - should find existing character", () => {
  const result = findCharacterIdByName(MOCK_CHARACTERS, "Aragorn");
  assertEquals(result, 1);
});

Deno.test("findCharacterIdByName - should find character with different cases (exact match)", () => {
  const result = findCharacterIdByName(MOCK_CHARACTERS, "Legolas");
  assertEquals(result, 2);
});

Deno.test("findCharacterIdByName - should return null for non-existing character", () => {
  const result = findCharacterIdByName(MOCK_CHARACTERS, "Frodo");
  assertEquals(result, null);
});

Deno.test("findCharacterIdByName - should return null for empty name", () => {
  const result = findCharacterIdByName(MOCK_CHARACTERS, "");
  assertEquals(result, null);
});

Deno.test("findCharacterIdByName - should handle empty characters list", () => {
  const result = findCharacterIdByName([], "Aragorn");
  assertEquals(result, null);
});

Deno.test("findCharacterIdByName - should be case sensitive", () => {
  const result = findCharacterIdByName(MOCK_CHARACTERS, "aragorn"); // lowercase
  assertEquals(result, null);
});

Deno.test("character hability values - should be within reasonable range", () => {
  MOCK_CHARACTERS.forEach((character) => {
    assertEquals(
      character.hability >= 0,
      true,
      `Hability should be >= 0 for ${character.name}`,
    );
    assertEquals(
      character.hability <= 100,
      true,
      `Hability should be <= 100 for ${character.name}`,
    );
  });
});

Deno.test("character data validation - should have valid properties", () => {
  MOCK_CHARACTERS.forEach((character) => {
    assertEquals(
      typeof character.id,
      "number",
      `ID should be number for ${character.name}`,
    );
    assertEquals(
      typeof character.name,
      "string",
      `Name should be string for ${character.name}`,
    );
    assertEquals(
      typeof character.hability,
      "number",
      `Hability should be number for ${character.name}`,
    );
    assertEquals(
      character.name.length > 0,
      true,
      `Name should not be empty for character ${character.id}`,
    );
  });
});

Deno.test("character sorting by hability - should sort correctly", () => {
  const sorted = [...MOCK_CHARACTERS].sort((a, b) => b.hability - a.hability);

  // Should be: Gandalf (95), Legolas (90), Aragorn (85), Gimli (75)
  assertEquals(sorted[0].name, "Gandalf");
  assertEquals(sorted[1].name, "Legolas");
  assertEquals(sorted[2].name, "Aragorn");
  assertEquals(sorted[3].name, "Gimli");
});

Deno.test("character filtering by hability threshold - should filter correctly", () => {
  const highHabilityCharacters = MOCK_CHARACTERS.filter((char) =>
    char.hability >= 85
  );

  assertEquals(highHabilityCharacters.length, 3);
  assertEquals(
    highHabilityCharacters.some((char) => char.name === "Gandalf"),
    true,
  );
  assertEquals(
    highHabilityCharacters.some((char) => char.name === "Legolas"),
    true,
  );
  assertEquals(
    highHabilityCharacters.some((char) => char.name === "Aragorn"),
    true,
  );
  assertEquals(
    highHabilityCharacters.some((char) => char.name === "Gimli"),
    false,
  );
});
