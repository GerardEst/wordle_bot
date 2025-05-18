import { assertEquals } from '@std/assert'
import { getPoints } from './main.ts'

Deno.test(function addTest() {
  assertEquals(getPoints('ElMot 1/6'), 5)
})
