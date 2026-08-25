# Storybook `@layout/core`

Здесь лежат development-only истории, которыми владеет `@layout/core`.
Production-пакет их не экспортирует, не включает в свой TypeScript project и
не получает зависимости от Storybook или UI.

Каталог использует общий `@zavx0z/storybook/stories`, но сохраняет семантику у
Layout. Метаданные доступны сразу, а каждая реальная история загружается своим
dynamic import только после выбора точного маршрута:

- `ui-runtime/target/hud` создаёт `RuntimeStory` для `UiRuntime.addHudSurface()`;
- `ui-runtime/target/spatial-display` создаёт отдельный `RuntimeStory` для
  `UiRuntime.addSurface()`.

Это две разные цели вывода. Переключение камеры у HUD-истории не превращает её
в пространственную поверхность. Неизвестный suffix остаётся неизвестным и не
выбирает первую историю как fallback.
