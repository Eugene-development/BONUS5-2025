# Настройка автокомплита для проекта Bonus5

## Проблема с автокомплитом

В проекте на Svelte 5 могут возникать проблемы с автокомплитом из-за нескольких факторов:

1. Отсутствие правильной конфигурации TypeScript
2. Отсутствие настроек редактора кода
3. Проблемы с расширениями для Svelte
4. Особенности работы Svelte 5 (рекомпозиция API)

## Решение проблемы

### 1. Установка расширений VSCode

Убедитесь, что у вас установлены следующие расширения:

- Svelte for VS Code (svelte.svelte-vscode)
- Prettier - Code formatter (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)

Вы можете установить их через панель расширений VSCode или выполнив команду:

```bash
code --install-extension svelte.svelte-vscode
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
```

### 2. Перезапуск IDE

После установки расширений и создания конфигурационных файлов, перезапустите VSCode:

1. Закройте VSCode
2. Откройте проект заново

### 3. Перезапуск сервера языка Svelte

Если автокомплит все еще не работает:

1. Откройте палитру команд (Cmd+Shift+P или Ctrl+Shift+P)
2. Введите и выберите "Svelte: Restart Language Server"

### 4. Проверка работы автокомплита

Проверьте работу автокомплита в файлах .svelte:

- При вводе HTML-тегов
- При использовании директив Svelte (on:, bind:, etc.)
- При использовании $props() и других функций Svelte 5

### 5. Дополнительные настройки

Если проблемы с автокомплитом сохраняются, попробуйте следующее:

1. Убедитесь, что в настройках VSCode включена опция "TypeScript > Suggest: Enabled"
2. Проверьте, что в настройках VSCode включена опция "Editor > Quick Suggestions > Strings"
3. Выполните команду "TypeScript: Restart TS Server" через палитру команд

## Особенности Svelte 5

Svelte 5 использует новый подход к реактивности через функции вместо специального синтаксиса. Это может влиять на работу автокомплита:

```svelte
<script>
  // Svelte 5 использует $props(), $state() и другие функции
  let { children } = $props();
  let count = $state(0);
</script>
```

Автокомплит для этих новых функций может работать не так хорошо, как для старого синтаксиса Svelte 3/4, поскольку расширения все еще адаптируются к новому API.

## Полезные ресурсы

- [Документация Svelte 5](https://svelte-5-preview.vercel.app/docs)
- [Руководство по миграции на Svelte 5](https://svelte-5-preview.vercel.app/docs/migration)
- [Репозиторий Svelte Language Tools](https://github.com/sveltejs/language-tools)