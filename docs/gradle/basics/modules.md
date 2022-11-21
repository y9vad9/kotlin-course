# Модулі
Розгляньмо модулі: як і з чим їх їдять. Нагадаю, що таке модуль:
:::info термінологія
**Модуль** – це самостійна одиниця організації коду, що має певний набір формальних правил, які визначають поведінку модуля.
:::
За приклад візьмемо модуль «Foo»:
![файлова структура](images/gradle-project-foo-module.svg#invert)
Щоб створити модуль, перш за все, ми створюємо директорії цього модуля. Після чого, створюємо файл з іменем
«build.gradle.kts» (і ніяк інакше), де вже будемо прописувати, що наш модуль вміє.
## Структура build.gradle.kts
Наш файл з налаштуваннями має наступну структуру:
![структура build.gradle.kts](images/gradle-build-script-structure.svg#invert)
Як ми вже обговорювали, налаштування модуля визначають з якою мовою програмування ми будемо працювати, з якою платформою,
де та таке інше. Насправді це реалізовано за допомогою плагінів, які не залежать конкретно від Kotlin, Java чи Swift –
це налаштування відповідних плагінів (наприклад, платформа для Kotlin – це лише плагін типу `kotlin.js` або `kotlin.android`).

### Плагіни
Плагіни визначають, що наш модуль буде робити: у що компілюватись, на яку платформу й таке інше в залежності від самого
плагіну написаного для Gradle.

Для того, щоб зробити, наприклад, Kotlin проєкт для JVM платформи, ми використовуємо плагін `kotlin.jvm` наступним
чином:
```kotlin title="foo/build.gradle.kts"
plugins {
    id("org.jetbrains.kotlin.jvm") version "1.7.21"
}
```
Я створюю блок `plugins {}` та записую в ньому плагіни, що будуть використовуватись для модуля. За допомогою 
`id(String)` я задаю ідентифікатор плагіна, який мені потрібен, після чого вказую версію цього плагіна (в нашому випадку,
це версія Котліна, яка мені потрібна).

:::tip спрощення
До речі, всі плагіни, що відносяться до Kotlin, можна задавати трішки простіше, наприклад:
```kotlin
plugins {
    kotlin("js") version "1.7.21"
    // або
    kotlin("jvm") version "1.7.21"
    // або
    kotlin("android") version "1.7.21"
    // або
    kotlin("multiplatform") version "1.7.21"
}
```
:::

#### Репозиторії
Але спробувавши зконструювати подібний проєкт, ви отримаєте помилку – Gradle не знає звідки брати ці плагіни (потрібно
вказати віддалене розташування, репозиторій). Вказати репозиторій можна наступним чином:
```kotlin
repositories {
    maven("якась лінка до репозиторія")
}
```
Але, у нас присутні вже заготовлені репозиторії, які використовують майже всі розробники:
```repositories
repositories {
    mavenCental()
}
```
Також є й інші вбудовані репозиторії типу `google()` й інших.
### Таски (завдання)
:::info визначення
**Таски** (завдання) – це така собі конфігурація окремих речей, що визначаються плагіном.
:::
Прикладом таски, може бути, наприклад `KotlinCompile`:
```kotlin
tasks.withType<KotlinCompile> {
    kotlinOptions {
        // якісь налаштування
    }
}
```
Але поки ми не будемо їх детально розглядати, бо новачкам це зовсім не потрібно.
### Залежності
Пишучи код на Kotlin, ми використовували стандартну бібліотеку з багатьма-багатьма функціями. Але, це все ж обмежена
за спектром можливостей бібліотека, тож зазвичай в реальному коді вам знадобляться й інші бібліотеки, які додаються
дуже легко, за аналогією з плагінами:
```kotlin
dependencies {
    implementation("group:artifactId:version")
}
```
Наприклад, візьмемо [ktor](https://ktor.io):
```kotlin
dependencies {
    implementation("io.ktor:ktor-server-core:2.1.0")
}
```
Розберім же, що таке group, artifact та version, дуже коротко:
- `group` – це теж саме, що й пакет у Kotlin, що ідентифікує наш проєкт.
- `artifact` – це модуль конкретного додатка або бібліотеки (`artifactId` – його назва).
- `version` – версія нашого модуля.

Всі ці властивості можна задати в нашому `build.gradle.kts`:
```kotlin title="foo/build.gradle.kts" {5-6}
plugins {
    kotlin("jvm") version "1.7.21"
}

group = "com.y9vad9.smth"
version = "0.0.1" // за замовчуванням тут було б "UNSPECIFIED"

repositories {
    mavenCentral()
}

dependencies {
    implementation("io.ktor:ktor-server-core:2.1.0")
}
```
Також варто враховувати, що для залежностей нам також потрібні [репозиторії](#репозиторії).

## Налаштування проєкту
Після того, як ми описали, як наш модуль буде працювати, нам потрібно вказати проєкту, щоб він ініціалізував цей модуль
та використовував у своїй роботі. Це робиться наступним чином:
```kotlin title="first-project/settings.gradle.kts" {3}
rootProject.name = "first-project"

include(":foo")
```
Варто зазначити, що замість `/`, які ми використовуємо для вказування розташування файлу, ми використовуємо `:`.
У цьому випадку, ми вказуємо, що пошук модуля починається з кореневої директорії до директорії `foo`.

:::caution увага
Проєкт та модулі не можна називати з пробілом чи з іншими специфічними символами. Варто використовувати **kebab-case**.
:::
## Висновок
Так само як і у випадку з проєктом, наші модулі мають свої властивості, які власні тільки їм. `build.gradle.kts` файл
має наступні блоки: `plugins {}`, `repositories {}` та `dependencies {}`, що визначають те, що робить наш модуль. Також
у цьому файлі ми можемо вказувати деякі метадані нашого проєкту типу `version` чи `group`.