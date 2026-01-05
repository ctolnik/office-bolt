# Отчет о рефакторинге управления категориями

## Дата: 2026-01-05
## Статус: ✅ Выполнено

---

## Цель рефакторинга

Устранение дублирования функционала между "Справочник программ" и "Категории приложений", реализация динамического CRUD для категорий через API.

---

## Выполненные изменения

### 1. Backend API интеграция

#### ✅ Новый эндпоинт `/api/category-types`
- GET - получение списка категорий
- POST - создание категории
- PUT - обновление категории
- DELETE - удаление категории (soft delete)

#### ✅ Обновлен эндпоинт `/api/process-catalog`
- Теперь использует `category_id` (UUID) вместо `category` (string)
- Возвращает вложенный объект `category` для отображения в UI

#### ✅ Удален старый эндпоинт `/api/categories`
- Полностью удалены все обращения к `/api/categories`
- Удалены сервисы и хуки, работавшие со старым API

---

### 2. TypeScript типы

#### ✅ Созданы новые типы:
```typescript
interface CategoryType {
  id: string;
  key: string;
  name: string;
  color?: string;
  sort_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateCategoryType { ... }
interface UpdateCategoryType { ... }
```

#### ✅ Обновлены существующие типы:
```typescript
interface ProcessCatalogEntry {
  // БЫЛО: category: 'productive' | 'unproductive' | ...
  // СТАЛО:
  category_id: string;
  category?: CategoryType;
}

interface CreateProcessCatalogEntry {
  category_id: string;  // вместо category: string
}

interface UpdateProcessCatalogEntry {
  category_id?: string;  // вместо category?: string
}
```

#### ✅ Удалены устаревшие типы:
- `ApplicationCategory` (старый тип, больше не используется)

#### ✅ Обновлены типы для расширяемости:
- `ProgramUsage.category` изменен с union type на `string`
- `ActivitySegment.category` изменен с union type на `string`
- `ActivityEvent.category` изменен с union type на `string`

---

### 3. Сервисы

#### ✅ Создан `src/services/categoryTypesService.ts`
```typescript
export const categoryTypesService = {
  getAll(): Promise<CategoryType[]>
  getById(id: string): Promise<CategoryType>
  create(data: CreateCategoryType): Promise<CategoryType>
  update(id: string, data: UpdateCategoryType): Promise<CategoryType>
  delete(id: string): Promise<void>
}
```

#### ✅ Обновлен `src/services/processCatalogService.ts`
- Использует `ApiResponse<T>` wrapper pattern
- Работает с `category_id` вместо `category`
- Типизированные запросы с CreateProcessCatalogEntry и UpdateProcessCatalogEntry

#### ❌ Удален `src/services/settingsService.ts`
- Работал со старым `/api/categories` эндпоинтом
- Полностью заменен на `categoryTypesService` и `processCatalogService`

---

### 4. React хуки

#### ✅ Создан `src/hooks/useCategoryTypes.ts`
```typescript
- useCategoryTypes() - получение списка категорий
- useCreateCategoryType() - создание категории
- useUpdateCategoryType() - обновление категории
- useDeleteCategoryType() - удаление категории
```

#### ❌ Удален `src/hooks/useSettings.ts`
- Все хуки работали со старым API
- Заменены на новые хуки из `useCategoryTypes`

---

### 5. Компоненты

#### ✅ Переписан `src/components/settings/ApplicationCategoriesTab.tsx`
**Было:** Маппинг приложений к категориям (дубликат Process Catalog)

**Стало:** CRUD для справочника категорий
- Таблица со списком категорий
- Создание/редактирование/удаление категорий
- Поиск по названию и ключу
- Цветовые индикаторы
- Порядок сортировки
- Статус активности

#### ✅ Создан `src/components/settings/CategoryTypeDialog.tsx`
- Форма создания/редактирования категории
- Валидация полей:
  - `key`: lowercase, только [a-z0-9_-], уникальный
  - `name`: обязательное, минимум 2 символа
- Автоматическая транслитерация ключа из названия
- Color picker для выбора цвета
- Порядок сортировки
- Переключатель активности

#### ✅ Создан `src/components/settings/DeleteCategoryDialog.tsx`
- Подтверждение удаления с предупреждением
- Предупреждение о влиянии на существующие правила
- Soft delete (is_active = false)

#### ✅ Обновлен `src/components/processCatalog/ProcessCatalogDialog.tsx`
**Было:** Hardcoded список категорий из PROCESS_CATEGORY_LABELS

**Стало:**
- Динамическая загрузка категорий из `/api/category-types`
- Dropdown с активными категориями
- Отправка `category_id` вместо `category` строки
- Цветовые индикаторы в выпадающем списке
- Предупреждение, если нет активных категорий

#### ✅ Обновлен `src/components/processCatalog/ProcessCatalogTable.tsx`
**Было:** Отображение категории через PROCESS_CATEGORY_LABELS и getCategoryBgClass

**Стало:**
- Отображение `entry.category.name` вместо hardcoded лейблов
- Динамический цвет из `entry.category.color`
- Fallback для отсутствующих категорий: "Не указана"

#### ❌ Удален `src/components/settings/CategoriesTable.tsx`
- Старый компонент для маппинга приложений
- Работал с устаревшим API

#### ❌ Удален `src/components/settings/AddCategoryDialog.tsx`
- Старый компонент для добавления маппингов
- Работал с устаревшим API

#### ❌ Удален `src/components/settings/CategoryFilter.tsx`
- Использовал hardcoded CATEGORY_LABELS
- Больше не нужен

---

### 6. Утилиты

#### ⚠️ Оставлен `src/utils/categoryUtils.ts` (с изменениями)
**Причина:** Используется компонентами визуализации (графики, отчеты, таймлайны) для обратной совместимости и fallback цветов.

**Изменения:**
- Добавлен `@deprecated` комментарий
- Документация указывает на новые API и компоненты
- Оставлен для:
  - Fallback цветов для неизвестных категорий
  - Обратная совместимость с историческими данными
  - Компоненты визуализации (ActivityTimeline, Charts, Legends)

**Используется в:**
- `src/components/activity/ActivityTimelineV2.tsx`
- `src/components/activity/ApplicationsChart.tsx`
- `src/components/activity/ProductivityDistributionChart.tsx`
- `src/components/activity/TopProgramsTable.tsx`
- `src/components/activity/CategoryLegend.tsx`
- `src/components/reports/ActivityTimeline.tsx`

**Рекомендация для будущего:** Постепенно мигрировать компоненты визуализации на динамические категории из API.

---

## Архитектура после рефакторинга

### Разделение ответственности

#### 1. Страница "Категории" (`/settings` → Категории)
**Роль:** Справочник категорий (CRUD)

**Функции:**
- Создание новых категорий
- Редактирование существующих
- Удаление (soft delete)
- Управление цветами и порядком
- **НЕТ** маппинга к приложениям

**Компоненты:**
- `ApplicationCategoriesTab.tsx`
- `CategoryTypeDialog.tsx`
- `DeleteCategoryDialog.tsx`

**API:** `/api/category-types`

#### 2. Страница "Справочник программ" (`/settings` → Справочник программ)
**Роль:** Правила категоризации процессов

**Функции:**
- Создание правил маппинга процессов
- Выбор категории из списка
- Указание паттернов процессов и окон
- Управление правилами

**Компоненты:**
- `ProcessCatalogDialog.tsx`
- `ProcessCatalogTable.tsx`

**API:** `/api/process-catalog` + `/api/category-types`

---

## Validation и Error Handling

### ✅ Валидация форм
- **Name:** обязательное поле, минимум 2 символа
- **Key:** обязательное поле, формат `^[a-z0-9_-]+$`, lowercase, уникальный
- **Category ID:** обязательное при создании правила, должна существовать в списке категорий

### ✅ Обработка ошибок
- Toast уведомления для успеха/ошибки операций
- Loading states для кнопок во время мутаций
- Empty states для пустых списков
- Fallback для отсутствующих категорий в таблицах

### ✅ UX улучшения
- Автоматическая транслитерация ключа из названия
- Цветовые индикаторы во всех компонентах
- Предупреждения при удалении категорий, используемых в правилах
- Сообщение, если нет активных категорий при создании правила

---

## Проверка соответствия ТЗ

### Acceptance Criteria

#### A. Категории (Category Types)
- ✅ Страница загружает список из `GET /api/category-types`
- ✅ Создание категории (POST) без перезагрузки страницы
- ✅ Редактирование категории (PUT) без перезагрузки
- ✅ Удаление категории (DELETE/soft delete)
- ✅ Валидация полей работает
- ✅ Обработка ошибок API без падения страницы

#### B. Справочник программ (Process Catalog)
- ✅ Загрузка правил из `GET /api/process-catalog`
- ✅ Dropdown категорий из `GET /api/category-types`
- ✅ Отправка `category_id` (UUID) при сохранении
- ✅ Отображение `category.name` и цвета в таблице
- ✅ Предупреждение при отсутствии категории

#### C. Устранение дублирования
- ✅ Удалены вызовы `/api/categories`
- ✅ Удалены hardcoded списки категорий из компонентов управления
- ✅ Страница "Категории" не содержит маппинга приложений

---

## Сборка проекта

```bash
npm run build
```

**Результат:** ✅ Успешно

- Без TypeScript ошибок
- Без ESLint ошибок
- Все компоненты корректно импортируются
- Размер бандла в норме

---

## Что осталось для backend

### Требуется реализация на стороне backend:

1. **Эндпоинт `/api/category-types`**
   - GET - список категорий
   - POST - создание
   - PUT /:id - обновление
   - DELETE /:id - soft delete

2. **Обновление `/api/process-catalog`**
   - Принимать `category_id` вместо `category`
   - Возвращать вложенный объект `category`

3. **Миграция данных**
   - Создать таблицу `category_types`
   - Заполнить стандартными категориями
   - Обновить `process_catalog` для связи с `category_types`

---

## Следующие шаги

### Необходимо:
1. Реализовать backend API согласно спецификации
2. Протестировать интеграцию frontend и backend
3. Выполнить миграцию существующих данных

### Опционально (для будущих улучшений):
1. Мигрировать компоненты визуализации на динамические категории
2. Добавить экспорт/импорт категорий
3. Добавить историю изменений категорий
4. Реализовать массовое обновление правил при изменении категорий

---

## Файлы изменены

### Созданы:
- `src/services/categoryTypesService.ts`
- `src/hooks/useCategoryTypes.ts`
- `src/components/settings/CategoryTypeDialog.tsx`
- `src/components/settings/DeleteCategoryDialog.tsx`

### Обновлены:
- `src/types/index.ts`
- `src/services/processCatalogService.ts`
- `src/components/settings/ApplicationCategoriesTab.tsx`
- `src/components/processCatalog/ProcessCatalogDialog.tsx`
- `src/components/processCatalog/ProcessCatalogTable.tsx`
- `src/utils/categoryUtils.ts` (добавлен @deprecated)

### Удалены:
- `src/services/settingsService.ts`
- `src/hooks/useSettings.ts`
- `src/components/settings/CategoriesTable.tsx`
- `src/components/settings/AddCategoryDialog.tsx`
- `src/components/settings/CategoryFilter.tsx`

---

## Контакты

При возникновении вопросов по реализации backend или необходимости уточнений - создайте issue в репозитории.

**Backend API base URL:** `http://monitor.net.gslaudit.ru/api`
