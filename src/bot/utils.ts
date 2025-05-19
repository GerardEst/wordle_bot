export function getDaysRemainingInMonth() {
  const avui = new Date()
  const ultimDiaMes = new Date(
    avui.getFullYear(),
    avui.getMonth() + 1,
    0
  ).getDate()
  const diesRestants = ultimDiaMes - avui.getDate()

  return diesRestants
}
